import { describe, expect, it } from "vitest";
import {
  ALL_RANKS,
  ALL_SUITS,
  C2C,
  C3D,
  C4H,
  C5S,
  CAS,
  CLUB,
  CLUBS,
  CTH,
  DIAMOND,
  Deck,
  FULL_DECK_MASK,
  HEART,
  NUM_RANKS,
  NUM_SUITS,
  R2,
  RA,
  RANKS_DESC,
  RANK_CODES,
  RK,
  SAME_RANKS,
  SPADE,
  SPADES,
  SUIT_CODES,
  SUIT_SYMBOLS,
  cardsMask,
  extractCards,
  extractCardsKey,
  forEachCardIndex,
  getCard,
  getCardByKey,
  getCardKeyFromCode,
  getCardKeysFromCodes,
  getCards,
  lowestCardKey,
  maskAnd,
  maskAndNot,
  maskContains,
  maskIntersects,
  maskOr,
  maskXor,
  mulberry32,
  popcount,
  rankMask,
  rankMaskFromCards,
  sortCards,
} from "../src/index";

describe("README examples", () => {
  it("runs the Quick Start example from README.md", () => {
    const deck = new Deck({ rng: mulberry32(42) });
    expect(deck.count()).toBe(52);

    deck.shuffle();
    const handMask = deck.dealCards(5);
    const dealtCards = extractCards(handMask);
    expect(popcount(handMask)).toBe(5);
    expect(dealtCards).toHaveLength(5);
    expect(dealtCards.map(String)).toHaveLength(5);

    deck.removeCard(C2C.key);
    expect(deck.contains(C2C.key)).toBe(false);

    deck.addCard(C2C.key);
    expect(deck.contains(C2C.key)).toBe(true);

    const sortedCards = sortCards(dealtCards);
    expect(sortedCards).toHaveLength(5);
    for (let i = 1; i < sortedCards.length; i++) {
      const prev = sortedCards[i - 1];
      const curr = sortedCards[i];
      expect(prev?.rank.key).toBeLessThanOrEqual(curr?.rank.key ?? 0);
    }

    const mask = cardsMask([C2C, C3D]);
    expect(mask).toBe(0x21);
    expect(extractCards(mask)).toEqual([C2C, C3D]);
    expect(rankMaskFromCards(mask)).toBe(0b11);
  });

  it("runs the Working with Masks and Detailed Examples from README.md", () => {
    const hand = maskOr(C2C.key, CAS.key);
    expect(popcount(hand)).toBe(2);
    expect(maskContains(hand, CAS.key)).toBe(true);
    expect(maskIntersects(hand, SPADES)).toBe(true);

    const blackCards = maskOr(CLUBS, SPADES);
    expect(popcount(blackCards)).toBe(26);
    const aces = SAME_RANKS[12] ?? 0;
    const blackAces = maskAnd(blackCards, aces);
    expect(popcount(blackAces)).toBe(2);
    const nonAceSpades = maskAndNot(SPADES, aces);
    expect(popcount(nonAceSpades)).toBe(12);
    const toggled = maskXor(hand, C2C.key);
    expect(toggled).toBe(CAS.key);

    expect(lowestCardKey(hand)).toBe(C2C.key);
    expect(rankMask(hand)).toBe(0x1001);
    expect(popcount(FULL_DECK_MASK)).toBe(52);

    const indices: number[] = [];
    forEachCardIndex(hand, (i) => indices.push(i));
    expect(indices).toEqual([0, 51]);

    expect(getCard("AS")).toBe(CAS);
    expect(getCard("10H")).toBe(CTH);
    expect(getCardByKey(0x1)).toBe(C2C);
    expect(getCardKeyFromCode("10H")).toBe(CTH.key);
    expect(getCards(["2C", "KD", "J♥"]).map(String)).toEqual(["2♣", "K♦", "J♥"]);
    expect(popcount(getCardKeysFromCodes(["2C", "KD", "J♥"]))).toBe(3);

    expect([String(CLUB), String(DIAMOND), String(HEART), String(SPADE)]).toEqual([
      "♣",
      "♦",
      "♥",
      "♠",
    ]);
    expect(NUM_SUITS).toBe(4);
    expect(SUIT_CODES).toEqual(["C", "D", "H", "S"]);
    expect(SUIT_SYMBOLS).toEqual(["♠", "♥", "♦", "♣"]);
    expect(ALL_SUITS).toEqual([CLUB, DIAMOND, HEART, SPADE]);

    expect([String(R2), String(RK), String(RA)]).toEqual(["2", "K", "A"]);
    expect(NUM_RANKS).toBe(13);
    expect(RANK_CODES).toHaveLength(13);
    expect(ALL_RANKS).toHaveLength(13);
    expect(RANKS_DESC).toHaveLength(13);

    const fourCards = [C5S, C2C, C4H, C3D];
    const fourMask = cardsMask(fourCards);
    expect(extractCards(fourMask).map(String)).toEqual(["2♣", "3♦", "4♥", "5♠"]);
    expect(extractCardsKey(fourMask)).toEqual([0x1, 0x20, 0x400, 0x8000]);
    expect(rankMaskFromCards(fourMask).toString(2)).toBe("1111");
    expect(sortCards(fourCards).map(String)).toEqual(["2♣", "3♦", "4♥", "5♠"]);

    const deckA = new Deck({ rng: mulberry32(12345) });
    const deckB = new Deck({ rng: mulberry32(12345) });
    expect(deckA.dealCards(7)).toBe(deckB.dealCards(7));
  });
});
