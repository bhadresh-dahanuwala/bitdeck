# bitdeck — task list

Read [`GEMINI.md`](./GEMINI.md) first. Do the tasks **in order, one PR each**.
Python reference: `../../python/cardspy/`.

---

## Architecture decisions (read before every task)

| # | Decision | Why |
|---|---|---|
| A1 | A card set is a **`CardMask` = plain `number`** holding up to 52 bits. | `bigint` is far slower than numbers; poker evaluation is a hot loop. A float64 holds integers exactly up to 2^53, so 52 bits fit. |
| A2 | JS bitwise operators truncate to 32 bits, so **all mask operations go through `src/bits.ts`**, which splits a mask into `lo = m >>> 0` (bits 0–31) and `hi = (m / 2**32) >>> 0` (bits 32–51) and recombines with `hi * 2**32 + lo`. | Using `&`/`|` on a mask directly gives silently wrong results for cards above the 5s. |
| A3 | **Same bit layout as `cardspy`**: card index `i = rankIndex * 4 + suitIndex`, `key = 2**i`. Ranks 2…A → 0…12, suits C, D, H, S → 0…3. So `2♣ = 0x1`, `2♦ = 0x2`, `3♣ = 0x10`, `A♠ = 2**51`. | Masks can be exchanged with the Python library unchanged. |
| A4 | Public names are the **camelCase versions of the `cardspy` names** (`deal_cards` → `dealCards`, `C2C`, `RA`, `CLUB` unchanged). | Easy port for existing users. |
| A5 | **Zero runtime dependencies.** ESM + CJS builds with types. Node ≥ 20. No Node-only APIs in `src/`, so it also runs in browsers. | Small, portable package. |
| A6 | Randomness is injectable: `type Rng = () => number` (returns `[0, 1)`), default `Math.random`. A seeded `mulberry32(seed)` is exported. | Reproducible simulations and tests. |
| A7 | Behaviour fixes vs `cardspy` (on purpose): `shuffle()` shuffles **only the remaining cards** (in Python it puts already-dealt cards back into the shuffle order); adding a card that is already present is a no-op (no duplicates); `dealSpecificCards` is atomic; `getCard` accepts `"AS"`, `"A♠"`, `"as"` and `"10S"`. | Python bugs / usability. |
| A8 | Errors: invalid arguments throw `RangeError` (wrong value) or `TypeError` (wrong type). Hot-path helpers in `bits.ts` do **not** validate; `Deck` methods and code lookups do. | Validation at the API boundary, speed inside. |

---

## Tasks

### - [x] 01 — Project scaffold

Branch `task/01-scaffold`. Create the tooling only; no library code yet.

**Dev dependencies** (latest stable versions, commit `package-lock.json`, use `npm`):
`typescript`, `tsdown`, `vitest`, `@vitest/coverage-v8`, `eslint`, `@eslint/js`,
`typescript-eslint`, `prettier`, `eslint-config-prettier`, `publint`, `@arethetypeswrong/cli`.

**`package.json`**
- `name: "bitdeck"`, `version: "0.1.0"`, `license: "MIT"`, `type: "module"`, `sideEffects: false`
- `description: "Fast bitmask-based playing cards, decks, suits and ranks for TypeScript — built for poker-scale evaluation."`
- `author: "bhadresh-dahanuwala <bd.noads@gmail.com>"` ← use **exactly** this email
- `repository` (`git+https://github.com/bhadresh-dahanuwala/bitdeck.git`), `homepage`, `bugs`
- `keywords`: playing-cards, cards, deck, poker, bitmask, card-game, typescript
- `engines: { "node": ">=20" }`, `files: ["dist"]`
- `exports` with `import`/`require` conditions, each with its own `types`
  (`.d.ts` for ESM, `.d.cts` for CJS), plus `"./package.json"`. Also `main`, `module`, `types`.
  Paths must match what `tsdown` actually emits.
