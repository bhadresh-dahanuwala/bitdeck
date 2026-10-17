# Benchmarks

- **Machine:** Apple M5 Pro (`arm64`, 48 GB RAM)
- **OS:** macOS 26.7.1 (Build 25G241)
- **Node.js:** v24.14.0
- **Methodology:** Measured on the built `dist/` package with `npm run bench` (`vitest bench --run --reporter=verbose`, Vitest v5.0.5 / Tinybench) cycling over 1,024 seeded random 7-card hands; Tinybench's per-call harness overhead caps tiny operations at roughly 40–50M ops/sec, so for `popcount` and `rankMask` the `number`-vs-`bigint` ratio matters more than the absolute ops/sec.

## Results

### `number` (`CardMask`) vs `bigint` Reference (`bench/bigint-reference.ts`)

| Benchmark                                          | `hz` (ops/sec) | `mean` (ms) | `p75` (ms) | `p99` (ms) |  `rme` |    Samples | Relative                           |
| -------------------------------------------------- | -------------: | ----------: | ---------: | ---------: | -----: | ---------: | ---------------------------------- |
| `popcount (number)`                                |     41,051,071 |      0.0000 |     0.0000 |     0.0000 | ±0.05% | 54,401,700 | **2.00x faster**                   |
| `popcount (bigint)`                                |     20,538,608 |      0.0001 |     0.0001 |     0.0001 | ±0.05% | 18,466,862 | baseline                           |
| `rankMask (number)`                                |     38,142,640 |      0.0000 |     0.0000 |     0.0000 | ±0.06% | 50,688,124 | **2.33x faster**                   |
| `rankMask (bigint)`                                |     16,397,165 |      0.0001 |     0.0001 |     0.0001 | ±0.34% | 14,247,826 | baseline                           |
| `deck.reset(); deck.dealCards(7) (number, before)` |      9,000,062 |      0.0001 |     0.0001 |     0.0002 | ±0.06% |  8,525,194 | 0.71x vs `bigint`                  |
| `deck.reset(); deck.dealCards(7) (number, after)`  |     17,562,576 |      0.0001 |     0.0001 |     0.0001 | ±0.04% | 15,530,552 | **1.39x faster** (1.95x vs before) |
| `deck.reset(); deck.dealCards(7) (bigint)`         |     12,668,760 |      0.0001 |     0.0001 |     0.0001 | ±0.04% | 12,036,281 | baseline                           |

### Core Bit, Card, and Deck Operations

| Benchmark                                  | `hz` (ops/sec) | `mean` (ms) | `p75` (ms) | `p99` (ms) |  `rme` |    Samples |
| ------------------------------------------ | -------------: | ----------: | ---------: | ---------: | -----: | ---------: |
| `maskOr`                                   |     36,067,906 |      0.0000 |     0.0000 |     0.0000 | ±0.06% | 48,009,065 |
| `extractCards (7 cards)`                   |     18,476,532 |      0.0001 |     0.0001 |     0.0001 | ±0.04% | 16,331,900 |
| `cardsMask (7 cards)`                      |     17,300,026 |      0.0001 |     0.0001 |     0.0001 | ±0.13% | 15,198,117 |
| `getCard`                                  |     38,516,177 |      0.0000 |     0.0000 |     0.0000 | ±0.08% | 51,220,275 |
| `deck.reset(); deck.dealCards(2) (before)` |     20,229,594 |      0.0001 |     0.0001 |     0.0001 | ±0.05% | 18,175,578 |
| `deck.reset(); deck.dealCards(2) (after)`  |     22,929,317 |      0.0000 |     0.0000 |     0.0001 | ±0.18% | 22,714,026 |
| `deck.clone()`                             |     24,047,039 |      0.0000 |     0.0000 |     0.0000 | ±0.85% | 25,704,856 |

## Summary

Across 1,024 varied 7-card hands on the built `dist/` bundle, 52-bit `number` masks (`CardMask`) outperform their 64-bit SWAR `bigint` counterparts across every benchmark: `popcount` is **2.00x faster** (`41.05M` vs `20.54M` ops/sec), `rankMask` is **2.33x faster** (`38.14M` vs `16.40M` ops/sec), and `deck.reset(); deck.dealCards(7)` is **1.39x faster** (`17.56M` vs `12.67M` ops/sec). Storing `CARD_KEYS` in an unboxed `Float64Array(52)` (instead of a frozen boxed JS array) and using exact disjoint arithmetic (`dealt += cardKey(chosen)` and `this.#key -= dealt`) in `Deck.dealCards` nearly doubled 7-card deal throughput from `9.00M` to `17.56M` ops/sec (**1.95x**) and raised 2-card deal throughput from `20.23M` to `22.93M` ops/sec, while `getCard` (`38.52M` ops/sec), `maskOr` (`36.07M` ops/sec), `deck.clone()` (`24.05M` ops/sec), `extractCards` (`18.48M` ops/sec), and `cardsMask` (`17.30M` ops/sec) all operate without per-call heap allocations on hot paths.
