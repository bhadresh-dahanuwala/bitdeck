import { describe, expect, it } from "vitest";
import {
  CLUBS,
  DIAMONDS,
  FULL_DECK_MASK,
  HEARTS,
  SAME_RANKS,
  SPADES,
  cardIndex,
  cardKey,
  forEachCardIndex,
  isSingleCard,
  isValidMask,
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
  type CardMask,
} from "../src/index";

const BIT_0 = 1;
const BIT_31 = 2 ** 31;
const BIT_32 = 2 ** 32;
const BIT_51 = 2 ** 51;
const BOTH_SIDES = BIT_0 + BIT_31 + BIT_32 + BIT_51;
const ALL_INDICES = Array.from({ length: 52 }, (_, i) => i);

function bigintPopcount(b: bigint): number {
  let count = 0;
  let v = b;
  while (v !== 0n) {
    v &= v - 1n;
    count++;
  }
  return count;
}

function bigintCardIndex(b: bigint): number {
  if (b === 0n) {
    return -1;
  }
  const lsb = b & -b;
  let idx = 0;
  let cur = lsb;
  while (cur > 1n) {
    cur >>= 1n;
    idx++;
  }
  return idx;
}

function slowRankMask(m: CardMask): number {
  const b = BigInt(m);
  let rmask = 0;
  for (let i = 0; i < 52; i++) {
    if ((b & (1n << BigInt(i))) !== 0n) {
      const rankIdx = Math.floor(i / 4);
      rmask |= 1 << rankIdx;
    }
  }
  return rmask;
}

function checkMaskSingle(a: CardMask): void {
  const ba = BigInt(a);
  expect(isValidMask(a)).toBe(true);
  expect(isSingleCard(a)).toBe(ba !== 0n && (ba & (ba - 1n)) === 0n);
  expect(popcount(a)).toBe(bigintPopcount(ba));
  expect(cardIndex(a)).toBe(bigintCardIndex(ba));
  expect(BigInt(lowestCardKey(a))).toBe(ba & -ba);
  expect(rankMask(a)).toBe(slowRankMask(a));

  const indices: number[] = [];
  forEachCardIndex(a, (idx) => {
    indices.push(idx);
  });
  const expected = ALL_INDICES.filter((idx) => ((ba >> BigInt(idx)) & 1n) === 1n);
  expect(indices).toEqual(expected);
}

function checkMaskPair(a: CardMask, b: CardMask): void {
  const ba = BigInt(a);
  const bb = BigInt(b);

  expect(BigInt(maskAnd(a, b))).toBe(ba & bb);
  expect(BigInt(maskOr(a, b))).toBe(ba | bb);
  expect(BigInt(maskXor(a, b))).toBe(ba ^ bb);
  expect(BigInt(maskAndNot(a, b))).toBe(ba & ~bb);

  expect(maskContains(a, b)).toBe((ba & bb) === bb);
  const sub = maskAnd(a, b);
  expect(maskContains(a, sub)).toBe(true);

  expect(maskIntersects(a, b)).toBe((ba & bb) !== 0n);
}

describe("constants", () => {
  it("defines FULL_DECK_MASK and suit masks accurately", () => {
    expect(FULL_DECK_MASK).toBe(2 ** 52 - 1);
    expect(popcount(FULL_DECK_MASK)).toBe(52);
    expect(popcount(CLUBS)).toBe(13);
    expect(popcount(DIAMONDS)).toBe(13);
    expect(popcount(HEARTS)).toBe(13);
    expect(popcount(SPADES)).toBe(13);
    expect(maskOr(maskOr(CLUBS, DIAMONDS), maskOr(HEARTS, SPADES))).toBe(FULL_DECK_MASK);
    expect(maskIntersects(CLUBS, DIAMONDS)).toBe(false);
    expect(maskIntersects(HEARTS, SPADES)).toBe(false);
  });

  it("defines SAME_RANKS as 13 frozen rank masks summing to FULL_DECK_MASK", () => {
    expect(Object.isFrozen(SAME_RANKS)).toBe(true);
    expect(SAME_RANKS).toHaveLength(13);
    let union = 0;
    for (let r = 0; r < 13; r++) {
      const mask = SAME_RANKS[r] ?? 0;
      expect(mask).toBe(0xf * 16 ** r);
      expect(popcount(mask)).toBe(4);
      union = maskOr(union, mask);
    }
    expect(union).toBe(FULL_DECK_MASK);
  });
});

