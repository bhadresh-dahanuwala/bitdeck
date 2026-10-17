# bitdeck

[![npm version](https://img.shields.io/npm/v/bitdeck.svg)](https://www.npmjs.com/package/bitdeck)
[![CI](https://github.com/bhadresh-dahanuwala/bitdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/bhadresh-dahanuwala/bitdeck/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Fast bitmask-based playing cards, decks, suits, and ranks for TypeScript — built for poker-scale evaluation.

`bitdeck` is a zero-dependency TypeScript port of the Python [`cardspy`](https://github.com/bhadresh-dahanuwala/cardspy) library, using the exact same 52-bit card layout stored in standard IEEE-754 `number` values so card sets can be manipulated at tens of millions of operations per second and exchanged directly with Python.

## Features

- **52-bit `CardMask` in a plain `number`**: Every card is a single bit (`2 ** i`, `0 <= i < 52`) and every card set is a 52-bit integer mask — no `bigint` overhead or heap allocations on hot paths.
- **52-bit-safe bitwise primitives**: Dedicated helpers (`maskOr`, `maskAnd`, `maskXor`, `maskAndNot`, `maskContains`, `maskIntersects`, `popcount`, `rankMask`, `lowestCardKey`, `forEachCardIndex`) that split into 32-bit halves and never suffer from JavaScript's 32-bit bitwise truncation.
- **Rich `Card`, `Suit`, and `Rank` objects**: Frozen singletons (`C2C`…`CAS`, `CLUB`…`SPADE`, `R2`…`RA`) with `.key`, `.code`, `.name`, `.symbol`, `.index`, `toString()`, and `toJSON()`.
- **Preallocated `Deck` with `O(n)` dealing**: Backed by a `Uint8Array(52)` and partial Fisher–Yates sampling; supports `shuffle()`, `dealCards()`, `dealSpecificCard()`, `dealSpecificCards()`, `addCard()`, `removeCard()`, `clone()`, and injectable RNGs.
- **Flexible `O(1)` card code lookup**: `getCard` accepts ASCII codes (`"AS"`, `"10H"`, `"TH"`), lowercase (`"as"`, `"10h"`), and Unicode suit symbols (`"A♠"`, `"10♥"`).
- **Seeded PRNG included**: Built-in `mulberry32(seed)` for deterministic simulations and tests.
- **Zero runtime dependencies**: Dual ESM + CJS builds with full TypeScript declarations; runs in Node.js ≥ 20 and modern browsers with 100% test coverage.

## Installation

```bash
npm install bitdeck
```

## Quick Start

```ts
import {
  C2C,
  C3D,
  Deck,
  cardsMask,
  extractCards,
  mulberry32,
  popcount,
  rankMaskFromCards,
  sortCards,
} from "bitdeck";

// Create a new 52-card deck (optionally with a seeded RNG)
const deck = new Deck({ rng: mulberry32(42) });
console.log(deck.count()); // 52

// Shuffle and deal 5 cards as a 52-bit CardMask
deck.shuffle();
const handMask = deck.dealCards(5);
const dealtCards = extractCards(handMask);
console.log(popcount(handMask)); // 5
console.log("Dealt:", dealtCards.map(String));

// Remove a specific card from the deck
deck.removeCard(C2C.key);
console.log(deck.contains(C2C.key)); // false

// Add the card back to the deck
deck.addCard(C2C.key);
console.log(deck.contains(C2C.key)); // true

// Sort dealt cards in ascending rank order
const sortedCards = sortCards(dealtCards);
console.log("Sorted:", sortedCards.map(String));

// Combine cards into a bitmask and inspect ranks
const mask = cardsMask([C2C, C3D]);
console.log(mask); // 0x21 (33)
console.log(extractCards(mask)); // [C2C, C3D]
console.log(rankMaskFromCards(mask)); // 0b11 (3)
```

## Working with Masks

A `CardMask` is a plain JavaScript `number` representing a subset of the 52-card deck. Because IEEE-754 double-precision floats represent integers exactly up to `2 ** 53 - 1` (`Number.MAX_SAFE_INTEGER`), all 52 card bits (`0` through `2 ** 52 - 1`) fit in a standard `number` without precision loss.

Each card's bit position is:

```text
index = rank.index * 4 + suit.index   // 0..51 (ranks 2..A -> 0..12, suits C,D,H,S -> 0..3)
key   = 2 ** index                    // 2♣ = 0x1, 2♦ = 0x2, 3♣ = 0x10, ..., A♠ = 2 ** 51
```

> **Warning: Never apply JavaScript's bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`) directly to a `CardMask`.**
>
> JavaScript bitwise operators coerce their operands to 32-bit signed integers, silently discarding bits 32–51 (all Tens, Jacks, Queens, Kings, and Aces). Always use the 52-bit mask helpers exported by `bitdeck`.

```ts
import {
  C2C,
  CAS,
  CLUBS,
  FULL_DECK_MASK,
  SAME_RANKS,
  SPADES,
  forEachCardIndex,
  lowestCardKey,
  maskAnd,
  maskAndNot,
  maskContains,
  maskIntersects,
  maskOr,
  maskXor,
  popcount,
  rankMask,
} from "bitdeck";

// WRONG — 32-bit bitwise OR drops Ace of Spades (2 ** 51):
// const broken = C2C.key | CAS.key; // 1 (CAS bit is lost!)

// RIGHT — 52-bit mask helpers preserve all 52 bits:
const hand = maskOr(C2C.key, CAS.key);
popcount(hand); // 2
maskContains(hand, CAS.key); // true
maskIntersects(hand, SPADES); // true

// Set operations across 52 bits
const blackCards = maskOr(CLUBS, SPADES); // 26 cards
const aces = SAME_RANKS[12]!; // all four Aces (0xf000000000000)
const blackAces = maskAnd(blackCards, aces); // A♣ and A♠
const nonAceSpades = maskAndNot(SPADES, aces); // 12 non-Ace spades
const toggled = maskXor(hand, C2C.key); // only A♠ remains

// Inspecting bits and ranks without allocating arrays
lowestCardKey(hand); // C2C.key (0x1)
rankMask(hand); // (1 << 0) | (1 << 12) = 0x1001
popcount(FULL_DECK_MASK); // 52

const indices: number[] = [];
forEachCardIndex(hand, (i) => indices.push(i)); // [0, 51]
```

## Detailed Examples

### Working with Cards

#### Creating and Accessing Cards

```ts
import { C2C, C3D, C4H, C5S, CLUB, Card, R2 } from "bitdeck";

// Predefined frozen card constants (all 52 cards: C2C .. CAS)
console.log(String(C2C)); // "2♣"
console.log(String(C3D)); // "3♦"
console.log(String(C4H)); // "4♥"
console.log(String(C5S)); // "5♠"

// Accessing card properties
console.log(C2C.key); // 0x1 (single-card bitmask)
console.log(C2C.rank); // R2
console.log(C2C.suit); // CLUB
console.log(C2C.code); // "2C"
console.log(C2C.name); // "Two of Clubs"
console.log(C2C.symbol); // "2♣"
console.log(C2C.index); // 0
console.log(JSON.stringify(C2C)); // '"2C"'

// Creating a custom Card instance
const customCard = new Card(0x1, R2, CLUB, "2C", "Two of Clubs", "2♣");
```

#### Card Code and Key Utilities

```ts
import { getCard, getCardByKey, getCardKeyFromCode, getCardKeysFromCodes, getCards } from "bitdeck";

// O(1) lookup by ASCII code, lowercase, Unicode symbol, or "10"
const aceOfSpades = getCard("AS"); // also accepts "as", "A♠", "a♠"
const tenOfHearts = getCard("10H"); // also accepts "TH", "th", "T♥", "10♥"
console.log(String(aceOfSpades)); // "A♠"
console.log(String(tenOfHearts)); // "10♥"

// Lookup a Card from its single-card bitmask key
console.log(getCardByKey(0x1)); // C2C

// Get single-card key from code
const key = getCardKeyFromCode("10H");

// Get multiple Card objects from codes
const cards = getCards(["2C", "KD", "J♥"]);
console.log(cards.map(String)); // ["2♣", "K♦", "J♥"]

// Combine card codes directly into a 52-bit CardMask
const mask = getCardKeysFromCodes(["2C", "KD", "J♥"]);
```

### Working with Suits and Ranks

#### Suit Operations

```ts
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
} from "bitdeck";

console.log(String(CLUB)); // "♣"
console.log(String(DIAMOND)); // "♦"
console.log(String(HEART)); // "♥"
console.log(String(SPADE)); // "♠"

console.log(CLUB.key); // 0x1
console.log(CLUB.code); // "C"
console.log(CLUB.name); // "Club"
console.log(CLUB.symbol); // "♣"
console.log(CLUB.index); // 0

console.log(NUM_SUITS); // 4
console.log(SUIT_CODES); // ["C", "D", "H", "S"]
console.log(SUIT_SYMBOLS); // ["♠", "♥", "♦", "♣"]
console.log(ALL_SUITS); // [CLUB, DIAMOND, HEART, SPADE]

const customSuit = new Suit(0x1, "C", "Club", "♣");
```

#### Rank Operations

```ts
import { ALL_RANKS, NUM_RANKS, R2, RA, RANKS_DESC, RANK_CODES, RK, Rank } from "bitdeck";

console.log(String(R2)); // "2"
console.log(String(RK)); // "K"
console.log(String(RA)); // "A"

console.log(R2.key); // 0x1
console.log(R2.code); // "2"
console.log(R2.name); // "Two"
console.log(R2.index); // 0

console.log(NUM_RANKS); // 13
console.log(RANK_CODES); // ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
console.log(ALL_RANKS.length); // 13 (R2 .. RA)
console.log(RANKS_DESC.length); // 13 (RA .. R2)

const customRank = new Rank(0x1, "2", "Two");
```

### Working with Decks

#### Basic Deck Operations

```ts
import { C2C, Deck, extractCards } from "bitdeck";

const deck = new Deck();
console.log(deck.count()); // 52

// Shuffle remaining cards
deck.shuffle();

// Deal 5 random cards (default: count = 1, shuffle = true)
const handMask = deck.dealCards(5);
const cards = extractCards(handMask);
console.log(cards.map(String));

// Remove and re-add a single card
deck.removeCard(C2C.key);
console.log(deck.contains(C2C.key)); // false
deck.addCard(C2C.key);
console.log(deck.contains(C2C.key)); // true

// Clear and reset to a full 52-card deck
deck.clear();
console.log(deck.count()); // 0
deck.reset();
console.log(deck.count()); // 52
```

#### Advanced Deck Operations

```ts
import { C2C, C3D, CLUBS, Deck, cardsMask } from "bitdeck";

// Deal specific cards atomically
const deck = new Deck();
const targetCards = cardsMask([C2C, C3D]);
deck.dealSpecificCards(targetCards);
console.log(deck.count()); // 50

// Inspect remaining cards
const remainingCards = deck.getCards(); // or deck.getRemainingCards()
const remainingMask = deck.getRemainingCardsKey(); // or deck.key

// Add and remove multiple cards by mask
deck.addCards(targetCards);
console.log(deck.contains(targetCards)); // true
deck.removeCards(targetCards);
console.log(deck.contains(targetCards)); // false

// Clone a deck (independent state, shares the same rng function)
const copy = deck.clone();

// Construct a deck with a custom initial card subset
const clubsOnlyDeck = new Deck({ cards: CLUBS });
console.log(clubsOnlyDeck.count()); // 13
```

### Bitmask Operations

#### Card Set Operations and Sorting

```ts
import {
  C2C,
  C3D,
  C4H,
  C5S,
  cardsMask,
  extractCards,
  extractCardsKey,
  rankMaskFromCards,
  sortCards,
} from "bitdeck";

const hand = [C5S, C2C, C4H, C3D];
const mask = cardsMask(hand);

// Extract Card objects or single-card keys in ascending index order
console.log(extractCards(mask).map(String)); // ["2♣", "3♦", "4♥", "5♠"]
console.log(extractCardsKey(mask)); // [0x1, 0x20, 0x400, 0x8000]

// Compute 13-bit rank presence mask (bits 0, 1, 2, 3 set -> 0b1111)
console.log(rankMaskFromCards(mask).toString(2)); // "1111"

// Sort Card array by ascending rank (stable for equal ranks)
const sorted = sortCards(hand);
console.log(sorted.map(String)); // ["2♣", "3♦", "4♥", "5♠"]
```

## Seeded RNG

Randomness in `Deck` is injectable via `type Rng = () => number` (a function returning values in `[0, 1)`), defaulting to `Math.random`. For deterministic simulations, Monte Carlo rollouts, and reproducible tests, use the exported `mulberry32(seed)` generator:

```ts
import { Deck, extractCards, mulberry32 } from "bitdeck";

const deckA = new Deck({ rng: mulberry32(12345) });
const deckB = new Deck({ rng: mulberry32(12345) });

const handA = deckA.dealCards(7);
const handB = deckB.dealCards(7);

console.log(handA === handB); // true
console.log(extractCards(handA).map((c) => c.code));
```

## Performance

`bitdeck` is designed for tight poker-evaluation and simulation loops:

- **Zero heap allocations** on hot paths (`popcount`, `rankMask`, `maskOr`, `Deck.dealCards`).
- **52-bit `number` masks outperform `bigint` across every benchmark**: `popcount` runs at **~41.1M ops/sec** (**2.00x faster** than `bigint`), `rankMask` runs at **~38.1M ops/sec** (**2.33x faster** than `bigint`), and `deck.reset(); deck.dealCards(7)` runs at **~17.6M ops/sec** (**1.39x faster** than `bigint`).

See [`BENCHMARKS.md`](./BENCHMARKS.md) for the full benchmark suite, methodology, and results table.

## Coming from `cardspy`

`bitdeck` uses the **exact same 52-bit card and 13-bit rank bit layouts** as Python's [`cardspy`](https://github.com/bhadresh-dahanuwala/cardspy), so integer bitmasks can be serialized and exchanged between Python and TypeScript without conversion. Whereas `cardspy` spreads names across submodules (`cardspy.card`, `cardspy.deck`, `cardspy.rank`, `cardspy.suit`), `bitdeck` exports everything from a single entry point (`"bitdeck"`).

### Name Mapping (`cardspy` → `bitdeck`)

Public functions and methods use `camelCase` in TypeScript, while constants and class names remain identical:

| `cardspy` (Python)                                                      | `bitdeck` (TypeScript)                                                  | Notes                                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Card`, `C2C` … `CAS`, `ALL_CARDS`                                      | `Card`, `C2C` … `CAS`, `ALL_CARDS`                                      | Frozen instances; adds `.index` (`0`–`51`)                                        |
| `Rank`, `R2` … `RA`, `NUM_RANKS`, `RANK_CODES`, `RANKS_DESC`            | `Rank`, `R2` … `RA`, `NUM_RANKS`, `RANK_CODES`, `RANKS_DESC`            | Frozen instances; adds `.index` (`0`–`12`)                                        |
| —                                                                       | `ALL_RANKS`                                                             | New: frozen ascending array `[R2, …, RA]`                                         |
| `Suit`, `CLUB`, `DIAMOND`, `HEART`, `SPADE`, `SUIT_SYMBOLS`             | `Suit`, `CLUB`, `DIAMOND`, `HEART`, `SPADE`, `SUIT_SYMBOLS`             | Frozen instances; adds `.index` (`0`–`3`)                                         |
| —                                                                       | `NUM_SUITS`, `SUIT_CODES`, `ALL_SUITS`                                  | New suit constants (`4`, `["C", "D", "H", "S"]`, `[CLUB, DIAMOND, HEART, SPADE]`) |
| `CLUBS`, `DIAMONDS`, `HEARTS`, `SPADES`, `SAME_RANKS`, `FULL_DECK_MASK` | `CLUBS`, `DIAMONDS`, `HEARTS`, `SPADES`, `SAME_RANKS`, `FULL_DECK_MASK` | Exported from `"bitdeck"`                                                         |
| `sort_cards(cards)`                                                     | `sortCards(cards)`                                                      | Ascending by rank, stable                                                         |
| `cards_mask(cards)`                                                     | `cardsMask(cards)`                                                      | Safe with duplicate cards                                                         |
| `rank_mask_from_cards(mask)`                                            | `rankMaskFromCards(mask)` / `rankMask(mask)`                            | Branchless SWAR bit-folding (no loop over the 52 cards)                           |
| `extract_cards(mask)`                                                   | `extractCards(mask)`                                                    | Ascending bit index order                                                         |
| `extract_cards_key(mask)`                                               | `extractCardsKey(mask)`                                                 | Ascending single-card keys                                                        |
| —                                                                       | `getCardByKey(key)`                                                     | New: `O(1)` lookup from single-card `CardMask`                                    |
| `get_card(code)`                                                        | `getCard(code)`                                                         | `O(1)` `Map` lookup                                                               |
| `get_card_key_from_code(code)`                                          | `getCardKeyFromCode(code)`                                              |                                                                                   |
| `get_cards(codes)`                                                      | `getCards(codes)`                                                       |                                                                                   |
| `get_card_keys_from_codes(codes)`                                       | `getCardKeysFromCodes(codes)`                                           |                                                                                   |
| `Deck()`                                                                | `new Deck(options?: DeckOptions)`                                       | Optional `{ rng, cards }`                                                         |
| `deck.key`                                                              | `deck.key`                                                              | Read-only getter                                                                  |
| `deck.count()`                                                          | `deck.count()`                                                          |                                                                                   |
| `deck.contains(cards)`                                                  | `deck.contains(cards)`                                                  | Checks all bits in `cards`                                                        |
| `deck.get_cards()`                                                      | `deck.getCards()`                                                       |                                                                                   |
| `deck.get_remaining_cards()`                                            | `deck.getRemainingCards()`                                              |                                                                                   |
| `deck.get_remaining_cards_key()`                                        | `deck.getRemainingCardsKey()`                                           |                                                                                   |
| `deck.clear()` / `deck.reset()`                                         | `deck.clear()` / `deck.reset()`                                         | `reset()` preserves `rng`                                                         |
| `deck.shuffle()`                                                        | `deck.shuffle()`                                                        | Shuffles remaining cards only                                                     |
| `deck.add_card(key)` / `deck.add_cards(mask)`                           | `deck.addCard(key)` / `deck.addCards(mask)`                             |                                                                                   |
| `deck.remove_card(key)` / `deck.remove_cards(mask)`                     | `deck.removeCard(key)` / `deck.removeCards(mask)`                       |                                                                                   |
| `deck.deal_cards(count=1, shuffle=True)`                                | `deck.dealCards(count = 1, shuffle = true)`                             | Partial Fisher–Yates when `shuffle = true`                                        |
| `deck.deal_specific_card(key)`                                          | `deck.dealSpecificCard(key)`                                            |                                                                                   |
| `deck.deal_specific_cards(mask)`                                        | `deck.dealSpecificCards(mask)`                                          | Atomic validation                                                                 |
| —                                                                       | `deck.clone()`                                                          | New: independent copy sharing `rng`                                               |

### Intentional Behavior Differences vs `cardspy`

1. **`deck.shuffle()` only shuffles remaining cards**: In `cardspy`, calling `shuffle()` after dealing puts the already-dealt cards back into the deal order while the mask still excludes them, so later deals can return cards that were already dealt. In `bitdeck`, `shuffle()` permutes only the cards currently remaining in the deck.
2. **No duplicate cards in `Deck`**: Calling `deck.addCard(key)` or `deck.addCards(mask)` with a card already present in the deck is a no-op rather than appending a duplicate entry to the deck's order array.
3. **`deck.removeCard` / `deck.removeCards` of an absent card is a no-op**: Removing a card that is not currently in the deck is a safe no-op (`cardspy`'s `remove_card` raised `ValueError` from `list.remove`).
4. **Atomic `deck.dealSpecificCards(mask)`**: `dealSpecificCards` verifies that every requested card is present in the deck before removing any card. If any card is missing, it throws a `RangeError("Card not in deck")` and leaves the deck untouched.
5. **Expanded `getCard(code)` input formats**: `cardspy` accepted only rank code + suit symbol (`"A♠"`, `"T♠"`, `"10♠"`); its own README's `'AS'` / `'10H'` examples actually raise `ValueError`. `bitdeck` accepts ASCII suit letters (`"AS"`, `"10S"`, `"TS"`), lowercase (`"as"`, `"10s"`, `"ts"`), and Unicode suit symbols (`"A♠"`, `"10♠"`, `"T♠"`).
6. **Input validation and error types**: Masks, keys, and counts are validated (`RangeError`), whereas `cardspy` accepted any `int`. Non-string card codes throw `TypeError` (instead of Python's `ValueError`).

## API Reference

Everything below is exported directly from `"bitdeck"`.

### Bit primitives

- `type CardMask = number` — 52-bit playing card bitmask (`0 <= m <= FULL_DECK_MASK`).
- `FULL_DECK_MASK` (`0xfffffffffffff`), `CLUBS` (`0x1111111111111`), `DIAMONDS` (`0x2222222222222`), `HEARTS` (`0x4444444444444`), `SPADES` (`0x8888888888888`), `SAME_RANKS` (frozen 13-element array `0xf * 16 ** r`).
- `isValidMask(m: unknown): m is CardMask` — `true` if `m` is an integer with `0 <= m <= FULL_DECK_MASK`.
- `isSingleCard(m: CardMask): boolean` — `true` if `m` is a valid mask with exactly one bit set.
- `maskAnd(a, b)`, `maskOr(a, b)`, `maskXor(a, b)`, `maskAndNot(a, b)` — 52-bit `a & b`, `a | b`, `a ^ b`, and `a & ~b`.
- `maskContains(set, subset): boolean` — `true` if every bit in `subset` is set in `set`.
- `maskIntersects(a, b): boolean` — `true` if `a` and `b` share at least one set bit.
- `popcount(m: CardMask): number` — number of set bits in `m` (`0`–`52`).
- `cardIndex(key: CardMask): number` — bit index (`0`–`51`) of the lowest set bit, or `-1` for `0`.
- `cardKey(index: number): CardMask` — single-card mask (`2 ** index`) for `0 <= index < 52`, or `0` out of range.
- `lowestCardKey(m: CardMask): CardMask` — lowest set bit as a single-card mask, or `0` for `0`.
- `forEachCardIndex(m: CardMask, fn: (index: number) => void): void` — calls `fn(index)` for each set bit in ascending order.
- `rankMask(m: CardMask): number` — 13-bit mask of ranks present in `m` (`0`–`0x1fff`).

### Random

- `type Rng = () => number` — function returning a number in `[0, 1)`.
- `mulberry32(seed: number): Rng` — seeded 32-bit PRNG returning values in `[0, 1)`.

### Ranks

- `class Rank { readonly key: number; readonly code: string; readonly name: string; readonly index: number; toString(): string; toJSON(): string }`
- Constants: `R2`, `R3`, `R4`, `R5`, `R6`, `R7`, `R8`, `R9`, `RT`, `RJ`, `RQ`, `RK`, `RA`, `NUM_RANKS = 13`, `RANK_CODES`, `ALL_RANKS`, `RANKS_DESC`.

### Suits

- `class Suit { readonly key: number; readonly code: string; readonly name: string; readonly symbol: string; readonly index: number; toString(): string; toJSON(): string }`
- Constants: `CLUB`, `DIAMOND`, `HEART`, `SPADE`, `NUM_SUITS = 4`, `SUIT_SYMBOLS`, `SUIT_CODES`, `ALL_SUITS`.

### Cards

- `class Card { readonly key: CardMask; readonly rank: Rank; readonly suit: Suit; readonly code: string; readonly name: string; readonly symbol: string; readonly index: number; toString(): string; toJSON(): string }`
- Constants: `C2C` … `CAS` (all 52 cards), `ALL_CARDS` (frozen, index order).
- `sortCards(cards: readonly Card[]): Card[]`
- `cardsMask(cards: readonly Card[]): CardMask`
- `rankMaskFromCards(mask: CardMask): number`
- `extractCards(mask: CardMask): Card[]`
- `extractCardsKey(mask: CardMask): CardMask[]`
- `getCardByKey(key: CardMask): Card`
- `getCard(code: string): Card`
- `getCardKeyFromCode(code: string): CardMask`
- `getCards(codes: readonly string[]): Card[]`
- `getCardKeysFromCodes(codes: readonly string[]): CardMask`

### Deck

- `interface DeckOptions { rng?: Rng; cards?: CardMask }`
- `class Deck`
  - `constructor(options?: DeckOptions)`
  - `get key(): CardMask`
  - `count(): number`
  - `contains(cards: CardMask): boolean`
  - `getCards(): Card[]` / `getRemainingCards(): Card[]`
  - `getRemainingCardsKey(): CardMask`
  - `clear(): void` / `reset(): void` / `shuffle(): void`
  - `addCard(key: CardMask): void` / `addCards(cards: CardMask): void`
  - `removeCard(key: CardMask): void` / `removeCards(cards: CardMask): void`
  - `dealCards(count?: number, shuffle?: boolean): CardMask`
  - `dealSpecificCard(key: CardMask): CardMask`
  - `dealSpecificCards(cards: CardMask): CardMask`
  - `clone(): Deck`

## License

[MIT](./LICENSE)