- scripts:
  `build` (tsdown), `test` (`vitest run`), `test:watch`, `coverage` (`vitest run --coverage`),
  `bench` (`vitest bench --run`), `lint` (`eslint .`), `typecheck` (`tsc --noEmit`),
  `format` / `format:check` (prettier), `check:package` (`publint && attw --pack .`),
  `check` = format:check → lint → typecheck → coverage → build → check:package,
  `prepublishOnly` = `npm run check`.

**Config files**
- `tsconfig.json`: `target`/`lib` `ES2022` (no DOM), `module: ESNext`, `moduleResolution: Bundler`,
  `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`,
  `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `isolatedModules`. Includes `src`, `test`, `bench`, config files.
- `tsdown.config.ts`: entry `src/index.ts`, formats `esm` + `cjs`, `dts: true`, clean `dist/`.
- `vitest.config.ts`: v8 coverage over `src/**`, **thresholds 100** for lines/branches/functions/statements.
- `eslint.config.js` (flat): `@eslint/js` recommended + `typescript-eslint` `strictTypeChecked` + `stylisticTypeChecked` + `eslint-config-prettier`; ignore `dist`, `coverage`.
- `.prettierrc.json` (`printWidth: 100`, defaults otherwise), `.prettierignore`, `.editorconfig`, `.nvmrc` (`24`).
- `.gitignore`: make sure `dist/` and `coverage/` are ignored.
- `src/index.ts` exports nothing yet (`export {};`), plus `test/smoke.test.ts` with one trivial test so the gate runs.

**Done when:** `npm run check` passes on a clean clone (`rm -rf node_modules dist && npm ci && npm run check`).
If `tsdown` can't get `attw` fully green, switch to `tsup` and explain why in the PR.

---

### - [x] 02 — CI and Dependabot

Branch `task/02-ci`.

- `.github/workflows/ci.yml`, triggered on `pull_request` and `push` to `main`:
  - top-level `permissions: contents: read`; `concurrency` cancels superseded runs per ref.
  - job **`check`** (job id and name exactly `check`): ubuntu-latest, Node from `.nvmrc`, `npm ci`, `npm run check`.
  - job **`test`**: matrix Node `20`, `22`, `24`: `npm ci`, `npm test`.
  - Use `actions/checkout` and `actions/setup-node` (latest major tags) with npm caching.
- `.github/dependabot.yml`: weekly updates for `npm` (group all dev dependencies into one PR) and `github-actions`.

**Done when:** the PR's own CI run is green (paste the run link in the PR).

---

### - [x] 03 — Bit primitives (`src/bits.ts`, `src/random.ts`)

Branch `task/03-bits`. The most important task: everything else builds on it.

`src/bits.ts` exports:

| Export | Spec |
|---|---|
| `type CardMask = number` | |
| `FULL_DECK_MASK` | `2 ** 52 - 1` |
| `CLUBS`, `DIAMONDS`, `HEARTS`, `SPADES` | `0x1111111111111`, `0x2222222222222`, `0x4444444444444`, `0x8888888888888` (from `deck.py`) |
| `SAME_RANKS: readonly CardMask[]` | 13 masks `0xF * 16 ** r` for r = 0…12 (from `deck.py`) |
| `isValidMask(m: unknown): m is CardMask` | integer, `0 ≤ m ≤ FULL_DECK_MASK` |
| `isSingleCard(m: CardMask): boolean` | exactly one bit set |
| `maskAnd(a, b)`, `maskOr(a, b)`, `maskXor(a, b)`, `maskAndNot(a, b)` | `a & b`, `a \| b`, `a ^ b`, `a & ~b`, all 52-bit correct |
| `maskContains(set, subset): boolean` | every bit of `subset` is in `set` |
| `maskIntersects(a, b): boolean` | any common bit |
| `popcount(m): number` | SWAR popcount on `lo` and `hi` (no loops over bits, no lookup by string) |
| `cardIndex(key): number` | index 0–51 of the lowest set bit (use `Math.clz32` on `x & -x`); `-1` for `0` |
| `cardKey(index): CardMask` | `2 ** index` via a precomputed 52-entry table |
| `lowestCardKey(m): CardMask` | the lowest set bit as a mask; `0` for `0` |
| `forEachCardIndex(m, fn: (index: number) => void): void` | ascending order, visits only set bits (loop `lo` then `hi`, clearing the lowest bit each step) |
| `rankMask(m): number` | 13-bit mask of ranks present (bit r = rank r). Port of `rank_mask_from_cards`, but **no loop over 52 cards**. Algorithm for each 32-bit half `v`: `v = (v \| v >>> 1 \| v >>> 2 \| v >>> 3) & 0x11111111; v = (v \| v >>> 3) & 0x03030303; v = (v \| v >>> 6) & 0x000F000F; v = (v \| v >>> 12) & 0xFF;` then `result = lo' \| (hi' << 8)` |

`src/random.ts` exports `type Rng = () => number` and `mulberry32(seed: number): Rng` (standard mulberry32, output in `[0, 1)`).

Re-export everything from `src/index.ts`.

**Tests (`test/bits.test.ts`, `test/random.test.ts`):**
- Hand-written cases at the edges: `0`, `FULL_DECK_MASK`, bit 0, bit 31, **bit 32**, bit 51, masks with bits on both sides of 32.
- **Cross-check against a `bigint` reference** (written only in the test file): generate 10,000 random 52-bit masks with `mulberry32(42)` (`hi = floor(r() * 2**20)`, `lo = floor(r() * 2**32)`), and check every operation above matches the `bigint` version.
- `rankMask` checked against a slow reference that loops over all 52 bits.
- `mulberry32`: same seed gives the same sequence; values in `[0, 1)`.

---

### - [x] 04 — `Rank` and `Suit` (`src/rank.ts`, `src/suit.ts`)

Branch `task/04-rank-suit`. Port `rank.py` and `suit.py`.

- `class Rank { readonly key; readonly code; readonly name; readonly index }`,
  constructor `(key, code, name)` (same as Python); `index` is computed from `key`.
  `toString()` and `toJSON()` return `code`.
- `class Suit { readonly key; readonly code; readonly name; readonly symbol; readonly index }`,
  constructor `(key, code, name, symbol)`. `toString()` returns `symbol`; `toJSON()` returns `code`.
- Constants (instances made with `Object.freeze`): `R2 … R9, RT, RJ, RQ, RK, RA` (keys `0x1 … 0x1000`),
  `NUM_RANKS = 13`, `RANK_CODES` (same order as Python), `ALL_RANKS` (ascending), `RANKS_DESC` (from `deck.py`);
  `CLUB, DIAMOND, HEART, SPADE` (keys `0x1, 0x2, 0x4, 0x8`), `NUM_SUITS = 4`,
  `SUIT_SYMBOLS` (same order as Python: `♠ ♥ ♦ ♣`), `SUIT_CODES = ["C","D","H","S"]`, `ALL_SUITS` (C, D, H, S).
- All exported arrays are `readonly` and frozen.

**Tests:** port `test_rank.py` / `test_suit.py`; plus `index`, `toString`, `JSON.stringify`, and that constants are frozen.

---

### - [x] 05 — `Card` and card utilities (`src/card.ts`)

Branch `task/05-card`. Port `card.py`.

- `class Card { readonly key; readonly rank; readonly suit; readonly code; readonly name; readonly symbol; readonly index }`,
  constructor `(key, rank, suit, code, name, symbol)`; `index = cardIndex(key)`.
  `toString()` returns `symbol`; `toJSON()` returns `code`.
- The 52 frozen constants `C2C … CAS` with the same keys, codes, names and symbols as Python.
- `ALL_CARDS`: frozen, index order, so `ALL_CARDS[i].key === 2 ** i`.
- Functions:

| Function | Spec |
|---|---|
| `sortCards(cards: readonly Card[]): Card[]` | new array, ascending by rank, stable for equal ranks (same as Python) |
| `cardsMask(cards: readonly Card[]): CardMask` | union of keys (use `maskOr`, so duplicates are harmless) |
| `rankMaskFromCards(mask): number` | same as `rankMask` |
| `extractCards(mask): Card[]` | cards in ascending index order, using `forEachCardIndex` |
| `extractCardsKey(mask): CardMask[]` | single-card keys, ascending |
| `getCardByKey(key): Card` | **new.** `RangeError("Invalid card key: <key>")` unless `key` is valid and a single card |
| `getCard(code: string): Card` | O(1) lookup via a `Map` built once. Accepts rank `2–9, T, J, Q, K, A` (any case) or `10`, then suit `C D H S` (any case) or `♣ ♦ ♥ ♠`. Errors: `TypeError` if not a string; `RangeError("Invalid card code: <code>")` for wrong length; `RangeError("Invalid rank code: <r>")`; `RangeError("Invalid suit: <s>")` |
| `getCardKeyFromCode(code)`, `getCards(codes)`, `getCardKeysFromCodes(codes)` | same as Python, built on `getCard` |

**Tests:** port **every** case from `test_card.py` (the symbol codes such as `"A♠"`), plus: every card through `"AS"`, `"as"`, `"A♠"`; `"10H"`/`"TH"`; every error path; `ALL_CARDS[i].key === 2 ** i` for all 52; `extractCards(cardsMask(x))` round-trips; masks using cards above bit 32.

---

### - [x] 06 — `Deck` (`src/deck.ts`)

Branch `task/06-deck`. Port `deck.py`, with the fixes from A7.

```ts
interface DeckOptions { rng?: Rng; cards?: CardMask }   // defaults: Math.random, FULL_DECK_MASK
class Deck {
  constructor(options?: DeckOptions)
  get key(): CardMask                 // read-only (Python's public `key`)
  count(): number                     // popcount
  contains(cards: CardMask): boolean  // all given cards are in the deck
  getCards(): Card[]                  // ascending index order
  getRemainingCards(): Card[]         // same as getCards (kept for parity)
  getRemainingCardsKey(): CardMask
  clear(): void
  reset(): void                       // full 52 cards, index order; keeps rng
  shuffle(): void                     // random order of the REMAINING cards only
  addCard(key: CardMask): void        // must be a single card; no-op if present; goes to the end of the order
  addCards(cards: CardMask): void     // adds missing cards in ascending index order
  removeCard(key: CardMask): void     // must be a single card; no-op if absent; keeps the order of the rest
  removeCards(cards: CardMask): void
  dealCards(count?: number, shuffle?: boolean): CardMask   // defaults 1, true
  dealSpecificCard(key: CardMask): CardMask
  dealSpecificCards(cards: CardMask): CardMask
  clone(): Deck                       // independent copy (same rng function)
}
```

Implementation requirements:
- Store the order in a `Uint8Array(52)` of card indices plus bookkeeping; keep `key` in sync.
  Do not allocate per `dealCards` call.
- `dealCards(n, true)`: a **partial Fisher–Yates**: exactly `n` calls to `rng`, a uniformly random
  `n`-card subset, `O(n)`. It may reorder the remaining cards (Python reshuffles them anyway).
- `dealCards(n, false)`: the first `n` cards of the current order (a fresh deck deals `2♣, 2♦, 2♥, …`, same as Python).
- Validation: invalid masks/keys → `RangeError("Invalid card mask: <m>")` / `RangeError("Invalid card key: <k>")`;
  `count` not a non-negative integer → `RangeError("Cannot draw a negative number of cards")` (negative) or
  `RangeError("Invalid card count: <n>")` (non-integer); too many → `RangeError("Only <r> cards remaining; cannot draw <n>")`;
  `dealSpecificCard` of an absent card → `RangeError("Card not in deck")`.
- `dealSpecificCards` checks **all** cards first and changes nothing if one is missing.

**Tests:** port every case from `test_deck.py`, plus:
- **Regression for the Python shuffle bug:** deal 10, `shuffle()`, deal 42 → no overlap with the first 10, union is `FULL_DECK_MASK`, `count() === 0`.
- Seeded determinism: two decks with `mulberry32(7)` deal identical sequences.
- Fairness sanity: with `mulberry32(1)`, deal 1 card from a fresh deck 52,000 times; every card appears 800–1,200 times.
- `addCard` twice → `count()` goes up by 1 only; `options.cards`; `clone()` independence; atomic `dealSpecificCards`; every error path; cards above bit 32.

---

### - [x] 07 — Public API and package checks

Branch `task/07-api`.
- `src/index.ts` re-exports the full public API (values and types) from tasks 03–06, nothing internal.
- `test/exports.test.ts`: a sorted list of `Object.keys(await import("../src/index"))` compared to an inline
  snapshot, so accidental API changes fail CI.
- `npm run check:package` is fully green (publint and attw report no problems for ESM, CJS, or the bundler/node16 resolution modes).
- Add a CI step in the `check` job, after build: `node -e "require('./dist/index.cjs')"`-style smoke test that
  loads both the CJS and ESM builds and deals 5 cards (adjust paths to the real output).

---

### - [x] 08 — Benchmarks

Branch `task/08-bench`. Vitest bench files in `bench/` (excluded from coverage and from the npm package).
- Benchmarks: `popcount`, `rankMask`, `maskOr`, `extractCards` (7 cards), `cardsMask` (7 cards), `getCard`,
  `deck.reset(); deck.dealCards(2)`, `deck.reset(); deck.dealCards(7)`, `deck.clone()`.
- `bench/bigint-reference.ts`: `bigint` versions of `popcount`, `rankMask`, and a 7-card deal, benchmarked side by side,
  to back up decision A1.
- `BENCHMARKS.md`: results table, machine, OS, and Node version, plus a one-paragraph summary.
  If any `number` version is **not** faster than its `bigint` version, say so clearly in the PR.

---

### - [x] 09 — Documentation

Branch `task/09-docs`.
- `README.md`: badges (npm version, CI, license), what it is, install, TypeScript quick start, detailed examples
  (port the `cardspy` README sections), API reference, a **"Working with masks"** section (masks are numbers; never use
  `&`/`|` on them directly; use the helpers), seeded RNG, performance (link `BENCHMARKS.md`),
  **"Coming from cardspy"** (name-mapping table + the A7 behaviour differences), license.
- `test/readme.test.ts`: runs the Quick Start example from the README so the README can't go out of date.
- `CHANGELOG.md` (Keep a Changelog format, `## [0.1.0] - Unreleased`), `SECURITY.md` (report privately via GitHub's
  "Report a vulnerability" button on the Security tab), short `CONTRIBUTING.md` (how to run `npm run check`).

---

### - [ ] 10 — Release workflow

Branch `task/10-release`. Write the workflow; **do not run it, tag, or publish.**
- `.github/workflows/release.yml`, triggered by `push` of tags `v*`:
  - job `publish` with `environment: npm` (it already exists and requires the owner's approval),
    `permissions: contents: write, id-token: write`.
  - steps: checkout; setup-node (Node from `.nvmrc`, `registry-url: https://registry.npmjs.org`);
    `npm install -g npm@latest` (trusted publishing needs npm ≥ 11.5.1); `npm ci`; `npm run check`;
    fail if the tag (minus `v`) ≠ `package.json` version; `npm publish --access public`
    (**no `NPM_TOKEN`**: trusted publishing via OIDC, which also adds provenance automatically);
    `gh release create "$TAG" --generate-notes --verify-tag`.
- Document the release steps in `CONTRIBUTING.md` (bump version + changelog via PR → merge → owner pushes the tag → owner approves the `npm` environment).

---

## Owner checklist (not for Gemini)

- [x] After task 02 merges: architect adds `check` and `test (20|22|24)` as required status checks on `main`.
- [x] Before task 10: create the npm account (`bdnoads`, 2FA on for auth and writes).
- [ ] First publish of `0.1.0` + trusted-publisher setup on npmjs.com (architect will guide).