describe("isValidMask & isSingleCard", () => {
  it("validates masks at boundaries and rejects invalid values", () => {
    expect(isValidMask(0)).toBe(true);
    expect(isValidMask(BIT_0)).toBe(true);
    expect(isValidMask(BIT_31)).toBe(true);
    expect(isValidMask(BIT_32)).toBe(true);
    expect(isValidMask(BIT_51)).toBe(true);
    expect(isValidMask(FULL_DECK_MASK)).toBe(true);

    expect(isValidMask(-1)).toBe(false);
    expect(isValidMask(FULL_DECK_MASK + 1)).toBe(false);
    expect(isValidMask(1.5)).toBe(false);
    expect(isValidMask(Number.NaN)).toBe(false);
    expect(isValidMask(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isValidMask("1")).toBe(false);
    expect(isValidMask(null)).toBe(false);
    expect(isValidMask(1n)).toBe(false);
  });

  it("identifies single-card masks across all 52 bits and rejects others", () => {
    for (let i = 0; i < 52; i++) {
      expect(isSingleCard(2 ** i)).toBe(true);
    }
    expect(isSingleCard(0)).toBe(false);
    expect(isSingleCard(-1)).toBe(false);
    expect(isSingleCard(1.5)).toBe(false);
    expect(isSingleCard(2 ** 52)).toBe(false);
    expect(isSingleCard(BIT_0 + BIT_31)).toBe(false);
    expect(isSingleCard(BIT_0 + BIT_32)).toBe(false);
    expect(isSingleCard(BIT_32 + BIT_51)).toBe(false);
    expect(isSingleCard(FULL_DECK_MASK)).toBe(false);
  });
});

describe("edge cases around bit 31 and bit 32", () => {
  it("handles bitwise operations across the 32-bit boundary", () => {
    expect(maskOr(BIT_31, BIT_32)).toBe(BIT_31 + BIT_32);
    expect(maskAnd(BOTH_SIDES, BIT_31 + BIT_51)).toBe(BIT_31 + BIT_51);
    expect(maskXor(BOTH_SIDES, BIT_0 + BIT_32)).toBe(BIT_31 + BIT_51);
    expect(maskAndNot(FULL_DECK_MASK, FULL_DECK_MASK)).toBe(0);
    expect(maskAndNot(BOTH_SIDES, BIT_31 + BIT_32)).toBe(BIT_0 + BIT_51);

    expect(maskContains(BOTH_SIDES, 0)).toBe(true);
    expect(maskContains(BOTH_SIDES, BIT_31 + BIT_32)).toBe(true);
    expect(maskContains(BOTH_SIDES, BIT_0 + 2)).toBe(false);
    expect(maskContains(BOTH_SIDES, BIT_32 + 2 ** 33)).toBe(false);

    expect(maskIntersects(0, FULL_DECK_MASK)).toBe(false);
    expect(maskIntersects(BIT_31, BIT_32)).toBe(false);
    expect(maskIntersects(BOTH_SIDES, BIT_31)).toBe(true);
    expect(maskIntersects(BOTH_SIDES, BIT_32)).toBe(true);
  });

  it("handles popcount, cardIndex, cardKey, lowestCardKey, and forEachCardIndex at edges", () => {
    expect(popcount(0)).toBe(0);
    expect(popcount(BIT_0)).toBe(1);
    expect(popcount(BIT_31)).toBe(1);
    expect(popcount(BIT_32)).toBe(1);
    expect(popcount(BIT_51)).toBe(1);
    expect(popcount(BOTH_SIDES)).toBe(4);
    expect(popcount(FULL_DECK_MASK)).toBe(52);

    expect(cardIndex(0)).toBe(-1);
    expect(cardIndex(BIT_0)).toBe(0);
    expect(cardIndex(BIT_31)).toBe(31);
    expect(cardIndex(BIT_32)).toBe(32);
    expect(cardIndex(BIT_51)).toBe(51);
    expect(cardIndex(BIT_31 + BIT_51)).toBe(31);
    expect(cardIndex(BIT_32 + BIT_51)).toBe(32);

    for (let i = 0; i < 52; i++) {
      expect(cardKey(i)).toBe(2 ** i);
      expect(cardIndex(cardKey(i))).toBe(i);
    }
    expect(cardKey(-1)).toBe(0);
    expect(cardKey(52)).toBe(0);

    expect(lowestCardKey(0)).toBe(0);
    expect(lowestCardKey(BIT_0)).toBe(BIT_0);
    expect(lowestCardKey(BIT_31)).toBe(BIT_31);
    expect(lowestCardKey(BIT_32)).toBe(BIT_32);
    expect(lowestCardKey(BIT_51)).toBe(BIT_51);
    expect(lowestCardKey(BIT_31 + BIT_32)).toBe(BIT_31);
    expect(lowestCardKey(BIT_32 + BIT_51)).toBe(BIT_32);

    const visited: number[] = [];
    forEachCardIndex(0, (i) => visited.push(i));
    expect(visited).toEqual([]);

    forEachCardIndex(BOTH_SIDES, (i) => visited.push(i));
    expect(visited).toEqual([0, 31, 32, 51]);

    const allVisited: number[] = [];
    forEachCardIndex(FULL_DECK_MASK, (i) => allVisited.push(i));
    expect(allVisited).toEqual(ALL_INDICES);
  });

  it("computes rankMask accurately at boundaries", () => {
    expect(rankMask(0)).toBe(0);
    expect(rankMask(FULL_DECK_MASK)).toBe(0x1fff);
    expect(rankMask(CLUBS)).toBe(0x1fff);
    expect(rankMask(BIT_0)).toBe(1 << 0);
    expect(rankMask(BIT_31)).toBe(1 << 7);
    expect(rankMask(BIT_32)).toBe(1 << 8);
    expect(rankMask(BIT_51)).toBe(1 << 12);
    expect(rankMask(BOTH_SIDES)).toBe((1 << 0) | (1 << 7) | (1 << 8) | (1 << 12));
  });
});

describe("random 52-bit masks cross-checked against bigint & slow references", () => {
  it("matches bigint reference across 10,000 dense masks", () => {
    const rng = mulberry32(42);
    const masks: CardMask[] = [];
    for (let i = 0; i < 10000; i++) {
      const hi = Math.floor(rng() * 2 ** 20);
      const lo = Math.floor(rng() * 2 ** 32);
      masks.push(hi * 2 ** 32 + lo);
    }

    for (let i = 0; i < 10000; i++) {
      const a = masks[i] ?? 0;
      const b = masks[(i + 1) % 10000] ?? 0;
      checkMaskSingle(a);
      checkMaskPair(a, b);
    }
  });

  it("matches bigint reference across 10,000 sparse (1–9 cards) and 10,000 high-bits-only masks", () => {
    const rng = mulberry32(42);
    const sparseMasks: CardMask[] = [];
    const hiOnlyMasks: CardMask[] = [];

    for (let i = 0; i < 10000; i++) {
      const sparseCount = 1 + Math.floor(rng() * 9);
      let sMask = 0;
      for (let k = 0; k < sparseCount; k++) {
        sMask = maskOr(sMask, cardKey(Math.floor(rng() * 52)));
      }
      sparseMasks.push(sMask);

      const hiCount = 1 + Math.floor(rng() * 9);
      let hMask = 0;
      for (let k = 0; k < hiCount; k++) {
        hMask = maskOr(hMask, cardKey(32 + Math.floor(rng() * 20)));
      }
      hiOnlyMasks.push(hMask);
    }

    for (let i = 0; i < 10000; i++) {
      const s = sparseMasks[i] ?? 0;
      const h = hiOnlyMasks[i] ?? 0;
      checkMaskSingle(s);
      checkMaskSingle(h);
      checkMaskPair(s, h);
      checkMaskPair(h, s);
    }
  });
});
