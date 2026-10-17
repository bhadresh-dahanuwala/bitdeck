/**
 * A 52-bit playing card bitmask stored as a standard IEEE-754 double (`number`).
 *
 * Card index `i = rankIndex * 4 + suitIndex` (`0 <= i < 52`) corresponds to bit `2 ** i`.
 * Never apply JavaScript's 32-bit bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`)
 * directly to a `CardMask`; always use the helpers in this module.
 *
 * @example
 * ```ts
 * const twoOfClubs: CardMask = 0x1;
 * const aceOfSpades: CardMask = 2 ** 51;
 * const hand = maskOr(twoOfClubs, aceOfSpades);
 * ```
 */
export type CardMask = number;

const TWO_POW_32 = 0x100000000;

/**
 * Bitmask with all 52 card bits set (`2 ** 52 - 1`).
 *
 * @example
 * ```ts
 * popcount(FULL_DECK_MASK); // 52
 * ```
 */
export const FULL_DECK_MASK: CardMask = 0xfffffffffffff;

/**
 * Bitmask of all 13 club cards (`0x1111111111111`).
 *
 * @example
 * ```ts
 * popcount(CLUBS); // 13
 * ```
 */
export const CLUBS: CardMask = 0x1111111111111;

/**
 * Bitmask of all 13 diamond cards (`0x2222222222222`).
 *
 * @example
 * ```ts
 * popcount(DIAMONDS); // 13
 * ```
 */
export const DIAMONDS: CardMask = 0x2222222222222;

/**
 * Bitmask of all 13 heart cards (`0x4444444444444`).
 *
 * @example
 * ```ts
 * popcount(HEARTS); // 13
 * ```
 */
export const HEARTS: CardMask = 0x4444444444444;

/**
 * Bitmask of all 13 spade cards (`0x8888888888888`).
 *
 * @example
 * ```ts
 * popcount(SPADES); // 13
 * ```
 */
export const SPADES: CardMask = 0x8888888888888;

/**
 * Read-only array of 13 masks, where `SAME_RANKS[r]` has the 4 suit bits set for rank index `r` (`0xF * 16 ** r`).
 *
 * @example
 * ```ts
 * SAME_RANKS[0]; // 0xf (all four 2s)
 * SAME_RANKS[12]; // 0xf000000000000 (all four Aces)
 * ```
 */
export const SAME_RANKS: readonly CardMask[] = Object.freeze([
  0xf, 0xf0, 0xf00, 0xf000, 0xf0000, 0xf00000, 0xf000000, 0xf0000000, 0xf00000000, 0xf000000000,
  0xf0000000000, 0xf00000000000, 0xf000000000000,
]);

const CARD_KEYS = new Float64Array(52);
for (let i = 0; i < 52; i++) {
  CARD_KEYS[i] = 2 ** i;
}

/**
 * Checks whether a value is a valid 52-bit `CardMask` (an integer `m` with `0 <= m <= FULL_DECK_MASK`).
 *
 * @example
 * ```ts
 * isValidMask(0); // true
 * isValidMask(FULL_DECK_MASK); // true
 * isValidMask(-1); // false
 * isValidMask(1.5); // false
 * ```
 */
export function isValidMask(m: unknown): m is CardMask {
  return typeof m === "number" && Number.isInteger(m) && m >= 0 && m <= FULL_DECK_MASK;
}

/**
 * Checks whether a `CardMask` has exactly one bit set (represents a single card).
 *
 * @example
 * ```ts
 * isSingleCard(1); // true
 * isSingleCard(2 ** 51); // true
 * isSingleCard(0); // false
 * isSingleCard(3); // false
 * ```
 */
export function isSingleCard(m: CardMask): boolean {
  if (!isValidMask(m) || m === 0) {
    return false;
  }
  const lo = m >>> 0;
  const hi = (m / TWO_POW_32) >>> 0;
  if (lo !== 0) {
    return hi === 0 && (lo & (lo - 1)) === 0;
  }
  return (hi & (hi - 1)) === 0;
}

/**
 * Computes the 52-bit bitwise AND (`a & b`) of two card masks.
 *
 * @example
 * ```ts
 * maskAnd(0b1011, 0b1101); // 0b1001
 * ```
 */
export function maskAnd(a: CardMask, b: CardMask): CardMask {
  const lo = ((a >>> 0) & (b >>> 0)) >>> 0;
  const hi = (((a / TWO_POW_32) >>> 0) & ((b / TWO_POW_32) >>> 0)) >>> 0;
  return hi * TWO_POW_32 + lo;
}

/**
 * Computes the 52-bit bitwise OR (`a | b`) of two card masks.
 *
 * @example
 * ```ts
 * maskOr(0x1, 0x2); // 0x3
 * ```
 */
export function maskOr(a: CardMask, b: CardMask): CardMask {
  const lo = ((a >>> 0) | (b >>> 0)) >>> 0;
  const hi = (((a / TWO_POW_32) >>> 0) | ((b / TWO_POW_32) >>> 0)) >>> 0;
  return hi * TWO_POW_32 + lo;
}

/**
 * Computes the 52-bit bitwise XOR (`a ^ b`) of two card masks.
 *
 * @example
 * ```ts
 * maskXor(0b1011, 0b1101); // 0b0110
 * ```
 */
export function maskXor(a: CardMask, b: CardMask): CardMask {
  const lo = ((a >>> 0) ^ (b >>> 0)) >>> 0;
  const hi = (((a / TWO_POW_32) >>> 0) ^ ((b / TWO_POW_32) >>> 0)) >>> 0;
  return hi * TWO_POW_32 + lo;
}

