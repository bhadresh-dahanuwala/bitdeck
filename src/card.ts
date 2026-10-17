import { cardIndex, cardKey, forEachCardIndex, maskOr, rankMask, type CardMask } from "./bits";
import { R2, R3, R4, R5, R6, R7, R8, R9, RA, RJ, RK, RQ, RT, type Rank } from "./rank";
import { CLUB, DIAMOND, HEART, SPADE, type Suit } from "./suit";

/**
 * Represents a single standard playing card with its bitmask key, rank, suit, code, name, symbol, and bit index (`0`–`51`).
 *
 * @example
 * ```ts
 * const card = new Card(0x1, R2, CLUB, "2C", "Two of Clubs", "2♣");
 * card.code; // "2C"
 * card.symbol; // "2♣"
 * card.index; // 0
 * String(card); // "2♣"
 * ```
 */
export class Card {
  readonly key: CardMask;
  readonly rank: Rank;
  readonly suit: Suit;
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly index: number;

  constructor(key: CardMask, rank: Rank, suit: Suit, code: string, name: string, symbol: string) {
    this.key = key;
    this.rank = rank;
    this.suit = suit;
    this.code = code;
    this.name = name;
    this.symbol = symbol;
    this.index = cardIndex(key);
  }

  /**
   * Returns the Unicode symbol representation of the card (e.g., `"2♣"`, `"10♥"`, `"A♠"`).
   *
   * @example
   * ```ts
   * CAS.toString(); // "A♠"
   * ```
   */
  toString(): string {
    return this.symbol;
  }

  /**
   * Serializes the card to its two-character code in JSON (e.g., `"2C"`, `"TH"`, `"AS"`).
   *
   * @example
   * ```ts
   * JSON.stringify(CAS); // '"AS"'
   * ```
   */
  toJSON(): string {
    return this.code;
  }
}

/**
 * Two of Clubs (`2♣`, code `"2C"`, key `0x1`, index `0`).
 *
 * @example
 * ```ts
 * C2C.symbol; // "2♣"
 * ```
 */
export const C2C: Card = Object.freeze(new Card(0x1, R2, CLUB, "2C", "Two of Clubs", "2♣"));

/**
 * Two of Diamonds (`2♦`, code `"2D"`, key `0x2`, index `1`).
 *
 * @example
 * ```ts
 * C2D.symbol; // "2♦"
 * ```
 */
export const C2D: Card = Object.freeze(new Card(0x2, R2, DIAMOND, "2D", "Two of Diamonds", "2♦"));

/**
 * Two of Hearts (`2♥`, code `"2H"`, key `0x4`, index `2`).
 *
 * @example
 * ```ts
 * C2H.symbol; // "2♥"
 * ```
 */
export const C2H: Card = Object.freeze(new Card(0x4, R2, HEART, "2H", "Two of Hearts", "2♥"));

/**
 * Two of Spades (`2♠`, code `"2S"`, key `0x8`, index `3`).
 *
 * @example
 * ```ts
 * C2S.symbol; // "2♠"
 * ```
 */
export const C2S: Card = Object.freeze(new Card(0x8, R2, SPADE, "2S", "Two of Spades", "2♠"));

/**
 * Three of Clubs (`3♣`, code `"3C"`, key `0x10`, index `4`).
 *
 * @example
 * ```ts
 * C3C.symbol; // "3♣"
 * ```
 */
export const C3C: Card = Object.freeze(new Card(0x10, R3, CLUB, "3C", "Three of Clubs", "3♣"));

/**
 * Three of Diamonds (`3♦`, code `"3D"`, key `0x20`, index `5`).
 *
 * @example
 * ```ts
 * C3D.symbol; // "3♦"
 * ```
 */
export const C3D: Card = Object.freeze(
  new Card(0x20, R3, DIAMOND, "3D", "Three of Diamonds", "3♦"),
);

/**
 * Three of Hearts (`3♥`, code `"3H"`, key `0x40`, index `6`).
 *
 * @example
 * ```ts
 * C3H.symbol; // "3♥"
 * ```
 */
export const C3H: Card = Object.freeze(new Card(0x40, R3, HEART, "3H", "Three of Hearts", "3♥"));

/**
 * Three of Spades (`3♠`, code `"3S"`, key `0x80`, index `7`).
 *
 * @example
 * ```ts
 * C3S.symbol; // "3♠"
 * ```
 */
export const C3S: Card = Object.freeze(new Card(0x80, R3, SPADE, "3S", "Three of Spades", "3♠"));

