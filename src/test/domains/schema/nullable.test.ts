import { describe, expect, test } from "vitest";
import { s } from "../../../index.js";

describe("nullable()", () => {
  test("accepts null", () => {
    const schema = s.nullable(s.string());

    expect(schema.parse(null)).toEqual({
      ok: true,
      value: null,
    });
  });

  test("accepts a valid inner value", () => {
    const schema = s.nullable(s.string());

    expect(schema.parse("Trent")).toEqual({
      ok: true,
      value: "Trent",
    });
  });

  test("rejects invalid non-null values using the inner schema", () => {
    const schema = s.nullable(s.string());

    expect(schema.parse(42)).toEqual({
      ok: false,
      issues: [
        {
          path: [],
          code: "invalid_type",
          expected: "string",
          received: "number",
          message: "Expected type: string, received type: number",
        },
      ],
    });
  });

  test('emits anyOf with the inner schema and { type: "null" }', () => {
    const schema = s.nullable(s.string());

    expect(schema.toJSONSchema()).toEqual({
      anyOf: [{ type: "string" }, { type: "null" }],
    });
  });
});
