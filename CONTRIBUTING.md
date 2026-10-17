# Contributing to bitdeck

## Prerequisites

- **Node.js ≥ 20** (development and CI use Node.js 24, specified in `.nvmrc`).
- **npm** (included with Node.js).

## Setup

Install dependencies from `package-lock.json`:

```bash
npm ci
```

## Running the Verification Gate

Before opening a pull request, format your changes and run the full verification gate:

```bash
npm run format
npm run check
```

`npm run check` runs the following checks in sequence, all of which must pass in CI:

1. `npm run format:check` — Prettier formatting check.
2. `npm run build` — `tsdown` ESM + CJS + `.d.ts`/`.d.cts` build into `dist/`.
3. `npm run lint` — ESLint (`strictTypeChecked` + `stylisticTypeChecked`).
4. `npm run typecheck` — `tsc --noEmit`.
5. `npm run coverage` — Vitest test suite with 100% line, branch, function, and statement coverage enforced.
6. `npm run check:package` — `publint` and `attw --pack .` package and type-resolution validation.

## Additional Scripts

- `npm test` — Run the unit test suite once.
- `npm run test:watch` — Run Vitest in watch mode.
- `npm run bench` — Build `dist/` and run the Vitest benchmark suite in `bench/`.