/**
 * Four of Clubs (`4♣`, code `"4C"`, key `0x100`, index `8`).
 *
 * @example
 * ```ts
 * C4C.symbol; // "4♣"
 * ```
 */
export const C4C: Card = Object.freeze(new Card(0x100, R4, CLUB, "4C", "Four of Clubs", "4♣"));

/**
 * Four of Diamonds (`4♦`, code `"4D"`, key `0x200`, index `9`).
 *
 * @example
 * ```ts
 * C4D.symbol; // "4♦"
 * ```
 */
export const C4D: Card = Object.freeze(
  new Card(0x200, R4, DIAMOND, "4D", "Four of Diamonds", "4♦"),
);

/**
 * Four of Hearts (`4♥`, code `"4H"`, key `0x400`, index `10`).
 *
 * @example
 * ```ts
 * C4H.symbol; // "4♥"
 * ```
 */
export const C4H: Card = Object.freeze(new Card(0x400, R4, HEART, "4H", "Four of Hearts", "4♥"));

/**
 * Four of Spades (`4♠`, code `"4S"`, key `0x800`, index `11`).
 *
 * @example
 * ```ts
 * C4S.symbol; // "4♠"
 * ```
 */
export const C4S: Card = Object.freeze(new Card(0x800, R4, SPADE, "4S", "Four of Spades", "4♠"));

/**
 * Five of Clubs (`5♣`, code `"5C"`, key `0x1000`, index `12`).
 *
 * @example
 * ```ts
 * C5C.symbol; // "5♣"
 * ```
 */
export const C5C: Card = Object.freeze(new Card(0x1000, R5, CLUB, "5C", "Five of Clubs", "5♣"));

/**
 * Five of Diamonds (`5♦`, code `"5D"`, key `0x2000`, index `13`).
 *
 * @example
 * ```ts
 * C5D.symbol; // "5♦"
 * ```
 */
export const C5D: Card = Object.freeze(
  new Card(0x2000, R5, DIAMOND, "5D", "Five of Diamonds", "5♦"),
);

/**
 * Five of Hearts (`5♥`, code `"5H"`, key `0x4000`, index `14`).
 *
 * @example
 * ```ts
 * C5H.symbol; // "5♥"
 * ```
 */
export const C5H: Card = Object.freeze(new Card(0x4000, R5, HEART, "5H", "Five of Hearts", "5♥"));

/**
 * Five of Spades (`5♠`, code `"5S"`, key `0x8000`, index `15`).
 *
 * @example
 * ```ts
 * C5S.symbol; // "5♠"
 * ```
 */
export const C5S: Card = Object.freeze(new Card(0x8000, R5, SPADE, "5S", "Five of Spades", "5♠"));

/**
 * Six of Clubs (`6♣`, code `"6C"`, key `0x10000`, index `16`).
 *
 * @example
 * ```ts
 * C6C.symbol; // "6♣"
 * ```
 */
export const C6C: Card = Object.freeze(new Card(0x10000, R6, CLUB, "6C", "Six of Clubs", "6♣"));

/**
 * Six of Diamonds (`6♦`, code `"6D"`, key `0x20000`, index `17`).
 *
 * @example
 * ```ts
 * C6D.symbol; // "6♦"
 * ```
 */
export const C6D: Card = Object.freeze(
  new Card(0x20000, R6, DIAMOND, "6D", "Six of Diamonds", "6♦"),
);

/**
 * Six of Hearts (`6♥`, code `"6H"`, key `0x40000`, index `18`).
 *
 * @example
 * ```ts
 * C6H.symbol; // "6♥"
 * ```
 */
export const C6H: Card = Object.freeze(new Card(0x40000, R6, HEART, "6H", "Six of Hearts", "6♥"));

/**
 * Six of Spades (`6♠`, code `"6S"`, key `0x80000`, index `19`).
 *
 * @example
 * ```ts
 * C6S.symbol; // "6♠"
 * ```
 */
export const C6S: Card = Object.freeze(new Card(0x80000, R6, SPADE, "6S", "Six of Spades", "6♠"));

/**
 * Seven of Clubs (`7♣`, code `"7C"`, key `0x100000`, index `20`).
 *
 * @example
 * ```ts
 * C7C.symbol; // "7♣"
 * ```
 */
export const C7C: Card = Object.freeze(new Card(0x100000, R7, CLUB, "7C", "Seven of Clubs", "7♣"));

