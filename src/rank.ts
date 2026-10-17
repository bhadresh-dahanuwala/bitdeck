import { cardIndex } from "./bits";

/**
 * Represents the rank of a playing card (e.g., Two through Ace).
 *
 * @example
 * ```ts
 * const rank = new Rank(0x1, "2", "Two");
 * rank.code; // "2"
 * rank.name; // "Two"
 * rank.index; // 0
 * String(rank); // "2"
 * ```
 */
export class Rank {
  readonly key: number;
  readonly code: string;
  readonly name: string;
  readonly index: number;

  constructor(key: number, code: string, name: string) {
    this.key = key;
    this.code = code;
    this.name = name;
    this.index = cardIndex(key);
  }

  /**
   * Returns the single-character rank code (e.g., `"2"`, `"T"`, `"A"`).
   *
   * @example
   * ```ts
   * RA.toString(); // "A"
   * ```
   */
  toString(): string {
    return this.code;
  }

  /**
   * Serializes the rank to its single-character code in JSON.
   *
   * @example
   * ```ts
   * JSON.stringify(RA); // '"A"'
   * ```
   */
  toJSON(): string {
    return this.code;
  }
}

/**
 * Rank Two (`2`, key `0x1`, index `0`).
 *
 * @example
 * ```ts
 * R2.code; // "2"
 * ```
 */
export const R2: Rank = Object.freeze(new Rank(0x1, "2", "Two"));

/**
 * Rank Three (`3`, key `0x2`, index `1`).
 *
 * @example
 * ```ts
 * R3.code; // "3"
 * ```
 */
export const R3: Rank = Object.freeze(new Rank(0x2, "3", "Three"));

/**
 * Rank Four (`4`, key `0x4`, index `2`).
 *
 * @example
 * ```ts
 * R4.code; // "4"
 * ```
 */
export const R4: Rank = Object.freeze(new Rank(0x4, "4", "Four"));

/**
 * Rank Five (`5`, key `0x8`, index `3`).
 *
 * @example
 * ```ts
 * R5.code; // "5"
 * ```
 */
export const R5: Rank = Object.freeze(new Rank(0x8, "5", "Five"));

/**
 * Rank Six (`6`, key `0x10`, index `4`).
 *
 * @example
 * ```ts
 * R6.code; // "6"
 * ```
 */
export const R6: Rank = Object.freeze(new Rank(0x10, "6", "Six"));

/**
 * Rank Seven (`7`, key `0x20`, index `5`).
 *
 * @example
 * ```ts
 * R7.code; // "7"
 * ```
 */
export const R7: Rank = Object.freeze(new Rank(0x20, "7", "Seven"));

/**
 * Rank Eight (`8`, key `0x40`, index `6`).
 *
 * @example
 * ```ts
 * R8.code; // "8"
 * ```
 */
export const R8: Rank = Object.freeze(new Rank(0x40, "8", "Eight"));

/**
 * Rank Nine (`9`, key `0x80`, index `7`).
 *
 * @example
 * ```ts
 * R9.code; // "9"
 * ```
 */
export const R9: Rank = Object.freeze(new Rank(0x80, "9", "Nine"));

/**
 * Rank Ten (`T`, key `0x100`, index `8`).
 *
 * @example
 * ```ts
 * RT.code; // "T"
 * ```
 */
export const RT: Rank = Object.freeze(new Rank(0x100, "T", "Ten"));

/**
 * Rank Jack (`J`, key `0x200`, index `9`).
 *
 * @example
 * ```ts
 * RJ.code; // "J"
 * ```
 */
export const RJ: Rank = Object.freeze(new Rank(0x200, "J", "Jack"));

/**
 * Rank Queen (`Q`, key `0x400`, index `10`).
 *
 * @example
 * ```ts
 * RQ.code; // "Q"
 * ```
 */
export const RQ: Rank = Object.freeze(new Rank(0x400, "Q", "Queen"));

/**
 * Rank King (`K`, key `0x800`, index `11`).
 *
 * @example
 * ```ts
 * RK.code; // "K"
 * ```
 */
export const RK: Rank = Object.freeze(new Rank(0x800, "K", "King"));

/**
 * Rank Ace (`A`, key `0x1000`, index `12`).
 *
 * @example
 * ```ts
 * RA.code; // "A"
 * ```
 */
export const RA: Rank = Object.freeze(new Rank(0x1000, "A", "Ace"));

/**
 * Total number of standard playing card ranks (`13`).
 *
 * @example
 * ```ts
 * NUM_RANKS; // 13
 * ```
 */
export const NUM_RANKS = 13;

/**
 * Frozen list of all 13 single-character rank codes in ascending rank order (`"2"` through `"A"`).
 *
 * @example
 * ```ts
 * RANK_CODES[0]; // "2"
 * RANK_CODES[12]; // "A"
 * ```
 */
export const RANK_CODES: readonly string[] = Object.freeze([
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
]);

/**
 * Frozen list of all 13 `Rank` instances in ascending order (`R2` through `RA`).
 *
 * @example
 * ```ts
 * ALL_RANKS[0]; // R2
 * ALL_RANKS[12]; // RA
 * ```
 */
export const ALL_RANKS: readonly Rank[] = Object.freeze([
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  RT,
  RJ,
  RQ,
  RK,
  RA,
]);

/**
 * Frozen list of all 13 `Rank` instances in descending order (`RA` through `R2`).
 *
 * @example
 * ```ts
 * RANKS_DESC[0]; // RA
 * RANKS_DESC[12]; // R2
 * ```
 */
export const RANKS_DESC: readonly Rank[] = Object.freeze([
  RA,
  RK,
  RQ,
  RJ,
  RT,
  R9,
  R8,
  R7,
  R6,
  R5,
  R4,
  R3,
  R2,
]);
