# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Added

- 52-bit `CardMask` (`number`) bitwise primitives in `src/bits.ts` (`FULL_DECK_MASK`, `CLUBS`, `DIAMONDS`, `HEARTS`, `SPADES`, `SAME_RANKS`, `isValidMask`, `isSingleCard`, `maskAnd`, `maskOr`, `maskXor`, `maskAndNot`, `maskContains`, `maskIntersects`, `popcount`, `cardIndex`, `cardKey`, `lowestCardKey`, `forEachCardIndex`, `rankMask`).
- Injectable `Rng` type and deterministic `mulberry32(seed)` PRNG in `src/random.ts`.
- `Rank` class and frozen constants (`R2`–`RA`, `NUM_RANKS`, `RANK_CODES`, `ALL_RANKS`, `RANKS_DESC`) in `src/rank.ts`.
- `Suit` class and frozen constants (`CLUB`, `DIAMOND`, `HEART`, `SPADE`, `NUM_SUITS`, `SUIT_SYMBOLS`, `SUIT_CODES`, `ALL_SUITS`) in `src/suit.ts`.
- `Card` class, 52 frozen card constants (`C2C`–`CAS`), `ALL_CARDS`, and card utilities (`sortCards`, `cardsMask`, `rankMaskFromCards`, `extractCards`, `extractCardsKey`, `getCardByKey`, `getCard`, `getCardKeyFromCode`, `getCards`, `getCardKeysFromCodes`) in `src/card.ts`.
- `Deck` class and `DeckOptions` interface in `src/deck.ts` with `Uint8Array(52)` storage, partial Fisher–Yates dealing (`dealCards`), atomic `dealSpecificCards`, deduplicated `addCard`/`addCards`, remaining-only `shuffle`, and `clone`.
- Dual ESM + CJS package builds via `tsdown` with full TypeScript declarations, verified by `publint` and `@arethetypeswrong/cli`.
- Vitest benchmark suite (`bench/`) and `BENCHMARKS.md` comparing 52-bit `number` masks against a 64-bit `bigint` reference.
