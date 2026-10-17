import { describe, expect, it } from "vitest";
import {
  ALL_CARDS,
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
  CAC,
  CAD,
  CAH,
  CAS,
  CJC,
  CJD,
  CJH,
  CJS,
  CKC,
  CKD,
  CKH,
  CKS,
  CLUB,
  CQC,
  CQD,
  CQH,
  CQS,
  CTC,
  CTD,
  CTH,
  CTS,
  Card,
  DIAMOND,
  FULL_DECK_MASK,
  HEART,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  RA,
  RJ,
  RK,
  RQ,
  RT,
  SPADE,
  cardsMask,
  extractCards,
  extractCardsKey,
  getCard,
  getCardByKey,
  getCardKeyFromCode,
  getCardKeysFromCodes,
  getCards,
  isSingleCard,
  rankMaskFromCards,
  sortCards,
} from "../src/index";

describe("Card constants & ALL_CARDS", () => {
  it("constructs all 52 Card constants with expected key, rank, suit, code, name, symbol, and index", () => {
    expect(C2C.key).toBe(0x1);
    expect(C2C.rank).toBe(R2);
    expect(C2C.suit).toBe(CLUB);
    expect(C2C.code).toBe("2C");
    expect(C2C.name).toBe("Two of Clubs");
    expect(C2C.symbol).toBe("2♣");

    expect(C2D.key).toBe(0x2);
    expect(C2D.rank).toBe(R2);
    expect(C2D.suit).toBe(DIAMOND);
    expect(C2D.code).toBe("2D");
    expect(C2D.name).toBe("Two of Diamonds");
    expect(C2D.symbol).toBe("2♦");

    expect(C2H.key).toBe(0x4);
    expect(C2H.rank).toBe(R2);
    expect(C2H.suit).toBe(HEART);
    expect(C2H.code).toBe("2H");
    expect(C2H.name).toBe("Two of Hearts");
    expect(C2H.symbol).toBe("2♥");

    expect(C2S.key).toBe(0x8);
    expect(C2S.rank).toBe(R2);
    expect(C2S.suit).toBe(SPADE);
    expect(C2S.code).toBe("2S");
    expect(C2S.name).toBe("Two of Spades");
    expect(C2S.symbol).toBe("2♠");

    expect(C3C.key).toBe(0x10);
    expect(C3C.rank).toBe(R3);
    expect(C3C.suit).toBe(CLUB);
    expect(C3C.code).toBe("3C");
    expect(C3C.name).toBe("Three of Clubs");
    expect(C3C.symbol).toBe("3♣");

    expect(C3D.key).toBe(0x20);
    expect(C3D.rank).toBe(R3);
    expect(C3D.suit).toBe(DIAMOND);
    expect(C3D.code).toBe("3D");
    expect(C3D.name).toBe("Three of Diamonds");
    expect(C3D.symbol).toBe("3♦");

    expect(C3H.key).toBe(0x40);
    expect(C3H.rank).toBe(R3);
    expect(C3H.suit).toBe(HEART);
    expect(C3H.code).toBe("3H");
    expect(C3H.name).toBe("Three of Hearts");
    expect(C3H.symbol).toBe("3♥");

    expect(C3S.key).toBe(0x80);
    expect(C3S.rank).toBe(R3);
    expect(C3S.suit).toBe(SPADE);
    expect(C3S.code).toBe("3S");
    expect(C3S.name).toBe("Three of Spades");
    expect(C3S.symbol).toBe("3♠");

    expect(C4C.key).toBe(0x100);
    expect(C4C.rank).toBe(R4);
    expect(C4C.suit).toBe(CLUB);
    expect(C4C.code).toBe("4C");
    expect(C4C.name).toBe("Four of Clubs");
    expect(C4C.symbol).toBe("4♣");

    expect(C4D.key).toBe(0x200);
    expect(C4D.rank).toBe(R4);
    expect(C4D.suit).toBe(DIAMOND);
    expect(C4D.code).toBe("4D");
    expect(C4D.name).toBe("Four of Diamonds");
    expect(C4D.symbol).toBe("4♦");

    expect(C4H.key).toBe(0x400);
    expect(C4H.rank).toBe(R4);
    expect(C4H.suit).toBe(HEART);
    expect(C4H.code).toBe("4H");
    expect(C4H.name).toBe("Four of Hearts");
    expect(C4H.symbol).toBe("4♥");

    expect(C4S.key).toBe(0x800);
    expect(C4S.rank).toBe(R4);
    expect(C4S.suit).toBe(SPADE);
    expect(C4S.code).toBe("4S");
    expect(C4S.name).toBe("Four of Spades");
    expect(C4S.symbol).toBe("4♠");

    expect(C5C.key).toBe(0x1000);
    expect(C5C.rank).toBe(R5);
    expect(C5C.suit).toBe(CLUB);
    expect(C5C.code).toBe("5C");
    expect(C5C.name).toBe("Five of Clubs");
    expect(C5C.symbol).toBe("5♣");

    expect(C5D.key).toBe(0x2000);
    expect(C5D.rank).toBe(R5);
    expect(C5D.suit).toBe(DIAMOND);
    expect(C5D.code).toBe("5D");
    expect(C5D.name).toBe("Five of Diamonds");
    expect(C5D.symbol).toBe("5♦");

    expect(C5H.key).toBe(0x4000);
    expect(C5H.rank).toBe(R5);
    expect(C5H.suit).toBe(HEART);
    expect(C5H.code).toBe("5H");
    expect(C5H.name).toBe("Five of Hearts");
    expect(C5H.symbol).toBe("5♥");

    expect(C5S.key).toBe(0x8000);
    expect(C5S.rank).toBe(R5);
    expect(C5S.suit).toBe(SPADE);
    expect(C5S.code).toBe("5S");
    expect(C5S.name).toBe("Five of Spades");
    expect(C5S.symbol).toBe("5♠");

    expect(C6C.key).toBe(0x10000);
    expect(C6C.rank).toBe(R6);
    expect(C6C.suit).toBe(CLUB);
    expect(C6C.code).toBe("6C");
    expect(C6C.name).toBe("Six of Clubs");
    expect(C6C.symbol).toBe("6♣");

    expect(C6D.key).toBe(0x20000);
    expect(C6D.rank).toBe(R6);
    expect(C6D.suit).toBe(DIAMOND);
    expect(C6D.code).toBe("6D");
    expect(C6D.name).toBe("Six of Diamonds");
    expect(C6D.symbol).toBe("6♦");

    expect(C6H.key).toBe(0x40000);
    expect(C6H.rank).toBe(R6);
    expect(C6H.suit).toBe(HEART);
    expect(C6H.code).toBe("6H");
    expect(C6H.name).toBe("Six of Hearts");
    expect(C6H.symbol).toBe("6♥");

    expect(C6S.key).toBe(0x80000);
    expect(C6S.rank).toBe(R6);
    expect(C6S.suit).toBe(SPADE);
    expect(C6S.code).toBe("6S");
    expect(C6S.name).toBe("Six of Spades");
    expect(C6S.symbol).toBe("6♠");

    expect(C7C.key).toBe(0x100000);
    expect(C7C.rank).toBe(R7);
    expect(C7C.suit).toBe(CLUB);
    expect(C7C.code).toBe("7C");
    expect(C7C.name).toBe("Seven of Clubs");
    expect(C7C.symbol).toBe("7♣");

    expect(C7D.key).toBe(0x200000);
    expect(C7D.rank).toBe(R7);
    expect(C7D.suit).toBe(DIAMOND);
    expect(C7D.code).toBe("7D");
    expect(C7D.name).toBe("Seven of Diamonds");
    expect(C7D.symbol).toBe("7♦");

    expect(C7H.key).toBe(0x400000);
    expect(C7H.rank).toBe(R7);
    expect(C7H.suit).toBe(HEART);
    expect(C7H.code).toBe("7H");
    expect(C7H.name).toBe("Seven of Hearts");
    expect(C7H.symbol).toBe("7♥");

    expect(C7S.key).toBe(0x800000);
    expect(C7S.rank).toBe(R7);
    expect(C7S.suit).toBe(SPADE);
    expect(C7S.code).toBe("7S");
    expect(C7S.name).toBe("Seven of Spades");
    expect(C7S.symbol).toBe("7♠");

    expect(C8C.key).toBe(0x1000000);
    expect(C8C.rank).toBe(R8);
    expect(C8C.suit).toBe(CLUB);
    expect(C8C.code).toBe("8C");
    expect(C8C.name).toBe("Eight of Clubs");
    expect(C8C.symbol).toBe("8♣");

    expect(C8D.key).toBe(0x2000000);
    expect(C8D.rank).toBe(R8);
    expect(C8D.suit).toBe(DIAMOND);
    expect(C8D.code).toBe("8D");
    expect(C8D.name).toBe("Eight of Diamonds");
    expect(C8D.symbol).toBe("8♦");

    expect(C8H.key).toBe(0x4000000);
    expect(C8H.rank).toBe(R8);
    expect(C8H.suit).toBe(HEART);
    expect(C8H.code).toBe("8H");
    expect(C8H.name).toBe("Eight of Hearts");
    expect(C8H.symbol).toBe("8♥");

    expect(C8S.key).toBe(0x8000000);
    expect(C8S.rank).toBe(R8);
    expect(C8S.suit).toBe(SPADE);
    expect(C8S.code).toBe("8S");
    expect(C8S.name).toBe("Eight of Spades");
    expect(C8S.symbol).toBe("8♠");

    expect(C9C.key).toBe(0x10000000);
    expect(C9C.rank).toBe(R9);
    expect(C9C.suit).toBe(CLUB);
    expect(C9C.code).toBe("9C");
    expect(C9C.name).toBe("Nine of Clubs");
    expect(C9C.symbol).toBe("9♣");

    expect(C9D.key).toBe(0x20000000);
    expect(C9D.rank).toBe(R9);
    expect(C9D.suit).toBe(DIAMOND);
    expect(C9D.code).toBe("9D");
    expect(C9D.name).toBe("Nine of Diamonds");
    expect(C9D.symbol).toBe("9♦");

    expect(C9H.key).toBe(0x40000000);
    expect(C9H.rank).toBe(R9);
    expect(C9H.suit).toBe(HEART);
    expect(C9H.code).toBe("9H");
    expect(C9H.name).toBe("Nine of Hearts");
    expect(C9H.symbol).toBe("9♥");

    expect(C9S.key).toBe(0x80000000);
    expect(C9S.rank).toBe(R9);
    expect(C9S.suit).toBe(SPADE);
    expect(C9S.code).toBe("9S");
    expect(C9S.name).toBe("Nine of Spades");
    expect(C9S.symbol).toBe("9♠");

    expect(CTC.key).toBe(0x100000000);
    expect(CTC.rank).toBe(RT);
    expect(CTC.suit).toBe(CLUB);
    expect(CTC.code).toBe("TC");
    expect(CTC.name).toBe("Ten of Clubs");
    expect(CTC.symbol).toBe("10♣");

    expect(CTD.key).toBe(0x200000000);
    expect(CTD.rank).toBe(RT);
    expect(CTD.suit).toBe(DIAMOND);
    expect(CTD.code).toBe("TD");
    expect(CTD.name).toBe("Ten of Diamonds");
    expect(CTD.symbol).toBe("10♦");

    expect(CTH.key).toBe(0x400000000);
    expect(CTH.rank).toBe(RT);
    expect(CTH.suit).toBe(HEART);
    expect(CTH.code).toBe("TH");
    expect(CTH.name).toBe("Ten of Hearts");
    expect(CTH.symbol).toBe("10♥");

    expect(CTS.key).toBe(0x800000000);
    expect(CTS.rank).toBe(RT);
    expect(CTS.suit).toBe(SPADE);
    expect(CTS.code).toBe("TS");
    expect(CTS.name).toBe("Ten of Spades");
    expect(CTS.symbol).toBe("10♠");

    expect(CJC.key).toBe(0x1000000000);
    expect(CJC.rank).toBe(RJ);
    expect(CJC.suit).toBe(CLUB);
    expect(CJC.code).toBe("JC");
    expect(CJC.name).toBe("Jack of Clubs");
    expect(CJC.symbol).toBe("J♣");

    expect(CJD.key).toBe(0x2000000000);
    expect(CJD.rank).toBe(RJ);
    expect(CJD.suit).toBe(DIAMOND);
    expect(CJD.code).toBe("JD");
    expect(CJD.name).toBe("Jack of Diamonds");
    expect(CJD.symbol).toBe("J♦");

    expect(CJH.key).toBe(0x4000000000);
    expect(CJH.rank).toBe(RJ);
    expect(CJH.suit).toBe(HEART);
    expect(CJH.code).toBe("JH");
    expect(CJH.name).toBe("Jack of Hearts");
    expect(CJH.symbol).toBe("J♥");

    expect(CJS.key).toBe(0x8000000000);
    expect(CJS.rank).toBe(RJ);
    expect(CJS.suit).toBe(SPADE);
    expect(CJS.code).toBe("JS");
    expect(CJS.name).toBe("Jack of Spades");
    expect(CJS.symbol).toBe("J♠");

    expect(CQC.key).toBe(0x10000000000);
    expect(CQC.rank).toBe(RQ);
    expect(CQC.suit).toBe(CLUB);
    expect(CQC.code).toBe("QC");
    expect(CQC.name).toBe("Queen of Clubs");
    expect(CQC.symbol).toBe("Q♣");

    expect(CQD.key).toBe(0x20000000000);
    expect(CQD.rank).toBe(RQ);
    expect(CQD.suit).toBe(DIAMOND);
    expect(CQD.code).toBe("QD");
    expect(CQD.name).toBe("Queen of Diamonds");
    expect(CQD.symbol).toBe("Q♦");

    expect(CQH.key).toBe(0x40000000000);
    expect(CQH.rank).toBe(RQ);
    expect(CQH.suit).toBe(HEART);
    expect(CQH.code).toBe("QH");
    expect(CQH.name).toBe("Queen of Hearts");
    expect(CQH.symbol).toBe("Q♥");

    expect(CQS.key).toBe(0x80000000000);
    expect(CQS.rank).toBe(RQ);
    expect(CQS.suit).toBe(SPADE);
    expect(CQS.code).toBe("QS");
    expect(CQS.name).toBe("Queen of Spades");
    expect(CQS.symbol).toBe("Q♠");

    expect(CKC.key).toBe(0x100000000000);
    expect(CKC.rank).toBe(RK);
    expect(CKC.suit).toBe(CLUB);
    expect(CKC.code).toBe("KC");
    expect(CKC.name).toBe("King of Clubs");
    expect(CKC.symbol).toBe("K♣");

    expect(CKD.key).toBe(0x200000000000);
    expect(CKD.rank).toBe(RK);
    expect(CKD.suit).toBe(DIAMOND);
    expect(CKD.code).toBe("KD");
    expect(CKD.name).toBe("King of Diamonds");
    expect(CKD.symbol).toBe("K♦");

    expect(CKH.key).toBe(0x400000000000);
    expect(CKH.rank).toBe(RK);
    expect(CKH.suit).toBe(HEART);
    expect(CKH.code).toBe("KH");
    expect(CKH.name).toBe("King of Hearts");
    expect(CKH.symbol).toBe("K♥");

    expect(CKS.key).toBe(0x800000000000);
    expect(CKS.rank).toBe(RK);
    expect(CKS.suit).toBe(SPADE);
    expect(CKS.code).toBe("KS");
    expect(CKS.name).toBe("King of Spades");
    expect(CKS.symbol).toBe("K♠");

    expect(CAC.key).toBe(0x1000000000000);
    expect(CAC.rank).toBe(RA);
    expect(CAC.suit).toBe(CLUB);
    expect(CAC.code).toBe("AC");
    expect(CAC.name).toBe("Ace of Clubs");
    expect(CAC.symbol).toBe("A♣");

    expect(CAD.key).toBe(0x2000000000000);
    expect(CAD.rank).toBe(RA);
    expect(CAD.suit).toBe(DIAMOND);
    expect(CAD.code).toBe("AD");
    expect(CAD.name).toBe("Ace of Diamonds");
    expect(CAD.symbol).toBe("A♦");

    expect(CAH.key).toBe(0x4000000000000);
    expect(CAH.rank).toBe(RA);
    expect(CAH.suit).toBe(HEART);
    expect(CAH.code).toBe("AH");
    expect(CAH.name).toBe("Ace of Hearts");
    expect(CAH.symbol).toBe("A♥");

    expect(CAS.key).toBe(0x8000000000000);
    expect(CAS.rank).toBe(RA);
    expect(CAS.suit).toBe(SPADE);
    expect(CAS.code).toBe("AS");
    expect(CAS.name).toBe("Ace of Spades");
    expect(CAS.symbol).toBe("A♠");
  });

  it("verifies ALL_CARDS order, keys, indices, freezing, toString(), and toJSON()", () => {
    expect(Object.isFrozen(ALL_CARDS)).toBe(true);
    expect(ALL_CARDS).toHaveLength(52);

    const custom = new Card(0x1, R2, CLUB, "2C", "Two of Clubs", "2♣");
    expect(custom.toString()).toBe("2♣");
    expect(String(custom)).toBe("2♣");
    expect(JSON.stringify(custom)).toBe('"2C"');

    for (let i = 0; i < 52; i++) {
      const card = ALL_CARDS[i];
      expect(card).toBeDefined();
      if (card !== undefined) {
        expect(Object.isFrozen(card)).toBe(true);
        expect(card.key).toBe(2 ** i);
        expect(card.index).toBe(i);
        expect(card.toString()).toBe(card.symbol);
        expect(JSON.stringify(card)).toBe(JSON.stringify(card.code));
      }
    }
  });
});

