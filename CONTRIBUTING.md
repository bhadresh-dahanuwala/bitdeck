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

## Release Process

Releases are published via GitHub Actions using npm OIDC trusted publishing (no long-lived `NPM_TOKEN` secret):

1. **Bump version and changelog via PR**: Open a pull request that updates `"version"` in `package.json` (and `package-lock.json` via `npm install --package-lock-only`) and updates `CHANGELOG.md` for the new version.
2. **Merge the PR**: Ensure CI passes and merge the version-bump pull request into `main`.
3. **Push the version tag**: From the merged `main` commit, the repository owner tags the release (`v<version>`, e.g., `git tag v0.1.0 && git push origin v0.1.0`).
4. **Approve the `npm` environment**: Pushing a `v*` tag triggers `.github/workflows/release.yml`. First, the read-only `build` job verifies that the tag is on `main` and matches `package.json`, runs `npm ci` and `npm run check`, and packs the tarball (`npm pack`). After the owner approves the `npm` GitHub environment, the `publish` job publishes the tarball that `build` already checked via OIDC trusted publishing (with automatic provenance); then `github-release` creates the GitHub Release.
