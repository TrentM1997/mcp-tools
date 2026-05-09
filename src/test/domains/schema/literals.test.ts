import { describe, expect, test } from "vitest";
import { s } from "../../../index.js";

describe("literal()", () => {
  test("reports the received literal value on mismatch", () => {
    const schema = s.literal("TypeScript");
    const result = schema.parse("Java");

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          path: [],
          code: "invalid_literal",
          expected: "TypeScript",
          received: "Java",
          message: "Expected literal: TypeScript, received: Java",
        },
      ],
    });
  });
});
