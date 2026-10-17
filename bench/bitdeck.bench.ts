import { describe, expect, test } from "vitest";
import * as bitdeck from "../src/index";
import type { Card, CardMask } from "../src/index";
import * as bigintRef from "./bigint-reference";

const {
  C2C,
  C7D,
  C9S,
  CAH,
  CAS,
  CJH,
  CKC,
  Deck,
  cardsMask,
  extractCards,
  getCard,
  maskOr,
  mulberry32,
  popcount,
  rankMask,
} = bitdeck;
const { BigIntDeck, popcountBigInt, rankMaskBigInt } = bigintRef;

const SEVEN_CARDS: readonly Card[] = [C2C, C7D, C9S, CJH, CKC, CAH, CAS];
const SEVEN_CARD_MASK: CardMask = cardsMask(SEVEN_CARDS);
const SEVEN_CARD_MASK_BIGINT = BigInt(SEVEN_CARD_MASK);
const MASK_A: CardMask = cardsMask([C2C, C7D, CJH, CAH]);
const MASK_B: CardMask = cardsMask([C9S, CKC, CAS]);

const deck2 = new Deck({ rng: mulberry32(101) });
const deck7 = new Deck({ rng: mulberry32(202) });
const bigIntDeck7 = new BigIntDeck(mulberry32(202));
const templateDeck = new Deck({ rng: mulberry32(303) });

describe("bitdeck benchmarks", () => {
  test("popcount: number vs bigint", async ({ bench }) => {
    expect(popcount(SEVEN_CARD_MASK)).toBe(popcountBigInt(SEVEN_CARD_MASK_BIGINT));
    await bench.compare(
      bench("popcount (number)", () => popcount(SEVEN_CARD_MASK)),
      bench("popcount (bigint)", () => popcountBigInt(SEVEN_CARD_MASK_BIGINT)),
    );
  });

  test("rankMask: number vs bigint", async ({ bench }) => {
    expect(rankMask(SEVEN_CARD_MASK)).toBe(rankMaskBigInt(SEVEN_CARD_MASK_BIGINT));
    await bench.compare(
      bench("rankMask (number)", () => rankMask(SEVEN_CARD_MASK)),
      bench("rankMask (bigint)", () => rankMaskBigInt(SEVEN_CARD_MASK_BIGINT)),
    );
  });

  test("7-card deal: number vs bigint", async ({ bench }) => {
    const checkNumDeck = new Deck({ rng: mulberry32(42) });
    const checkBigDeck = new BigIntDeck(mulberry32(42));
    expect(BigInt(checkNumDeck.dealCards(7))).toBe(checkBigDeck.dealCards(7));

    await bench.compare(
      bench("deck.reset(); deck.dealCards(7) (number)", () => {
        deck7.reset();
        return deck7.dealCards(7);
      }),
      bench("deck.reset(); deck.dealCards(7) (bigint)", () => {
        bigIntDeck7.reset();
        return bigIntDeck7.dealCards(7);
      }),
    );
  });

  test("core bit, card, and deck operations", async ({ bench }) => {
    await bench("maskOr", () => maskOr(MASK_A, MASK_B)).run();

    await bench("extractCards (7 cards)", () => extractCards(SEVEN_CARD_MASK)).run();

    await bench("cardsMask (7 cards)", () => cardsMask(SEVEN_CARDS)).run();

    await bench("getCard", () => getCard("AS")).run();

    await bench("deck.reset(); deck.dealCards(2)", () => {
      deck2.reset();
      return deck2.dealCards(2);
    }).run();

    await bench("deck.clone()", () => templateDeck.clone()).run();
  });
});
