import { describe, expect, it } from "vitest";
import { mulberry32 } from "../src/index";

describe("mulberry32", () => {
  it("matches canonical reference values for seed 42", () => {
    const rng = mulberry32(42);
    expect([rng(), rng(), rng()]).toEqual([
      0.6011037519201636, 0.44829055899754167, 0.8524657934904099,
    ]);
  });

  it("produces identical sequences for the same seed", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  it("produces different sequences for different seeds", () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);
    expect(rng1()).not.toBe(rng2());
  });

  it("produces values strictly in [0, 1)", () => {
    const rng = mulberry32(123456789);
    for (let i = 0; i < 10000; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});