describe("sortCards, cardsMask, rankMaskFromCards, extractCards, extractCardsKey, getCardByKey", () => {
  it("sorts cards by rank in ascending order and is stable for equal ranks", () => {
    const unsorted = [C4H, C7D, C2C, C3S];
    const sorted = sortCards(unsorted);
    expect(sorted).toEqual([C2C, C3S, C4H, C7D]);
    expect(unsorted).toEqual([C4H, C7D, C2C, C3S]);

    const equalRanks = [C5S, C2H, C5C, C2D, C5D];
    expect(sortCards(equalRanks)).toEqual([C2H, C2D, C5S, C5C, C5D]);
  });

  it("computes cardsMask across low and high bits and ignores duplicates", () => {
    const cards = [C2C, C3S, C4H, C7D];
    expect(cardsMask(cards)).toBe(0x200481);
    expect(cardsMask([])).toBe(0);
    expect(cardsMask([C2C, C2C, CAS, CAS])).toBe(C2C.key + CAS.key);
    expect(cardsMask(ALL_CARDS)).toBe(FULL_DECK_MASK);
  });

  it("extracts cards and card keys in ascending index order and round-trips", () => {
    const cards = [C2C, C3S, C4H, C7D];
    expect(extractCards(cardsMask(cards))).toEqual(cards);
    expect(extractCards(0)).toEqual([]);

    const highCards = [C2C, C9S, CTC, CJH, CQD, CKS, CAS];
    const highMask = cardsMask(highCards);
    expect(extractCards(highMask)).toEqual(highCards);
    expect(extractCardsKey(highMask)).toEqual(highCards.map((c) => c.key));
    expect(extractCardsKey(0)).toEqual([]);
    expect(extractCards(FULL_DECK_MASK)).toEqual(ALL_CARDS);
  });

  it("computes rankMaskFromCards across low and high bits", () => {
    const cards = [C2C, C3S, C4H, C7D];
    const mask = cardsMask(cards);
    const expected = R2.key | R3.key | R4.key | R7.key;
    expect(rankMaskFromCards(mask)).toBe(expected);
    expect(rankMaskFromCards(0)).toBe(0);

    const highCards = [CTC, CTH, CJS, CAS];
    expect(rankMaskFromCards(cardsMask(highCards))).toBe(RT.key | RJ.key | RA.key);
  });

  it("looks up cards by key via getCardByKey and throws RangeError on invalid keys", () => {
    for (const card of ALL_CARDS) {
      expect(getCardByKey(card.key)).toBe(card);
    }

    expect(() => getCardByKey(0)).toThrow(new RangeError("Invalid card key: 0"));
    expect(() => getCardByKey(-1)).toThrow(new RangeError("Invalid card key: -1"));
    expect(() => getCardByKey(3)).toThrow(new RangeError("Invalid card key: 3"));
    expect(() => getCardByKey(1.5)).toThrow(new RangeError("Invalid card key: 1.5"));
    expect(() => getCardByKey(2 ** 52)).toThrow(
      new RangeError(`Invalid card key: ${String(2 ** 52)}`),
    );
    expect(() => getCardByKey(FULL_DECK_MASK)).toThrow(
      new RangeError(`Invalid card key: ${String(FULL_DECK_MASK)}`),
    );
    expect(() => getCardByKey(Number.NaN)).toThrow(new RangeError("Invalid card key: NaN"));
  });

  it("terminates and returns only valid cards/keys when extractCards/extractCardsKey receive non-standard masks", () => {
    const inputs = [
      Number.NaN,
      1.5,
      -1,
      Number.POSITIVE_INFINITY,
      2 ** 52,
      2 ** 53,
      FULL_DECK_MASK + 2 ** 52,
    ];
    for (const input of inputs) {
      const cards = extractCards(input);
      const keys = extractCardsKey(input);
      expect(cards.length).toBeLessThanOrEqual(52);
      expect(keys.length).toBe(cards.length);
      for (const card of cards) {
        expect(card).toBeInstanceOf(Card);
      }
      for (const key of keys) {
        expect(isSingleCard(key)).toBe(true);
      }
    }
    expect(extractCards(1.5)).toEqual([C2C]);
    expect(extractCardsKey(1.5)).toEqual([C2C.key]);
  });
});

