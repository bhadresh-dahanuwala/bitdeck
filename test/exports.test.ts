import { describe, expect, expectTypeOf, it } from "vitest";
import type { Card, CardMask, Deck, DeckOptions, Rank, Rng, Suit } from "../src/index";

describe("public API exports", () => {
  it("matches the inline snapshot of exported runtime symbols", async () => {
    const mod = await import("../src/index");
    const keys = Object.keys(mod).sort();
    expect(keys).toMatchInlineSnapshot(`
      [
        "ALL_CARDS",
        "ALL_RANKS",
        "ALL_SUITS",
        "C2C",
        "C2D",
        "C2H",
        "C2S",
        "C3C",
        "C3D",
        "C3H",
        "C3S",
        "C4C",
        "C4D",
        "C4H",
        "C4S",
        "C5C",
        "C5D",
        "C5H",
        "C5S",
        "C6C",
        "C6D",
        "C6H",
        "C6S",
        "C7C",
        "C7D",
        "C7H",
        "C7S",
        "C8C",
        "C8D",
        "C8H",
        "C8S",
        "C9C",
        "C9D",
        "C9H",
        "C9S",
        "CAC",
        "CAD",
        "CAH",
        "CAS",
        "CJC",
        "CJD",
        "CJH",
        "CJS",
        "CKC",
        "CKD",
        "CKH",
        "CKS",
        "CLUB",
        "CLUBS",
        "CQC",
        "CQD",
        "CQH",
        "CQS",
        "CTC",
        "CTD",
        "CTH",
        "CTS",
        "Card",
        "DIAMOND",
        "DIAMONDS",
        "Deck",
        "FULL_DECK_MASK",
        "HEART",
        "HEARTS",
        "NUM_RANKS",
        "NUM_SUITS",
        "R2",
        "R3",
        "R4",
        "R5",
        "R6",
        "R7",
        "R8",
        "R9",
        "RA",
        "RANKS_DESC",
        "RANK_CODES",
        "RJ",
        "RK",
        "RQ",
        "RT",
        "Rank",
        "SAME_RANKS",
        "SPADE",
        "SPADES",
        "SUIT_CODES",
        "SUIT_SYMBOLS",
        "Suit",
        "cardIndex",
        "cardKey",
        "cardsMask",
        "extractCards",
        "extractCardsKey",
        "forEachCardIndex",
        "getCard",
        "getCardByKey",
        "getCardKeyFromCode",
        "getCardKeysFromCodes",
        "getCards",
        "isSingleCard",
        "isValidMask",
        "lowestCardKey",
        "maskAnd",
        "maskAndNot",
        "maskContains",
        "maskIntersects",
        "maskOr",
        "maskXor",
        "mulberry32",
        "popcount",
        "rankMask",
        "rankMaskFromCards",
        "sortCards",
      ]
    `);
  });

  it("exports defined runtime values and public types", async () => {
    const mod = await import("../src/index");
    for (const key of Object.keys(mod)) {
      expect(mod[key as keyof typeof mod]).toBeDefined();
    }

    expectTypeOf<CardMask>().toEqualTypeOf<number>();
    expectTypeOf<Rng>().toEqualTypeOf<() => number>();
    expectTypeOf<DeckOptions>().toEqualTypeOf<{ rng?: Rng; cards?: CardMask }>();
    expectTypeOf(mod.Rank).toEqualTypeOf<typeof Rank>();
    expectTypeOf(mod.Suit).toEqualTypeOf<typeof Suit>();
    expectTypeOf(mod.Card).toEqualTypeOf<typeof Card>();
    expectTypeOf(mod.Deck).toEqualTypeOf<typeof Deck>();
  });
});