/**
 * Seven of Diamonds (`7♦`, code `"7D"`, key `0x200000`, index `21`).
 *
 * @example
 * ```ts
 * C7D.symbol; // "7♦"
 * ```
 */
export const C7D: Card = Object.freeze(
  new Card(0x200000, R7, DIAMOND, "7D", "Seven of Diamonds", "7♦"),
);

/**
 * Seven of Hearts (`7♥`, code `"7H"`, key `0x400000`, index `22`).
 *
 * @example
 * ```ts
 * C7H.symbol; // "7♥"
 * ```
 */
export const C7H: Card = Object.freeze(
  new Card(0x400000, R7, HEART, "7H", "Seven of Hearts", "7♥"),
);

/**
 * Seven of Spades (`7♠`, code `"7S"`, key `0x800000`, index `23`).
 *
 * @example
 * ```ts
 * C7S.symbol; // "7♠"
 * ```
 */
export const C7S: Card = Object.freeze(
  new Card(0x800000, R7, SPADE, "7S", "Seven of Spades", "7♠"),
);

/**
 * Eight of Clubs (`8♣`, code `"8C"`, key `0x1000000`, index `24`).
 *
 * @example
 * ```ts
 * C8C.symbol; // "8♣"
 * ```
 */
export const C8C: Card = Object.freeze(new Card(0x1000000, R8, CLUB, "8C", "Eight of Clubs", "8♣"));

/**
 * Eight of Diamonds (`8♦`, code `"8D"`, key `0x2000000`, index `25`).
 *
 * @example
 * ```ts
 * C8D.symbol; // "8♦"
 * ```
 */
export const C8D: Card = Object.freeze(
  new Card(0x2000000, R8, DIAMOND, "8D", "Eight of Diamonds", "8♦"),
);

/**
 * Eight of Hearts (`8♥`, code `"8H"`, key `0x4000000`, index `26`).
 *
 * @example
 * ```ts
 * C8H.symbol; // "8♥"
 * ```
 */
export const C8H: Card = Object.freeze(
  new Card(0x4000000, R8, HEART, "8H", "Eight of Hearts", "8♥"),
);

/**
 * Eight of Spades (`8♠`, code `"8S"`, key `0x8000000`, index `27`).
 *
 * @example
 * ```ts
 * C8S.symbol; // "8♠"
 * ```
 */
export const C8S: Card = Object.freeze(
  new Card(0x8000000, R8, SPADE, "8S", "Eight of Spades", "8♠"),
);

/**
 * Nine of Clubs (`9♣`, code `"9C"`, key `0x10000000`, index `28`).
 *
 * @example
 * ```ts
 * C9C.symbol; // "9♣"
 * ```
 */
export const C9C: Card = Object.freeze(new Card(0x10000000, R9, CLUB, "9C", "Nine of Clubs", "9♣"));

/**
 * Nine of Diamonds (`9♦`, code `"9D"`, key `0x20000000`, index `29`).
 *
 * @example
 * ```ts
 * C9D.symbol; // "9♦"
 * ```
 */
export const C9D: Card = Object.freeze(
  new Card(0x20000000, R9, DIAMOND, "9D", "Nine of Diamonds", "9♦"),
);

/**
 * Nine of Hearts (`9♥`, code `"9H"`, key `0x40000000`, index `30`).
 *
 * @example
 * ```ts
 * C9H.symbol; // "9♥"
 * ```
 */
export const C9H: Card = Object.freeze(
  new Card(0x40000000, R9, HEART, "9H", "Nine of Hearts", "9♥"),
);

/**
 * Nine of Spades (`9♠`, code `"9S"`, key `0x80000000`, index `31`).
 *
 * @example
 * ```ts
 * C9S.symbol; // "9♠"
 * ```
 */
export const C9S: Card = Object.freeze(
  new Card(0x80000000, R9, SPADE, "9S", "Nine of Spades", "9♠"),
);

/**
 * Ten of Clubs (`10♣`, code `"TC"`, key `0x100000000`, index `32`).
 *
 * @example
 * ```ts
 * CTC.symbol; // "10♣"
 * ```
 */
export const CTC: Card = Object.freeze(
  new Card(0x100000000, RT, CLUB, "TC", "Ten of Clubs", "10♣"),
);

/**
 * Ten of Diamonds (`10♦`, code `"TD"`, key `0x200000000`, index `33`).
 *
 * @example
 * ```ts
 * CTD.symbol; // "10♦"
 * ```
 */
export const CTD: Card = Object.freeze(
  new Card(0x200000000, RT, DIAMOND, "TD", "Ten of Diamonds", "10♦"),
);

