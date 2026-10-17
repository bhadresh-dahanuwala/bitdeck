import { type Rng } from "../src/random";

/** `order[index]` for a `Uint8Array(52)` index guaranteed to be in `0..51`. */
function orderAt(order: Uint8Array, index: number): number {
  return (order as unknown as readonly [number, ...number[]])[index as 0];
}

const CARD_KEYS_BIGINT: readonly bigint[] = Object.freeze(
  Array.from({ length: 52 }, (_, i) => 1n << BigInt(i)),
);

/**
 * Full 52-card deck bitmask as a `bigint` (`(1n << 52n) - 1n`).
 *
 * @example
 * ```ts
 * popcountBigInt(FULL_DECK_MASK_BIGINT); // 52
 * ```
 */
export const FULL_DECK_MASK_BIGINT: bigint = (1n << 52n) - 1n;

/**
 * Returns the single-card `bigint` bitmask (`1n << BigInt(index)`) for `0 <= index < 52`, or `0n` otherwise.
 *
 * @example
 * ```ts
 * cardKeyBigInt(0); // 1n
 * cardKeyBigInt(51); // 2251799813685248n
 * ```
 */
export function cardKeyBigInt(index: number): bigint {
  return CARD_KEYS_BIGINT[index] ?? 0n;
}

/**
 * Computes the bitwise OR (`a | b`) of two `bigint` card masks.
 *
 * @example
 * ```ts
 * maskOrBigInt(1n, 2n); // 3n
 * ```
 */
export function maskOrBigInt(a: bigint, b: bigint): bigint {
  return a | b;
}

/**
 * Computes the bitwise difference (`a & ~b`) of two `bigint` card masks.
 *
 * @example
 * ```ts
 * maskAndNotBigInt(3n, 1n); // 2n
 * ```
 */
export function maskAndNotBigInt(a: bigint, b: bigint): bigint {
  return a & ~b;
}

/**
 * Counts the number of set bits in a 52-bit `bigint` card mask using 64-bit SWAR popcount.
 *
 * @example
 * ```ts
 * popcountBigInt(FULL_DECK_MASK_BIGINT); // 52
 * ```
 */
export function popcountBigInt(m: bigint): number {
  let v = m - ((m >> 1n) & 0x5555555555555n);
  v = (v & 0x3333333333333n) + ((v >> 2n) & 0x3333333333333n);
  v = (v + (v >> 4n)) & 0x0f0f0f0f0f0f0fn;
  return Number((v * 0x01010101010101n) >> 48n) & 0xff;
}

/**
 * Computes the 13-bit rank presence mask from a 52-bit `bigint` card mask using SWAR bit folding.
 *
 * @example
 * ```ts
 * rankMaskBigInt(0x1n | 0x2n | 0x10n); // 0b11
 * ```
 */
export function rankMaskBigInt(m: bigint): number {
  let v = (m | (m >> 1n) | (m >> 2n) | (m >> 3n)) & 0x1111111111111n;
  v = (v | (v >> 3n)) & 0x03030303030303n;
  v = (v | (v >> 6n)) & 0x000f000f000f000fn;
  v = (v | (v >> 12n)) & 0x000000ff000000ffn;
  return Number((v | (v >> 24n)) & 0x1fffn);
}

/**
 * Reference `bigint`-backed deck using the same `Uint8Array(52)` layout, validation, and
 * partial Fisher–Yates deal algorithm as `Deck`, substituting `bigint` bitmasks for `CardMask` (`number`).
 *
 * @example
 * ```ts
 * const deck = new BigIntDeck();
 * const hand = deck.dealCards(7);
 * popcountBigInt(hand); // 7
 * ```
 */
export class BigIntDeck {
  #key = 0n;
  readonly #order = new Uint8Array(52);
  #start = 0;
  #end = 0;
  readonly #rng: Rng;

  constructor(rng: Rng = Math.random) {
    this.#rng = rng;
    this.reset();
  }

  get key(): bigint {
    return this.#key;
  }

  reset(): void {
    this.#key = FULL_DECK_MASK_BIGINT;
    for (let i = 0; i < 52; i++) {
      this.#order[i] = i;
    }
    this.#start = 0;
    this.#end = 52;
  }

  dealCards(count = 1, shuffle = true): bigint {
    if (!Number.isInteger(count)) {
      throw new RangeError(`Invalid card count: ${String(count)}`);
    }
    if (count < 0) {
      throw new RangeError("Cannot draw a negative number of cards");
    }
    const remaining = this.#end - this.#start;
    if (count > remaining) {
      throw new RangeError(
        `Only ${String(remaining)} cards remaining; cannot draw ${String(count)}`,
      );
    }
    if (count === 0) {
      return 0n;
    }

    let dealt = 0n;
    if (shuffle) {
      const rng = this.#rng;
      for (let i = 0; i < count; i++) {
        const cur = this.#start + i;
        const randIdx = cur + Math.floor(rng() * (this.#end - cur));
        const chosen = orderAt(this.#order, randIdx);
        this.#order[randIdx] = orderAt(this.#order, cur);
        this.#order[cur] = chosen;
        dealt = maskOrBigInt(dealt, cardKeyBigInt(chosen));
      }
      this.#start += count;
    } else {
      for (let i = 0; i < count; i++) {
        const chosen = orderAt(this.#order, this.#start + i);
        dealt = maskOrBigInt(dealt, cardKeyBigInt(chosen));
      }
      this.#start += count;
    }
    this.#key = maskAndNotBigInt(this.#key, dealt);
    return dealt;
  }
}
