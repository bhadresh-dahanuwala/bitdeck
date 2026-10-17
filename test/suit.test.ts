import { describe, expect, it } from "vitest";
import {
  ALL_SUITS,
  CLUB,
  DIAMOND,
  HEART,
  NUM_SUITS,
  SPADE,
  SUIT_CODES,
  SUIT_SYMBOLS,
  Suit,
} from "../src/index";

describe("Suit", () => {
  it("constructs all standard suit constants with expected key, code, name, symbol, and index", () => {
    expect(CLUB.key).toBe(0x1);
    expect(DIAMOND.key).toBe(0x2);
    expect(HEART.key).toBe(0x4);
    expect(SPADE.key).toBe(0x8);

    expect(CLUB.code).toBe("C");
    expect(DIAMOND.code).toBe("D");
    expect(HEART.code).toBe("H");
    expect(SPADE.code).toBe("S");

    expect(CLUB.name).toBe("Club");
    expect(DIAMOND.name).toBe("Diamond");
    expect(HEART.name).toBe("Heart");
    expect(SPADE.name).toBe("Spade");

    expect(CLUB.symbol).toBe("♣");
    expect(DIAMOND.symbol).toBe("♦");
    expect(HEART.symbol).toBe("♥");
    expect(SPADE.symbol).toBe("♠");

    expect(CLUB.index).toBe(0);
    expect(DIAMOND.index).toBe(1);
    expect(HEART.index).toBe(2);
    expect(SPADE.index).toBe(3);
  });

  it("supports toString() returning symbol and JSON.stringify() returning code", () => {
    const custom = new Suit(0x1, "C", "Club", "♣");
    expect(custom.toString()).toBe("♣");
    expect(String(custom)).toBe("♣");
    expect(JSON.stringify(custom)).toBe('"C"');

    for (const suit of ALL_SUITS) {
      expect(suit.toString()).toBe(suit.symbol);
      expect(JSON.stringify(suit)).toBe(JSON.stringify(suit.code));
    }
  });

  it("exports frozen suit constants and arrays", () => {
    expect(NUM_SUITS).toBe(4);
    expect(SUIT_SYMBOLS).toEqual(["♠", "♥", "♦", "♣"]);
    expect(SUIT_CODES).toEqual(["C", "D", "H", "S"]);
    expect(ALL_SUITS).toEqual([CLUB, DIAMOND, HEART, SPADE]);

    expect(Object.isFrozen(SUIT_SYMBOLS)).toBe(true);
    expect(Object.isFrozen(SUIT_CODES)).toBe(true);
    expect(Object.isFrozen(ALL_SUITS)).toBe(true);
    for (const suit of ALL_SUITS) {
      expect(Object.isFrozen(suit)).toBe(true);
    }
  });
});