/**
 * Ten of Hearts (`10♥`, code `"TH"`, key `0x400000000`, index `34`).
 *
 * @example
 * ```ts
 * CTH.symbol; // "10♥"
 * ```
 */
export const CTH: Card = Object.freeze(
  new Card(0x400000000, RT, HEART, "TH", "Ten of Hearts", "10♥"),
);

/**
 * Ten of Spades (`10♠`, code `"TS"`, key `0x800000000`, index `35`).
 *
 * @example
 * ```ts
 * CTS.symbol; // "10♠"
 * ```
 */
export const CTS: Card = Object.freeze(
  new Card(0x800000000, RT, SPADE, "TS", "Ten of Spades", "10♠"),
);

/**
 * Jack of Clubs (`J♣`, code `"JC"`, key `0x1000000000`, index `36`).
 *
 * @example
 * ```ts
 * CJC.symbol; // "J♣"
 * ```
 */
export const CJC: Card = Object.freeze(
  new Card(0x1000000000, RJ, CLUB, "JC", "Jack of Clubs", "J♣"),
);

/**
 * Jack of Diamonds (`J♦`, code `"JD"`, key `0x2000000000`, index `37`).
 *
 * @example
 * ```ts
 * CJD.symbol; // "J♦"
 * ```
 */
export const CJD: Card = Object.freeze(
  new Card(0x2000000000, RJ, DIAMOND, "JD", "Jack of Diamonds", "J♦"),
);

/**
 * Jack of Hearts (`J♥`, code `"JH"`, key `0x4000000000`, index `38`).
 *
 * @example
 * ```ts
 * CJH.symbol; // "J♥"
 * ```
 */
export const CJH: Card = Object.freeze(
  new Card(0x4000000000, RJ, HEART, "JH", "Jack of Hearts", "J♥"),
);

/**
 * Jack of Spades (`J♠`, code `"JS"`, key `0x8000000000`, index `39`).
 *
 * @example
 * ```ts
 * CJS.symbol; // "J♠"
 * ```
 */
export const CJS: Card = Object.freeze(
  new Card(0x8000000000, RJ, SPADE, "JS", "Jack of Spades", "J♠"),
);

/**
 * Queen of Clubs (`Q♣`, code `"QC"`, key `0x10000000000`, index `40`).
 *
 * @example
 * ```ts
 * CQC.symbol; // "Q♣"
 * ```
 */
export const CQC: Card = Object.freeze(
  new Card(0x10000000000, RQ, CLUB, "QC", "Queen of Clubs", "Q♣"),
);

/**
 * Queen of Diamonds (`Q♦`, code `"QD"`, key `0x20000000000`, index `41`).
 *
 * @example
 * ```ts
 * CQD.symbol; // "Q♦"
 * ```
 */
export const CQD: Card = Object.freeze(
  new Card(0x20000000000, RQ, DIAMOND, "QD", "Queen of Diamonds", "Q♦"),
);

/**
 * Queen of Hearts (`Q♥`, code `"QH"`, key `0x40000000000`, index `42`).
 *
 * @example
 * ```ts
 * CQH.symbol; // "Q♥"
 * ```
 */
export const CQH: Card = Object.freeze(
  new Card(0x40000000000, RQ, HEART, "QH", "Queen of Hearts", "Q♥"),
);

/**
 * Queen of Spades (`Q♠`, code `"QS"`, key `0x80000000000`, index `43`).
 *
 * @example
 * ```ts
 * CQS.symbol; // "Q♠"
 * ```
 */
export const CQS: Card = Object.freeze(
  new Card(0x80000000000, RQ, SPADE, "QS", "Queen of Spades", "Q♠"),
);

/**
 * King of Clubs (`K♣`, code `"KC"`, key `0x100000000000`, index `44`).
 *
 * @example
 * ```ts
 * CKC.symbol; // "K♣"
 * ```
 */
export const CKC: Card = Object.freeze(
  new Card(0x100000000000, RK, CLUB, "KC", "King of Clubs", "K♣"),
);

/**
 * King of Diamonds (`K♦`, code `"KD"`, key `0x200000000000`, index `45`).
 *
 * @example
 * ```ts
 * CKD.symbol; // "K♦"
 * ```
 */
export const CKD: Card = Object.freeze(
  new Card(0x200000000000, RK, DIAMOND, "KD", "King of Diamonds", "K♦"),
);

/**
 * King of Hearts (`K♥`, code `"KH"`, key `0x400000000000`, index `46`).
 *
 * @example
 * ```ts
 * CKH.symbol; // "K♥"
 * ```
 */
