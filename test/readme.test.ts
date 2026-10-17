import { afterAll, describe, expect, it, vi } from "vitest";

interface NodeFs {
  readFileSync(path: string, encoding: "utf8"): string;
  mkdirSync(path: string, options: { recursive: boolean }): void;
  writeFileSync(path: string, data: string, encoding: "utf8"): void;
  rmSync(path: string, options: { recursive: boolean; force: boolean }): void;
}

interface GlobalConsole {
  log: (...args: unknown[]) => void;
}

const importModule = (specifier: string): Promise<unknown> => import(specifier);

type ParsedLiteral = { matched: true; value: number | boolean | string } | { matched: false };

function parseExpectedLiteral(comment: string | undefined): ParsedLiteral {
  if (comment === undefined) {
    return { matched: false };
  }
  const trimmed = comment.trim();

  const numMatch = /^(0x[0-9a-fA-F]+|0b[01]+|-?\d+)(?:\s+\(.*\))?$/.exec(trimmed);
  if (numMatch?.[1] !== undefined) {
    return { matched: true, value: Number(numMatch[1]) };
  }

  if (trimmed === "true" || trimmed === "false") {
    return { matched: true, value: trimmed === "true" };
  }

  const dqMatch = /^"([^"]*)"$/.exec(trimmed);
  if (dqMatch?.[1] !== undefined) {
    return { matched: true, value: dqMatch[1] };
  }

  const sqMatch = /^'([^']*)'$/.exec(trimmed);
  if (sqMatch?.[1] !== undefined) {
    return { matched: true, value: sqMatch[1] };
  }

  return { matched: false };
}

describe("README.md fenced TypeScript blocks", () => {
  const blocksDir = "test/.readme-blocks";

  afterAll(async () => {
    const fs = (await importModule("node:fs")) as NodeFs;
    fs.rmSync(blocksDir, { recursive: true, force: true });
  });

  it("executes every ```ts code block in README.md and verifies logged literal comments", async () => {
    const fs = (await importModule("node:fs")) as NodeFs;
    const readme = fs.readFileSync("README.md", "utf8");

    const blockRegex = /```ts\r?\n([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(readme)) !== null) {
      if (match[1] !== undefined) {
        blocks.push(match[1]);
      }
    }

    expect(blocks.length).toBeGreaterThan(0);
    fs.mkdirSync(blocksDir, { recursive: true });

    const globalConsole = (globalThis as unknown as { console: GlobalConsole }).console;
    let verifiedLiteralCount = 0;

    for (let i = 0; i < blocks.length; i++) {
      const originalBlock = blocks[i];
      if (originalBlock === undefined) continue;

      const rewrittenBlock = originalBlock.replaceAll('from "bitdeck"', 'from "../../src/index"');
      const blockFile = `${blocksDir}/block-${String(i)}.ts`;
      fs.writeFileSync(blockFile, rewrittenBlock, "utf8");

      const expectedLiterals: ParsedLiteral[] = [];
      for (const line of originalBlock.split(/\r?\n/)) {
        const logMatch = /^\s*console\.log\(.+\);(?:\s*\/\/\s*(.+))?$/.exec(line);
        if (logMatch !== null) {
          expectedLiterals.push(parseExpectedLiteral(logMatch[1]));
        }
      }

      const loggedCalls: unknown[][] = [];
      const logSpy = vi.spyOn(globalConsole, "log").mockImplementation((...args: unknown[]) => {
        loggedCalls.push(args);
      });

      try {
        await importModule(`./.readme-blocks/block-${String(i)}.ts`);
      } finally {
        logSpy.mockRestore();
      }

      expect(loggedCalls).toHaveLength(expectedLiterals.length);

      for (let callIdx = 0; callIdx < expectedLiterals.length; callIdx++) {
        const expected = expectedLiterals[callIdx];
        if (expected?.matched === true) {
          expect(loggedCalls[callIdx]).toEqual([expected.value]);
          verifiedLiteralCount++;
        }
      }
    }

    expect(verifiedLiteralCount).toBeGreaterThanOrEqual(45);
  });
});
