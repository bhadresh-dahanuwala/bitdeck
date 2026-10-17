import { describe, expect, it } from "vitest";
import * as api from "../src/index";

describe("smoke", () => {
  it("loads the module", () => {
    expect(api).toBeDefined();
  });
});
