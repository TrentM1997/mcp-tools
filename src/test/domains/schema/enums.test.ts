import { describe, expect, test } from "vitest";
import { s } from "../../../index.js";

describe("enum()", () => {
  test("accepts allowed string enum values", () => {
    const schema = s.enum(["open", "closed"]);

    expect(schema.parse("open")).toEqual({
      ok: true,
      value: "open",
    });

    expect(schema.parse("closed")).toEqual({
      ok: true,
      value: "closed",
    });
  });

  test("rejects disallowed values with invalid_enum", () => {
    const schema = s.enum(["open", "closed"]);

    expect(schema.parse("draft")).toEqual({
      ok: false,
      issues: [
        {
          path: [],
          code: "invalid_enum",
          expected: ["open", "closed"],
          received: "draft",
          message:
            "Expected one of the following enumerations: open, closed, received: draft",
        },
      ],
    });
  });

  test("accepts allowed number and boolean enum values", () => {
    const schema = s.enum([1, true, false]);

    expect(schema.parse(1)).toEqual({
      ok: true,
      value: 1,
    });

    expect(schema.parse(true)).toEqual({
      ok: true,
      value: true,
    });

    expect(schema.parse(false)).toEqual({
      ok: true,
      value: false,
    });
  });

  test("emits enum JSON Schema", () => {
    const schema = s.enum(["open", "closed", "draft"]);

    expect(schema.toJSONSchema()).toEqual({
      enum: ["open", "closed", "draft"],
    });
  });

  test("supports mixed literal enum values", () => {
    const schema = s.enum(["open", 1, true]);

    expect(schema.parse("open")).toEqual({
      ok: true,
      value: "open",
    });

    expect(schema.parse(1)).toEqual({
      ok: true,
      value: 1,
    });

    expect(schema.parse(true)).toEqual({
      ok: true,
      value: true,
    });
  });
});
