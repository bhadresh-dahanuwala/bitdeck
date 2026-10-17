import { describe, expect, it } from "vitest";
import {
  ALL_RANKS,
  NUM_RANKS,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  RA,
  RANKS_DESC,
  RANK_CODES,
  RJ,
  RK,
  RQ,
  RT,
  Rank,
} from "../src/index";

describe("Rank", () => {
  it("constructs all standard rank constants with expected key, code, name, and index", () => {
    expect(R2.key).toBe(0x1);
    expect(R3.key).toBe(0x2);
    expect(R4.key).toBe(0x4);
    expect(R5.key).toBe(0x8);
    expect(R6.key).toBe(0x10);
    expect(R7.key).toBe(0x20);
    expect(R8.key).toBe(0x40);
    expect(R9.key).toBe(0x80);
    expect(RT.key).toBe(0x100);
    expect(RJ.key).toBe(0x200);
    expect(RQ.key).toBe(0x400);
    expect(RK.key).toBe(0x800);
    expect(RA.key).toBe(0x1000);

    expect(R2.code).toBe("2");
    expect(R3.code).toBe("3");
    expect(R4.code).toBe("4");
    expect(R5.code).toBe("5");
    expect(R6.code).toBe("6");
    expect(R7.code).toBe("7");
    expect(R8.code).toBe("8");
    expect(R9.code).toBe("9");
    expect(RT.code).toBe("T");
    expect(RJ.code).toBe("J");
    expect(RQ.code).toBe("Q");
    expect(RK.code).toBe("K");
    expect(RA.code).toBe("A");

    expect(R2.name).toBe("Two");
    expect(R3.name).toBe("Three");
    expect(R4.name).toBe("Four");
    expect(R5.name).toBe("Five");
    expect(R6.name).toBe("Six");
    expect(R7.name).toBe("Seven");
    expect(R8.name).toBe("Eight");
    expect(R9.name).toBe("Nine");
    expect(RT.name).toBe("Ten");
    expect(RJ.name).toBe("Jack");
    expect(RQ.name).toBe("Queen");
    expect(RK.name).toBe("King");
    expect(RA.name).toBe("Ace");

    for (let i = 0; i < ALL_RANKS.length; i++) {
      const rank = ALL_RANKS[i];
      expect(rank?.index).toBe(i);
      expect(rank?.key).toBe(1 << i);
    }
  });

  it("supports toString() and JSON.stringify()", () => {
    const custom = new Rank(0x1, "2", "Two");
    expect(custom.toString()).toBe("2");
    expect(String(custom)).toBe("2");
    expect(JSON.stringify(custom)).toBe('"2"');

    for (const rank of ALL_RANKS) {
      expect(rank.toString()).toBe(rank.code);
      expect(JSON.stringify(rank)).toBe(JSON.stringify(rank.code));
    }
  });

  it("exports frozen rank constants and arrays", () => {
    expect(NUM_RANKS).toBe(13);
    expect(RANK_CODES).toEqual(["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]);
    expect(ALL_RANKS).toEqual([R2, R3, R4, R5, R6, R7, R8, R9, RT, RJ, RQ, RK, RA]);
    expect(RANKS_DESC).toEqual([RA, RK, RQ, RJ, RT, R9, R8, R7, R6, R5, R4, R3, R2]);

    expect(Object.isFrozen(RANK_CODES)).toBe(true);
    expect(Object.isFrozen(ALL_RANKS)).toBe(true);
    expect(Object.isFrozen(RANKS_DESC)).toBe(true);
    for (const rank of ALL_RANKS) {
      expect(Object.isFrozen(rank)).toBe(true);
    }
  });
});
