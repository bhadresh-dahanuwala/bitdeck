import {
  FULL_DECK_MASK,
  cardIndex,
  cardKey,
  isSingleCard,
  isValidMask,
  lowestCardKey,
  maskAnd,
  maskAndNot,
  maskContains,
  maskOr,
  popcount,
  type CardMask,
} from "./bits";
import { extractCards, type Card } from "./card";
import { type Rng } from "./random";

/** `order[index]` for a `Uint8Array(52)` index the caller guarantees is 0–51 (see call sites). */
function orderAt(order: Uint8Array, index: number): number {
  return (order as unknown as readonly [number, ...number[]])[index as 0];
}

function assertValidMask(mask: CardMask): void {
  if (!isValidMask(mask)) {
    throw new RangeError(`Invalid card mask: ${String(mask)}`);
  }
}

function assertSingleCardKey(key: CardMask): void {
  if (!isSingleCard(key)) {
    throw new RangeError(`Invalid card key: ${String(key)}`);
  }
}

/**
 * Configuration options for constructing a `Deck`.
 *
 * @example
 * ```ts
 * const deck = new Deck({ rng: mulberry32(42), cards: FULL_DECK_MASK });
 * ```
 */
export interface DeckOptions {
  /** Random number generator returning values in `[0, 1)`. Defaults to `Math.random`. */
  rng?: Rng;
  /** Initial set of cards as a 52-bit `CardMask`. Defaults to `FULL_DECK_MASK`. */
  cards?: CardMask;
}

/**
 * A mutable playing card deck backed by a 52-bit `CardMask` and a preallocated `Uint8Array(52)` card order.
 *
 * @example
 * ```ts
 * const deck = new Deck();
 * deck.count(); // 52
 * const hand = deck.dealCards(5);
 * deck.count(); // 47
 * ```
 */
export class Deck {
  #key: CardMask = 0;
  readonly #order = new Uint8Array(52);
  #start = 0;
  #end = 0;
  readonly #rng: Rng;

  constructor(options?: DeckOptions) {
    this.#rng = options?.rng ?? Math.random;
    if (options?.cards !== undefined) {
      assertValidMask(options.cards);
      this.addCards(options.cards);
    } else {
      this.reset();
    }
  }

  /**
   * Bitmask representing all cards currently remaining in the deck.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.key === FULL_DECK_MASK; // true
   * ```
   */
  get key(): CardMask {
    return this.#key;
  }