export const CKH: Card = Object.freeze(
  new Card(0x400000000000, RK, HEART, "KH", "King of Hearts", "K♥"),
);

/**
 * King of Spades (`K♠`, code `"KS"`, key `0x800000000000`, index `47`).
 *
 * @example
 * ```ts
 * CKS.symbol; // "K♠"
 * ```
 */
export const CKS: Card = Object.freeze(
  new Card(0x800000000000, RK, SPADE, "KS", "King of Spades", "K♠"),
);

/**
 * Ace of Clubs (`A♣`, code `"AC"`, key `0x1000000000000`, index `48`).
 *
 * @example
 * ```ts
 * CAC.symbol; // "A♣"
 * ```
 */
export const CAC: Card = Object.freeze(
  new Card(0x1000000000000, RA, CLUB, "AC", "Ace of Clubs", "A♣"),
);

/**
 * Ace of Diamonds (`A♦`, code `"AD"`, key `0x2000000000000`, index `49`).
 *
 * @example
 * ```ts
 * CAD.symbol; // "A♦"
 * ```
 */
export const CAD: Card = Object.freeze(
  new Card(0x2000000000000, RA, DIAMOND, "AD", "Ace of Diamonds", "A♦"),
);

/**
 * Ace of Hearts (`A♥`, code `"AH"`, key `0x4000000000000`, index `50`).
 *
 * @example
 * ```ts
 * CAH.symbol; // "A♥"
 * ```
 */
export const CAH: Card = Object.freeze(
  new Card(0x4000000000000, RA, HEART, "AH", "Ace of Hearts", "A♥"),
);

/**
 * Ace of Spades (`A♠`, code `"AS"`, key `0x8000000000000`, index `51`).
 *
 * @example
 * ```ts
 * CAS.symbol; // "A♠"
 * ```
 */
export const CAS: Card = Object.freeze(
  new Card(0x8000000000000, RA, SPADE, "AS", "Ace of Spades", "A♠"),
);

/**
 * Frozen list of all 52 `Card` instances in ascending bit index order (`ALL_CARDS[i].key === 2 ** i`).
 *
 * @example
 * ```ts
 * ALL_CARDS[0]; // C2C
 * ALL_CARDS[51]; // CAS
 * ```
 */
export const ALL_CARDS: readonly Card[] = Object.freeze([
  C2C,
  C2D,
  C2H,
  C2S,
  C3C,
  C3D,
  C3H,
  C3S,
  C4C,
  C4D,
  C4H,
  C4S,
  C5C,
  C5D,
  C5H,
  C5S,
  C6C,
  C6D,
  C6H,
  C6S,
  C7C,
  C7D,
  C7H,
  C7S,
  C8C,
  C8D,
  C8H,
  C8S,
  C9C,
  C9D,
  C9H,
  C9S,
  CTC,
  CTD,
  CTH,
  CTS,
  CJC,
  CJD,
  CJH,
  CJS,
  CQC,
  CQD,
  CQH,
  CQS,
  CKC,
  CKD,
  CKH,
  CKS,
  CAC,
  CAD,
  CAH,
  CAS,
]);

const CARD_BY_KEY = new Map<CardMask, Card>();
const CARD_BY_CODE = new Map<string, Card>();
const VALID_SINGLE_RANKS = new Set<string>();

for (const card of ALL_CARDS) {
  CARD_BY_KEY.set(card.key, card);

  const rUpper = card.rank.code;
  const rLower = rUpper.toLowerCase();
  VALID_SINGLE_RANKS.add(rUpper);
  VALID_SINGLE_RANKS.add(rLower);

  const rankTokens = rUpper === "T" ? [rUpper, rLower, "10"] : [rUpper, rLower];
  const suitTokens = [card.suit.code, card.suit.code.toLowerCase(), card.suit.symbol];

  for (const r of rankTokens) {
    for (const s of suitTokens) {
      CARD_BY_CODE.set(`${r}${s}`, card);
    }
  }
}

/**
 * Returns a new array of `Card`s sorted in ascending order by rank, preserving relative order for equal ranks.
 *
 * @example
 * ```ts
 * sortCards([C5H, C2S, CKC, C9D]); // [C2S, C5H, C9D, CKC]
 * ```
 */
export function sortCards(cards: readonly Card[]): Card[] {
  return cards.slice().sort((a, b) => a.rank.key - b.rank.key);
}

