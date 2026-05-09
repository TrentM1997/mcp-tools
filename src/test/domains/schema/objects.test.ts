import { describe, expect, test } from "vitest";
import { s } from "../../../index.js";

describe("object()", () => {
  test("uses the current default object behavior for declared properties", () => {
    const schema = s.object({
      id: s.string(),
      verbose: s.optional(s.boolean()),
    });

    expect(
      schema.parse({
        id: "user_123",
      }),
    ).toEqual({
      ok: true,
      value: {
        id: "user_123",
      },
    });
  });

  test('supports unknownKeys: "ignore"', () => {
    const schema = s.object(
      {
        id: s.string(),
      },
      { unknownKeys: "ignore" },
    );

    expect(
      schema.parse({
        id: "user_123",
        extra: true,
      }),
    ).toEqual({
      ok: true,
      value: {
        id: "user_123",
      },
    });
  });

  test('supports unknownKeys: "strict"', () => {
    const schema = s.object(
      {
        id: s.string(),
      },
      { unknownKeys: "strict" },
    );

    expect(
      schema.parse({
        id: "user_123",
        extra: true,
      }),
    ).toEqual({
      ok: false,
      issues: [
        {
          path: ["extra"],
          code: "unknown_key",
          key: "extra",
          message: "Unknown key: extra",
        },
      ],
    });
  });

  test("allows optional declared fields to be omitted in strict objects", () => {
    const schema = s.object(
      {
        id: s.string(),
        verbose: s.optional(s.boolean()),
      },
      { unknownKeys: "strict" },
    );

    expect(
      schema.parse({
        id: "user_123",
      }),
    ).toEqual({
      ok: true,
      value: {
        id: "user_123",
      },
    });
  });

  test("returns nested unknown-key issues for strict nested objects", () => {
    const schema = s.object({
      id: s.string(),
      location: s.object({
        city: s.string(),
        state: s.string(),
      }),
    });

    expect(
      schema.parse({
        id: "user_123",
        location: {
          city: "Bloomington",
          state: "Illinois",
          country: "USA",
        },
      }),
    ).toEqual({
      ok: false,
      issues: [
        {
          path: ["location", "country"],
          code: "unknown_key",
          key: "country",
          message: "Unknown key: country",
        },
      ],
    });
  });

  test("returns both strict unknown-key failures and normal field validation issues", () => {
    const schema = s.object({
      id: s.string(),
    });

    expect(
      schema.parse({
        id: 123,
        extra: true,
      }),
    ).toEqual({
      ok: false,
      issues: [
        {
          path: ["id"],
          code: "invalid_type",
          expected: "string",
          received: "number",
          message: "Expected type: string, received type: number",
        },
        {
          path: ["extra"],
          code: "unknown_key",
          key: "extra",
          message: "Unknown key: extra",
        },
      ],
    });
  });

  test("emits additionalProperties based on object config", () => {
    const ignoreSchema = s.object(
      {
        id: s.string(),
      },
      { unknownKeys: "ignore" },
    );

    const strictSchema = s.object(
      {
        id: s.string(),
      },
      { unknownKeys: "strict" },
    );

    expect(ignoreSchema.toJSONSchema()).toEqual({
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
      additionalProperties: true,
    });

    expect(strictSchema.toJSONSchema()).toEqual({
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
      additionalProperties: false,
    });
  });
});
