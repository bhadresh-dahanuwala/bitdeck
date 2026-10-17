# Benchmarks

Measured with `npm run bench` (`vitest bench --run`, Vitest v5.0.5 / Tinybench):

- **Machine:** Apple M5 Pro (`arm64`, 48 GB RAM)
- **OS:** macOS 26.7.1 (Build 25G241)
- **Node.js:** v24.14.0

## Results

### `number` (`CardMask`) vs `bigint` Reference (`bench/bigint-reference.ts`)

| Benchmark                                  | `hz` (ops/sec) | `mean` (ms) | `p75` (ms) | `p99` (ms) |  `rme` |    Samples | Relative               |
| ------------------------------------------ | -------------: | ----------: | ---------: | ---------: | -----: | ---------: | ---------------------- |
| `popcount (number)`                        |     54,311,241 |      0.0000 |     0.0000 |     0.0000 | ±0.06% | 70,013,365 | **2.54x faster**       |
| `popcount (bigint)`                        |     21,361,323 |      0.0001 |     0.0000 |     0.0001 | ±0.06% | 19,492,409 | baseline               |
| `rankMask (number)`                        |     51,704,960 |      0.0000 |     0.0000 |     0.0000 | ±0.05% | 67,052,816 | **2.97x faster**       |
| `rankMask (bigint)`                        |     17,382,393 |      0.0001 |     0.0001 |     0.0001 | ±9.79% | 13,986,001 | baseline               |
| `deck.reset(); deck.dealCards(7) (number)` |      2,856,260 |      0.0004 |     0.0004 |     0.0005 | ±0.05% |  2,803,444 | 0.21x (see note below) |
| `deck.reset(); deck.dealCards(7) (bigint)` |     13,292,144 |      0.0001 |     0.0001 |     0.0001 | ±0.05% | 12,453,038 | **4.65x faster**       |

### Core Bit, Card, and Deck Operations

| Benchmark                         | `hz` (ops/sec) | `mean` (ms) | `p75` (ms) | `p99` (ms) |  `rme` |    Samples |
| --------------------------------- | -------------: | ----------: | ---------: | ---------: | -----: | ---------: |
| `maskOr`                          |     53,099,493 |      0.0000 |     0.0000 |     0.0000 | ±0.06% | 68,630,453 |
| `extractCards (7 cards)`          |      3,173,516 |      0.0003 |     0.0003 |     0.0004 | ±0.04% |  3,124,965 |
| `cardsMask (7 cards)`             |      7,822,993 |      0.0001 |     0.0002 |     0.0002 | ±0.05% |  7,443,121 |
| `getCard`                         |     43,298,088 |      0.0000 |     0.0000 |     0.0000 | ±0.05% | 57,179,435 |
| `deck.reset(); deck.dealCards(2)` |      6,822,109 |      0.0002 |     0.0002 |     0.0002 | ±0.05% |  6,616,929 |
| `deck.clone()`                    |     11,376,781 |      0.0001 |     0.0001 |     0.0001 | ±1.21% | 10,558,309 |

## Summary

Pure bit-level hot-path primitives operating on 52-bit `number` masks (`popcount`, `rankMask`, and `maskOr`) sustain 51–54 million operations per second, outperforming their 64-bit SWAR `bigint` equivalents by **2.54x** (`popcount`) and **2.97x** (`rankMask`), while `O(1)` map-backed `getCard` lookups reach 43.3 million ops/sec and `deck.clone()` reaches 11.4 million ops/sec. In contrast, `deck.reset(); deck.dealCards(7)` is slower for `number` (`2.86M` ops/sec) than for the single-file `bigint` reference (`13.29M` ops/sec) under `vitest bench` for two reasons: first, Vitest's SSR module runner wraps cross-module imports (`src/deck.ts` importing `cardKey`, `maskOr`, `maskAndNot`, and `FULL_DECK_MASK` from `src/bits.ts`) in tracked export getters (`GetterTracker`), whereas running the bundled `dist/index.js` directly in Node.js raises `number` `deck.reset(); deck.dealCards(7)` to **~10.3M ops/sec**; second, each card dealt calls `maskOr` (splitting and recombining `lo`/`hi` 32-bit halves) and indexes a frozen JS array of boxed `HeapNumber`s (`CARD_KEYS`), whereas storing `CARD_KEYS` in a `Float64Array(52)` and summing disjoint card keys (`dealt += cardKey(chosen)`) reaches **~28.5M ops/sec** in Node.js.
