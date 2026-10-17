import { describe, expect, test } from "vitest";
import * as bitdeck from "../dist/index.js";
import type { Card, CardMask } from "../dist/index.js";
import * as bigintRef from "./bigint-reference";

const { Deck, cardsMask, extractCards, getCard, maskOr, mulberry32, popcount, rankMask } = bitdeck;
const { BigIntDeck, popcountBigInt, rankMaskBigInt } = bigintRef;

const HAND_COUNT = 1024;
const HAND_MASK = HAND_COUNT - 1;

const handGenDeck = new Deck({ rng: mulberry32(42) });
const HANDS: readonly CardMask[] = Object.freeze(
  Array.from({ length: HAND_COUNT }, () => {
    handGenDeck.reset();
    return handGenDeck.dealCards(7);
  }),
);
const HANDS_BIGINT: readonly bigint[] = Object.freeze(HANDS.map((m) => BigInt(m)));
const HAND_CARDS: readonly (readonly Card[])[] = Object.freeze(
  HANDS.map((m) => Object.freeze(extractCards(m))),
);

/** `HANDS[index]` for `0 <= index < 1024` (masked with `& 1023` at call sites). */
function handAt(index: number): CardMask {
  return (HANDS as readonly [CardMask, ...CardMask[]])[index as 0];
}

/** `HANDS_BIGINT[index]` for `0 <= index < 1024` (masked with `& 1023` at call sites). */
function handBigIntAt(index: number): bigint {
  return (HANDS_BIGINT as readonly [bigint, ...bigint[]])[index as 0];
}

/** `HAND_CARDS[index]` for `0 <= index < 1024` (masked with `& 1023` at call sites). */
function handCardsAt(index: number): readonly Card[] {
  return (HAND_CARDS as readonly [readonly Card[], ...(readonly Card[])[]])[index as 0];
}

const deck2 = new Deck({ rng: mulberry32(101) });
const deck7 = new Deck({ rng: mulberry32(202) });
const bigIntDeck7 = new BigIntDeck(mulberry32(202));
const templateDeck = new Deck({ rng: mulberry32(303) });

describe("bitdeck benchmarks", () => {
  test("popcount: number vs bigint", async ({ bench }) => {
    for (let k = 0; k < HAND_COUNT; k++) {
      expect(popcount(handAt(k))).toBe(popcountBigInt(handBigIntAt(k)));
    }
    let i = 0;
    let j = 0;
    await bench.compare(
      bench("popcount (number)", () => popcount(handAt(i++ & HAND_MASK))),
      bench("popcount (bigint)", () => popcountBigInt(handBigIntAt(j++ & HAND_MASK))),
    );
  });

  test("rankMask: number vs bigint", async ({ bench }) => {
    for (let k = 0; k < HAND_COUNT; k++) {
      expect(rankMask(handAt(k))).toBe(rankMaskBigInt(handBigIntAt(k)));
    }
    let i = 0;
    let j = 0;
    await bench.compare(
      bench("rankMask (number)", () => rankMask(handAt(i++ & HAND_MASK))),
      bench("rankMask (bigint)", () => rankMaskBigInt(handBigIntAt(j++ & HAND_MASK))),
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
    let iMaskOr = 0;
    await bench("maskOr", () => {
      const idx = iMaskOr++ & HAND_MASK;
      return maskOr(handAt(idx), handAt((idx + 1) & HAND_MASK));
    }).run();

    let iExtract = 0;
    await bench("extractCards (7 cards)", () => extractCards(handAt(iExtract++ & HAND_MASK))).run();

    let iCardsMask = 0;
    await bench("cardsMask (7 cards)", () =>
      cardsMask(handCardsAt(iCardsMask++ & HAND_MASK)),
    ).run();

    await bench("getCard", () => getCard("AS")).run();

    await bench("deck.reset(); deck.dealCards(2)", () => {
      deck2.reset();
      return deck2.dealCards(2);
    }).run();

    await bench("deck.clone()", () => templateDeck.clone()).run();
  });
});
