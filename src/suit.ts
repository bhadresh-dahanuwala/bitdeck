import { cardIndex } from "./bits";

/**
 * Represents the suit of a playing card (Clubs, Diamonds, Hearts, Spades).
 *
 * @example
 * ```ts
 * const suit = new Suit(0x1, "C", "Club", "♣");
 * suit.code; // "C"
 * suit.symbol; // "♣"
 * suit.index; // 0
 * String(suit); // "♣"
 * ```
 */
export class Suit {
  readonly key: number;
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly index: number;

  constructor(key: number, code: string, name: string, symbol: string) {
    this.key = key;
    this.code = code;
    this.name = name;
    this.symbol = symbol;
    this.index = cardIndex(key);
  }

  /**
   * Returns the Unicode symbol for the suit (e.g., `"♣"`, `"♦"`, `"♥"`, `"♠"`).
   *
   * @example
   * ```ts
   * SPADE.toString(); // "♠"
   * ```
   */
  toString(): string {
    return this.symbol;
  }

  /**
   * Serializes the suit to its single-character code in JSON (e.g., `"C"`, `"D"`, `"H"`, `"S"`).
   *
   * @example
   * ```ts
   * JSON.stringify(SPADE); // '"S"'
   * ```
   */
  toJSON(): string {
    return this.code;
  }
}

/**
 * Club suit (`♣`, code `"C"`, key `0x1`, index `0`).
 *
 * @example
 * ```ts
 * CLUB.symbol; // "♣"
 * ```
 */
export const CLUB: Suit = Object.freeze(new Suit(0x1, "C", "Club", "♣"));

/**
 * Diamond suit (`♦`, code `"D"`, key `0x2`, index `1`).
 *
 * @example
 * ```ts
 * DIAMOND.symbol; // "♦"
 * ```
 */
export const DIAMOND: Suit = Object.freeze(new Suit(0x2, "D", "Diamond", "♦"));

/**
 * Heart suit (`♥`, code `"H"`, key `0x4`, index `2`).
 *
 * @example
 * ```ts
 * HEART.symbol; // "♥"
 * ```
 */
export const HEART: Suit = Object.freeze(new Suit(0x4, "H", "Heart", "♥"));

/**
 * Spade suit (`♠`, code `"S"`, key `0x8`, index `3`).
 *
 * @example
 * ```ts
 * SPADE.symbol; // "♠"
 * ```
 */
export const SPADE: Suit = Object.freeze(new Suit(0x8, "S", "Spade", "♠"));

/**
 * Total number of standard playing card suits (`4`).
 *
 * @example
 * ```ts
 * NUM_SUITS; // 4
 * ```
 */
export const NUM_SUITS = 4;

/**
 * Frozen list of Unicode suit symbols in `cardspy` order (`"♠"`, `"♥"`, `"♦"`, `"♣"`).
 *
 * @example
 * ```ts
 * SUIT_SYMBOLS; // ["♠", "♥", "♦", "♣"]
 * ```
 */
export const SUIT_SYMBOLS: readonly string[] = Object.freeze(["♠", "♥", "♦", "♣"]);

/**
 * Frozen list of single-character suit codes in ascending suit index order (`"C"`, `"D"`, `"H"`, `"S"`).
 *
 * @example
 * ```ts
 * SUIT_CODES; // ["C", "D", "H", "S"]
 * ```
 */
export const SUIT_CODES: readonly string[] = Object.freeze(["C", "D", "H", "S"]);

/**
 * Frozen list of all 4 `Suit` instances in ascending index order (`CLUB`, `DIAMOND`, `HEART`, `SPADE`).
 *
 * @example
 * ```ts
 * ALL_SUITS[0]; // CLUB
 * ALL_SUITS[3]; // SPADE
 * ```
 */
export const ALL_SUITS: readonly Suit[] = Object.freeze([CLUB, DIAMOND, HEART, SPADE]);
