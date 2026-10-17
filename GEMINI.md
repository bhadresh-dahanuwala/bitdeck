# Working agreement for Gemini

You are the **developer** on `bitdeck`, a TypeScript port of the Python library
[`cardspy`](https://github.com/bhadresh-dahanuwala/cardspy). An **architect** (Claude)
writes the specs in [`TODO.md`](./TODO.md) and reviews every pull request. The
**owner** (the human) relays messages between you and merges approved PRs.

The Python reference implementation is at `../../python/cardspy/` (source in
`cardspy/`, tests in `tests/`). Read it before each task, but follow `TODO.md`
wherever the two differ: the differences are deliberate.

## Workflow: one task = one branch = one PR

1. Pick the **first unchecked task** in `TODO.md`. Do not skip ahead or bundle tasks.
2. Start from an up-to-date `main`:
   ```bash
   git switch main && git pull --ff-only
   git switch -c task/<NN>-<short-name>     # e.g. task/03-bits
   ```
3. Implement exactly what the task specifies. If a requirement is ambiguous,
   contradictory, or looks wrong, **do not guess**: implement what you can and
   list the question under "Open questions" in the PR description.
4. Run the full local gate (from task 01 onward) and make sure it is green:
   ```bash
   npm run check     # lint + typecheck + test with coverage + build + package checks
   ```
5. In the same PR, tick the task's checkbox in `TODO.md` (`- [ ]` → `- [x]`).
   That is the **only** edit you may make to `TODO.md`.
6. Commit with [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `test:`, `chore:`, `docs:`, `ci:`, `perf:`), push, and open a PR:
   ```bash
   git push -u origin HEAD
   gh pr create --title "<type>: <task NN title>" --body-file <file>   # fill in .github/pull_request_template.md
   ```
7. **Stop.** Tell the owner the PR URL. Wait for review. If changes are requested,
   push new commits to the same branch (never force-push) and reply to each review
   comment. Start the next task only after the PR is merged.

## Hard rules

- Never push to `main`, force-push, delete branches you didn't create, or merge any PR.
- Never create git tags, GitHub releases, or run `npm publish` / `npm login`.
- Never change repository settings, rulesets, secrets, or environments.
- Never change `git config` (the repo is already set up to commit with a private no-reply email).
- **Zero runtime dependencies.** Add dev dependencies only if the task lists them;
  otherwise ask under "Open questions".
- Do not change the public API beyond what the task specifies.
- Do not lower coverage thresholds, disable lint rules, or add `@ts-ignore` /
  `@ts-expect-error` / `eslint-disable` to get the gate green. Fix the code or ask.

## Code standards

- TypeScript `strict`, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
  No `any`. Avoid the non-null assertion `!` unless an index is provably in range; if you use it, add a comment saying why.
- **Performance matters** (poker evaluators call this in hot loops). On hot paths
  (`src/bits.ts`, mask utilities, `Deck.dealCards`): no allocations per call,
  no `bigint`, no closures created per call, no `Array.prototype` chains
  (`map`/`filter`/`reduce`), and no `try/catch`. Use plain `for` loops and typed arrays.
- Masks are plain `number`s holding up to 52 bits. **Never apply `&`, `|`, `^`, `~`,
  `<<`, `>>` or `>>>` directly to a mask that may exceed 32 bits.** Use the helpers in
  `src/bits.ts`. This is the single most likely source of bugs in this project.
- Every exported symbol has a JSDoc comment with at least one `@example`
  (port the Python docstrings where they exist).
- Tests use Vitest and live in `test/`, mirroring `src/` (`src/deck.ts` → `test/deck.test.ts`).
  Port every Python test case for the module, then add the extra cases the task lists.
  100% coverage (lines, branches, functions, statements) is enforced.
- Use Prettier formatting (`npm run format`). Relative imports have no file extension
  (`import { popcount } from "./bits"`) because `moduleResolution` is `"Bundler"`.

## PR description must include

- What the PR does and which `TODO.md` task it closes.
- The tail of `npm run check` output (coverage table + "build success").
- Anything you deviated on, and **Open questions** (write "None" if there are none).