  /**
   * Returns the number of cards currently remaining in the deck.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.count(); // 52
   * ```
   */
  count(): number {
    return popcount(this.#key);
  }

  /**
   * Returns `true` if all cards in `cards` are currently in the deck.
   * Throws `RangeError` if `cards` is not a valid `CardMask`.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.contains(0x1); // true
   * ```
   */
  contains(cards: CardMask): boolean {
    assertValidMask(cards);
    return maskContains(this.#key, cards);
  }

  /**
   * Returns all cards currently in the deck in ascending bit index order (`2♣` through `A♠`).
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.getCards().length; // 52
   * ```
   */
  getCards(): Card[] {
    return extractCards(this.#key);
  }

  /**
   * Returns all remaining cards in the deck in ascending bit index order (alias of `getCards()`).
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.getRemainingCards().length; // 52
   * ```
   */
  getRemainingCards(): Card[] {
    return extractCards(this.#key);
  }

  /**
   * Returns the bitmask of all remaining cards in the deck (same as `deck.key`).
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.getRemainingCardsKey() === FULL_DECK_MASK; // true
   * ```
   */
  getRemainingCardsKey(): CardMask {
    return this.#key;
  }

  /**
   * Removes all cards from the deck.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.clear();
   * deck.count(); // 0
   * ```
   */
  clear(): void {
    this.#key = 0;
    this.#start = 0;
    this.#end = 0;
  }

  /**
   * Restores the deck to all 52 cards in ascending bit index order (`0`–`51`), keeping the configured `rng`.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.dealCards(5);
   * deck.reset();
   * deck.count(); // 52
   * ```
   */
  reset(): void {
    this.#key = FULL_DECK_MASK;
    this.#start = 0;
    this.#end = 52;
    for (let i = 0; i < 52; i++) {
      this.#order[i] = i;
    }
  }

  /**
   * Randomly shuffles the order of the remaining cards in the deck using Fisher–Yates.
   * Already-dealt cards are not put back into the deck.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.dealCards(10);
   * deck.shuffle();
   * deck.count(); // 42
   * ```
   */
  shuffle(): void {
    for (let i = this.#end - 1; i > this.#start; i--) {
      const j = this.#start + Math.floor(this.#rng() * (i - this.#start + 1));
      const tmp = orderAt(this.#order, i);
      this.#order[i] = orderAt(this.#order, j);
      this.#order[j] = tmp;
    }
  }

  /**
   * Adds a single card `key` to the end of the deck order if not already present (no-op if present).
   * Throws `RangeError` if `key` is not a valid single-card bitmask.
   *
   * @example
   * ```ts
   * const deck = new Deck({ cards: 0 });
   * deck.addCard(0x1);
   * deck.count(); // 1
   * ```
   */
  addCard(key: CardMask): void {
    assertSingleCardKey(key);
    if (maskContains(this.#key, key)) {
      return;
    }
    this.#order.copyWithin(0, this.#start, this.#end);
    this.#end -= this.#start;
    this.#start = 0;
    this.#order[this.#end] = cardIndex(key);
    this.#end++;
    this.#key = maskOr(this.#key, key);
  }

  /**
   * Adds any missing cards from `cards` to the end of the deck order in ascending bit index order.
   * Throws `RangeError` if `cards` is not a valid `CardMask`.
   *
   * @example
   * ```ts
   * const deck = new Deck({ cards: 0 });
   * deck.addCards(0x3);
   * deck.count(); // 2
   * ```
   */
  addCards(cards: CardMask): void {
    assertValidMask(cards);
    const missing = maskAndNot(cards, this.#key);
    if (missing === 0) {
      return;
    }
    this.#order.copyWithin(0, this.#start, this.#end);
    this.#end -= this.#start;
    this.#start = 0;
    for (
      let m = maskAnd(missing, FULL_DECK_MASK), k = lowestCardKey(m);
      k !== 0;
      m -= k, k = lowestCardKey(m)
    ) {
      this.#order[this.#end] = cardIndex(k);
      this.#end++;
    }
    this.#key = maskOr(this.#key, missing);
  }

  /**
   * Removes a single card `key` from the deck if present (no-op if absent), preserving the order of the rest.
   * Throws `RangeError` if `key` is not a valid single-card bitmask.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.removeCard(0x1);
   * deck.contains(0x1); // false
   * ```
   */
  removeCard(key: CardMask): void {
    assertSingleCardKey(key);
    if (!maskContains(this.#key, key)) {
      return;
    }
    this.#removePresentMask(key);
  }

  /**
   * Removes all cards in `cards` that are currently present in the deck, preserving the order of the rest.
   * Throws `RangeError` if `cards` is not a valid `CardMask`.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.removeCards(0x3);
   * deck.count(); // 50
   * ```
   */
  removeCards(cards: CardMask): void {
    assertValidMask(cards);
    const present = maskAnd(this.#key, cards);
    if (present === 0) {
      return;
    }
    this.#removePresentMask(present);
  }

  /**
   * Deals `count` cards from the deck as a combined `CardMask` and removes them from the deck.
   * When `shuffle` is `true` (default), performs a partial Fisher–Yates selection making `count` calls to `rng`.
   * When `shuffle` is `false`, deals the first `count` cards from the current deck order.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * const hand = deck.dealCards(2, false); // 0x3 (2♣ and 2♦)
   * ```
   */
  dealCards(count = 1, shuffle = true): CardMask {
    if (typeof count !== "number" || !Number.isInteger(count)) {
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

    let dealt = 0;
    if (shuffle) {
      for (let i = 0; i < count; i++) {
        const cur = this.#start + i;
        const j = cur + Math.floor(this.#rng() * (this.#end - cur));
        const chosen = orderAt(this.#order, j);
        this.#order[j] = orderAt(this.#order, cur);
        // Each dealt card in #order[#start..#end] is distinct, so its bit is not yet set in dealt.
        dealt += cardKey(chosen);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const chosen = orderAt(this.#order, this.#start + i);
        // Each dealt card in #order[#start..#end] is distinct, so its bit is not yet set in dealt.
        dealt += cardKey(chosen);
      }
    }
    this.#start += count;
    // Every dealt card was present in #key, so subtraction clears exactly those bits.
    this.#key -= dealt;
    return dealt;
  }

  /**
   * Deals a specific single card `key` from the deck and removes it.
   * Throws `RangeError` if `key` is not a valid single-card bitmask or is not in the deck.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.dealSpecificCard(0x1); // 0x1
   * ```
   */
  dealSpecificCard(key: CardMask): CardMask {
    assertSingleCardKey(key);
    if (!maskContains(this.#key, key)) {
      throw new RangeError("Card not in deck");
    }
    this.#removePresentMask(key);
    return key;
  }

  /**
   * Atomically deals all cards in `cards` from the deck and removes them.
   * Throws `RangeError` (without modifying the deck) if `cards` is invalid or any card in `cards` is absent.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * deck.dealSpecificCards(0x3); // 0x3
   * ```
   */
  dealSpecificCards(cards: CardMask): CardMask {
    assertValidMask(cards);
    if (!maskContains(this.#key, cards)) {
      throw new RangeError("Card not in deck");
    }
    if (cards !== 0) {
      this.#removePresentMask(cards);
    }
    return cards;
  }

  /**
   * Returns an independent copy of the deck with the same remaining cards, card order, and `rng` function.
   *
   * @example
   * ```ts
   * const deck = new Deck();
   * const copy = deck.clone();
   * copy.dealCards(5);
   * deck.count(); // 52
   * ```
   */
  clone(): Deck {
    const copy = new Deck({ rng: this.#rng, cards: 0 });
    copy.#key = this.#key;
    copy.#start = this.#start;
    copy.#end = this.#end;
    copy.#order.set(this.#order);
    return copy;
  }

  #removePresentMask(toRemove: CardMask): void {
    let write = 0;
    for (let i = this.#start; i < this.#end; i++) {
      const idx = orderAt(this.#order, i);
      if (!maskContains(toRemove, cardKey(idx))) {
        this.#order[write] = idx;
        write++;
      }
    }
    this.#start = 0;
    this.#end = write;
    this.#key = maskAndNot(this.#key, toRemove);
  }
}