/**
 * Computes the 52-bit bitwise difference (`a & ~b`) of two card masks.
 *
 * @example
 * ```ts
 * maskAndNot(0b1011, 0b0011); // 0b1000
 * ```
 */
export function maskAndNot(a: CardMask, b: CardMask): CardMask {
  const lo = ((a >>> 0) & ~(b >>> 0)) >>> 0;
  const hi = (((a / TWO_POW_32) >>> 0) & ~((b / TWO_POW_32) >>> 0)) >>> 0;
  return hi * TWO_POW_32 + lo;
}

/**
 * Returns `true` if every bit set in `subset` is also set in `set`.
 *
 * @example
 * ```ts
 * maskContains(FULL_DECK_MASK, CLUBS); // true
 * maskContains(CLUBS, DIAMONDS); // false
 * ```
 */
export function maskContains(set: CardMask, subset: CardMask): boolean {
  const subLo = subset >>> 0;
  const subHi = (subset / TWO_POW_32) >>> 0;
  return (
    ((set >>> 0) & subLo) >>> 0 === subLo && (((set / TWO_POW_32) >>> 0) & subHi) >>> 0 === subHi
  );
}

/**
 * Returns `true` if `a` and `b` share at least one common set bit.
 *
 * @example
 * ```ts
 * maskIntersects(CLUBS, SAME_RANKS[0]); // true (2 of Clubs)
 * maskIntersects(CLUBS, DIAMONDS); // false
 * ```
 */
export function maskIntersects(a: CardMask, b: CardMask): boolean {
  return (
    ((a >>> 0) & (b >>> 0)) !== 0 || (((a / TWO_POW_32) >>> 0) & ((b / TWO_POW_32) >>> 0)) !== 0
  );
}

function popcount32(x: number): number {
  let v = x - ((x >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return Math.imul((v + (v >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
}

/**
 * Counts the number of set bits (cards) in a 52-bit `CardMask` using SWAR popcount on each 32-bit half.
 *
 * @example
 * ```ts
 * popcount(0); // 0
 * popcount(CLUBS); // 13
 * popcount(FULL_DECK_MASK); // 52
 * ```
 */
export function popcount(m: CardMask): number {
  return popcount32(m >>> 0) + popcount32((m / TWO_POW_32) >>> 0);
}

/**
 * Returns the card index (`0`–`51`) of the lowest set bit in `key`, or `-1` if `key === 0`.
 *
 * @example
 * ```ts
 * cardIndex(0x1); // 0
 * cardIndex(2 ** 51); // 51
 * cardIndex(0); // -1
 * ```
 */
export function cardIndex(key: CardMask): number {
  const lo = key >>> 0;
  if (lo !== 0) {
    return 31 - Math.clz32(lo & -lo);
  }
  const hi = (key / TWO_POW_32) >>> 0;
  if (hi !== 0) {
    return 63 - Math.clz32(hi & -hi);
  }
  return -1;
}

/**
 * Returns the single-card bitmask (`2 ** index`) for a card index `0`–`51` via a precomputed table,
 * or `0` for indices outside `0`–`51`.
 *
 * @example
 * ```ts
 * cardKey(0); // 1
 * cardKey(51); // 2251799813685248 (2 ** 51)
 * cardKey(52); // 0
 * ```
 */
export function cardKey(index: number): CardMask {
  return CARD_KEYS[index] ?? 0;
}

/**
 * Returns the lowest set bit of `m` as a single-card `CardMask`, or `0` if `m === 0`.
 *
 * @example
 * ```ts
 * lowestCardKey(0b1010); // 0b0010
 * lowestCardKey(0); // 0
 * ```
 */
export function lowestCardKey(m: CardMask): CardMask {
  const lo = m >>> 0;
  if (lo !== 0) {
    return (lo & -lo) >>> 0;
  }
  const hi = (m / TWO_POW_32) >>> 0;
  return ((hi & -hi) >>> 0) * TWO_POW_32;
}

/**
 * Invokes `fn(index)` for each set bit in `m` in ascending index order (`0`–`51`).
 *
 * @example
 * ```ts
 * const indices: number[] = [];
 * forEachCardIndex(0b101, (i) => indices.push(i));
 * // indices is [0, 2]
 * ```
 */
export function forEachCardIndex(m: CardMask, fn: (index: number) => void): void {
  let lo = m >>> 0;
  while (lo !== 0) {
    const lsb = lo & -lo;
    fn(31 - Math.clz32(lsb));
    lo ^= lsb;
  }
  let hi = (m / TWO_POW_32) >>> 0;
  while (hi !== 0) {
    const lsb = hi & -hi;
    fn(63 - Math.clz32(lsb));
    hi ^= lsb;
  }
}

function packRankHalf(half: number): number {
  let v = (half | (half >>> 1) | (half >>> 2) | (half >>> 3)) & 0x11111111;
  v = (v | (v >>> 3)) & 0x03030303;
  v = (v | (v >>> 6)) & 0x000f000f;
  return (v | (v >>> 12)) & 0xff;
}

/**
 * Computes the 13-bit rank presence mask (`0`–`0x1fff`) where bit `r` is set if any card of rank `r` is present in `m`.
 *
 * @example
 * ```ts
 * rankMask(0x1 | 0x2 | 0x10); // 0b11 (ranks 2 and 3 present)
 * ```
 */
export function rankMask(m: CardMask): number {
  const lo = packRankHalf(m >>> 0);
  const hi = packRankHalf((m / TWO_POW_32) >>> 0);
  return lo | (hi << 8);
}