/**
 * Combines a collection of `Card` objects into a single 52-bit `CardMask` using `maskOr`.
 *
 * @example
 * ```ts
 * cardsMask([C2C, C3D]); // 0x21
 * ```
 */
export function cardsMask(cards: readonly Card[]): CardMask {
  let mask = 0;
  for (const card of cards) {
    mask = maskOr(mask, card.key);
  }
  return mask;
}

/**
 * Computes the 13-bit rank presence mask for a card bitmask (alias of `rankMask`).
 *
 * @example
 * ```ts
 * rankMaskFromCards(cardsMask([C2C, C2D, C3C])); // 0b11
 * ```
 */
export function rankMaskFromCards(mask: CardMask): number {
  return rankMask(mask);
}

/**
 * Looks up the `Card` object for a single-card bitmask `key`.
 * Throws `RangeError` if `key` is not a valid single-card bitmask.
 *
 * @example
 * ```ts
 * getCardByKey(0x1); // C2C
 * getCardByKey(2 ** 51); // CAS
 * ```
 */
export function getCardByKey(key: CardMask): Card {
  const card = CARD_BY_KEY.get(key);
  if (card === undefined) {
    throw new RangeError(`Invalid card key: ${String(key)}`);
  }
  return card;
}

/**
 * Extracts an array of `Card` objects from `mask` in ascending bit index order (`0`–`51`).
 *
 * @example
 * ```ts
 * extractCards(0x21); // [C2C, C3D]
 * ```
 */
export function extractCards(mask: CardMask): Card[] {
  const result: Card[] = [];
  forEachCardIndex(mask, (idx) => {
    result.push(getCardByKey(cardKey(idx)));
  });
  return result;
}

/**
 * Extracts an array of single-card bitmask keys from `mask` in ascending bit index order (`0`–`51`).
 *
 * @example
 * ```ts
 * extractCardsKey(0x21); // [0x1, 0x20]
 * ```
 */
export function extractCardsKey(mask: CardMask): CardMask[] {
  const result: CardMask[] = [];
  forEachCardIndex(mask, (idx) => {
    result.push(cardKey(idx));
  });
  return result;
}

/**
 * Looks up a `Card` by its string code in `O(1)` time.
 * Accepts rank `2–9, T, J, Q, K, A` (any case) or `10`, followed by suit `C, D, H, S` (any case) or `♣, ♦, ♥, ♠`.
 *
 * @example
 * ```ts
 * getCard("AS"); // CAS
 * getCard("as"); // CAS
 * getCard("A♠"); // CAS
 * getCard("10H"); // CTH
 * ```
 */
export function getCard(code: string): Card {
  if (typeof code !== "string") {
    throw new TypeError(`Expected card code to be a string, got ${typeof code}`);
  }
  const found = CARD_BY_CODE.get(code);
  if (found !== undefined) {
    return found;
  }

  const isTen = code.startsWith("10");
  const expectedLen = isTen ? 3 : 2;
  if (code.length !== expectedLen) {
    throw new RangeError(`Invalid card code: ${code}`);
  }
  if (!isTen) {
    const rankPart = code.slice(0, 1);
    if (!VALID_SINGLE_RANKS.has(rankPart)) {
      throw new RangeError(`Invalid rank code: ${rankPart}`);
    }
  }
  const suitPart = code.slice(expectedLen - 1);
  throw new RangeError(`Invalid suit: ${suitPart}`);
}

/**
 * Looks up the single-card bitmask key for a card code string.
 *
 * @example
 * ```ts
 * getCardKeyFromCode("2♣"); // 0x1
 * getCardKeyFromCode("AS"); // 0x8000000000000
 * ```
 */
export function getCardKeyFromCode(code: string): CardMask {
  return getCard(code).key;
}

/**
 * Converts an array of card code strings into an array of `Card` objects.
 *
 * @example
 * ```ts
 * getCards(["AS", "10♥"]); // [CAS, CTH]
 * ```
 */
export function getCards(codes: readonly string[]): Card[] {
  const result: Card[] = [];
  for (const code of codes) {
    result.push(getCard(code));
  }
  return result;
}

/**
 * Combines an array of card code strings into a single 52-bit `CardMask`.
 *
 * @example
 * ```ts
 * getCardKeysFromCodes(["2C", "3D"]); // 0x21
 * ```
 */
export function getCardKeysFromCodes(codes: readonly string[]): CardMask {
  let mask = 0;
  for (const code of codes) {
    mask = maskOr(mask, getCard(code).key);
  }
  return mask;
}
