/**
 * A random number generator function returning a floating-point value in `[0, 1)`.
 *
 * @example
 * ```ts
 * const rng: Rng = Math.random;
 * const value = rng(); // 0 <= value < 1
 * ```
 */
export type Rng = () => number;

/**
 * Creates a deterministic, seeded 32-bit PRNG using the Mulberry32 algorithm.
 * Returns a function that produces uniformly distributed numbers in `[0, 1)`.
 *
 * @example
 * ```ts
 * const rng = mulberry32(42);
 * const first = rng(); // deterministic value in [0, 1)
 * ```
 */
export function mulberry32(seed: number): Rng {
  let s = seed | 0;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