describe("getCard, getCardKeyFromCode, getCards, getCardKeysFromCodes", () => {
  const symbolCases: readonly [string, Card][] = [
    ["2♣", C2C],
    ["2♦", C2D],
    ["2♥", C2H],
    ["2♠", C2S],
    ["3♣", C3C],
    ["3♦", C3D],
    ["3♥", C3H],
    ["3♠", C3S],
    ["4♣", C4C],
    ["4♦", C4D],
    ["4♥", C4H],
    ["4♠", C4S],
    ["5♣", C5C],
    ["5♦", C5D],
    ["5♥", C5H],
    ["5♠", C5S],
    ["6♣", C6C],
    ["6♦", C6D],
    ["6♥", C6H],
    ["6♠", C6S],
    ["7♣", C7C],
    ["7♦", C7D],
    ["7♥", C7H],
    ["7♠", C7S],
    ["8♣", C8C],
    ["8♦", C8D],
    ["8♥", C8H],
    ["8♠", C8S],
    ["9♣", C9C],
    ["9♦", C9D],
    ["9♥", C9H],
    ["9♠", C9S],
    ["T♣", CTC],
    ["T♦", CTD],
    ["T♥", CTH],
    ["T♠", CTS],
    ["J♣", CJC],
    ["J♦", CJD],
    ["J♥", CJH],
    ["J♠", CJS],
    ["Q♣", CQC],
    ["Q♦", CQD],
    ["Q♥", CQH],
    ["Q♠", CQS],
    ["K♣", CKC],
    ["K♦", CKD],
    ["K♥", CKH],
    ["K♠", CKS],
    ["A♣", CAC],
    ["A♦", CAD],
    ["A♥", CAH],
    ["A♠", CAS],
  ];

  it("resolves all 52 cards via symbol, uppercase, lowercase, and 10-prefixed codes", () => {
    for (const [symbolCode, expected] of symbolCases) {
      expect(getCard(symbolCode)).toBe(expected);
      expect(getCard(symbolCode.toLowerCase())).toBe(expected);
      expect(getCard(expected.code)).toBe(expected);
      expect(getCard(expected.code.toLowerCase())).toBe(expected);
      expect(getCard(expected.symbol)).toBe(expected);
    }

    expect(getCard("10C")).toBe(CTC);
    expect(getCard("10c")).toBe(CTC);
    expect(getCard("10♣")).toBe(CTC);
    expect(getCard("10D")).toBe(CTD);
    expect(getCard("10d")).toBe(CTD);
    expect(getCard("10♦")).toBe(CTD);
    expect(getCard("10H")).toBe(CTH);
    expect(getCard("10h")).toBe(CTH);
    expect(getCard("10♥")).toBe(CTH);
    expect(getCard("TH")).toBe(CTH);
    expect(getCard("th")).toBe(CTH);
    expect(getCard("10S")).toBe(CTS);
    expect(getCard("10s")).toBe(CTS);
    expect(getCard("10♠")).toBe(CTS);
  });

  it("resolves getCards, getCardKeyFromCode, and getCardKeysFromCodes", () => {
    expect(getCards(["2♠", "3♥", "4♦", "5♣"])).toEqual([C2S, C3H, C4D, C5C]);
    expect(getCards(["6♦", "7♥", "8♠", "9♣"])).toEqual([C6D, C7H, C8S, C9C]);
    expect(getCards(["T♣", "J♦", "Q♥", "K♠"])).toEqual([CTC, CJD, CQH, CKS]);
    expect(getCards(["A♣", "A♦", "A♥", "A♠"])).toEqual([CAC, CAD, CAH, CAS]);
    expect(getCards([])).toEqual([]);

    expect(getCardKeyFromCode("2♣")).toBe(0x1);
    expect(getCardKeyFromCode("2♦")).toBe(0x2);
    expect(getCardKeyFromCode("2♥")).toBe(0x4);
    expect(getCardKeyFromCode("2♠")).toBe(0x8);
    expect(getCardKeyFromCode("3♣")).toBe(0x10);
    expect(getCardKeyFromCode("3♦")).toBe(0x20);
    expect(getCardKeyFromCode("3♥")).toBe(0x40);
    expect(getCardKeyFromCode("3♠")).toBe(0x80);
    expect(getCardKeyFromCode("4♣")).toBe(0x100);
    expect(getCardKeyFromCode("4♦")).toBe(0x200);
    expect(getCardKeyFromCode("4♥")).toBe(0x400);
    expect(getCardKeyFromCode("4♠")).toBe(0x800);
    expect(getCardKeyFromCode("5♣")).toBe(0x1000);
    expect(getCardKeyFromCode("5♦")).toBe(0x2000);
    expect(getCardKeyFromCode("5♥")).toBe(0x4000);
    expect(getCardKeyFromCode("5♠")).toBe(0x8000);
    expect(getCardKeyFromCode("6♣")).toBe(0x10000);
    expect(getCardKeyFromCode("6♦")).toBe(0x20000);
    expect(getCardKeyFromCode("6♥")).toBe(0x40000);
    expect(getCardKeyFromCode("6♠")).toBe(0x80000);
    expect(getCardKeyFromCode("7♣")).toBe(0x100000);
    expect(getCardKeyFromCode("7♦")).toBe(0x200000);
    expect(getCardKeyFromCode("7♥")).toBe(0x400000);
    expect(getCardKeyFromCode("7♠")).toBe(0x800000);
    expect(getCardKeyFromCode("8♣")).toBe(0x1000000);
    expect(getCardKeyFromCode("8♦")).toBe(0x2000000);
    expect(getCardKeyFromCode("8♥")).toBe(0x4000000);
    expect(getCardKeyFromCode("8♠")).toBe(0x8000000);
    expect(getCardKeyFromCode("9♣")).toBe(0x10000000);
    expect(getCardKeyFromCode("9♦")).toBe(0x20000000);
    expect(getCardKeyFromCode("9♥")).toBe(0x40000000);
    expect(getCardKeyFromCode("9♠")).toBe(0x80000000);
    expect(getCardKeyFromCode("T♣")).toBe(0x100000000);
    expect(getCardKeyFromCode("T♦")).toBe(0x200000000);
    expect(getCardKeyFromCode("T♥")).toBe(0x400000000);
    expect(getCardKeyFromCode("T♠")).toBe(0x800000000);
    expect(getCardKeyFromCode("J♣")).toBe(0x1000000000);
    expect(getCardKeyFromCode("J♦")).toBe(0x2000000000);
    expect(getCardKeyFromCode("J♥")).toBe(0x4000000000);
    expect(getCardKeyFromCode("J♠")).toBe(0x8000000000);
    expect(getCardKeyFromCode("Q♣")).toBe(0x10000000000);
    expect(getCardKeyFromCode("Q♦")).toBe(0x20000000000);
    expect(getCardKeyFromCode("Q♥")).toBe(0x40000000000);
    expect(getCardKeyFromCode("Q♠")).toBe(0x80000000000);
    expect(getCardKeyFromCode("K♣")).toBe(0x100000000000);
    expect(getCardKeyFromCode("K♦")).toBe(0x200000000000);
    expect(getCardKeyFromCode("K♥")).toBe(0x400000000000);
    expect(getCardKeyFromCode("K♠")).toBe(0x800000000000);
    expect(getCardKeyFromCode("A♣")).toBe(0x1000000000000);
    expect(getCardKeyFromCode("A♦")).toBe(0x2000000000000);
    expect(getCardKeyFromCode("A♥")).toBe(0x4000000000000);
    expect(getCardKeyFromCode("A♠")).toBe(0x8000000000000);

    expect(getCardKeysFromCodes(["2♣", "3♥", "4♦", "5♠"])).toBe(cardsMask([C2C, C3H, C4D, C5S]));
    expect(getCardKeysFromCodes(["6♣", "7♥", "8♦", "9♠"])).toBe(cardsMask([C6C, C7H, C8D, C9S]));
    expect(getCardKeysFromCodes(["T♣", "J♥", "Q♦", "K♠"])).toBe(cardsMask([CTC, CJH, CQD, CKS]));
    expect(getCardKeysFromCodes(["A♣", "A♦", "A♥", "A♠"])).toBe(cardsMask([CAC, CAD, CAH, CAS]));
    expect(getCardKeysFromCodes([])).toBe(0);
  });

  it("throws TypeError and RangeError on invalid card codes", () => {
    expect(() => getCard(123 as unknown as string)).toThrow(TypeError);
    expect(() => getCard(null as unknown as string)).toThrow(TypeError);
    expect(() => getCard(undefined as unknown as string)).toThrow(TypeError);

    expect(() => getCard("")).toThrow(new RangeError("Invalid card code: "));
    expect(() => getCard("A")).toThrow(new RangeError("Invalid card code: A"));
    expect(() => getCard("10")).toThrow(new RangeError("Invalid card code: 10"));
    expect(() => getCard("ABC")).toThrow(new RangeError("Invalid card code: ABC"));
    expect(() => getCard("10SH")).toThrow(new RangeError("Invalid card code: 10SH"));

    expect(() => getCard("1S")).toThrow(new RangeError("Invalid rank code: 1"));
    expect(() => getCard("0H")).toThrow(new RangeError("Invalid rank code: 0"));
    expect(() => getCard("XC")).toThrow(new RangeError("Invalid rank code: X"));

    expect(() => getCard("AX")).toThrow(new RangeError("Invalid suit: X"));
    expect(() => getCard("2Z")).toThrow(new RangeError("Invalid suit: Z"));
    expect(() => getCard("10X")).toThrow(new RangeError("Invalid suit: X"));
  });
});
