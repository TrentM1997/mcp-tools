import { describe, expect, test } from "vitest";
import { s } from "../../../index.js";
import { DiscriminatedEntitySchema } from "../../mocks/schema/mockSchemas.js";

describe("discriminatedUnion()", () => {
  test("parses the matching branch when the discriminator is valid", () => {
    expect(
      DiscriminatedEntitySchema.parse({
        type: "user",
        id: "user_123",
        active: true,
      }),
    ).toEqual({
      ok: true,
      value: {
        type: "user",
        id: "user_123",
        active: true,
      },
    });

    expect(
      DiscriminatedEntitySchema.parse({
        type: "org",
        slug: "openai",
        seats: 120,
      }),
    ).toEqual({
      ok: true,
      value: {
        type: "org",
        slug: "openai",
        seats: 120,
      },
    });
  });

  test("returns an object-type failure for non-object input", () => {
    expect(DiscriminatedEntitySchema.parse("not-an-object")).toEqual({
      ok: false,
      issues: [
        {
          path: [],
          message: "Expected type: object, received type: string",
        },
      ],
    });
  });

  test("returns a discriminator-specific failure for unknown discriminator values", () => {
    expect(
      DiscriminatedEntitySchema.parse({
        type: "team",
        slug: "research",
      }),
    ).toEqual({
      ok: false,
      issues: [
        {
          path: ["type"],
          message:
            'Expected discriminator "type" to match one of: user, org, received: team',
        },
      ],
    });
  });

  test("emits oneOf JSON Schema for discriminated union members", () => {
    expect(DiscriminatedEntitySchema.toJSONSchema()).toEqual({
      oneOf: [
        {
          type: "object",
          properties: {
            type: { const: "user" },
            id: { type: "string" },
            active: { type: "boolean" },
          },
          required: ["type", "id", "active"],
        },
        {
          type: "object",
          properties: {
            type: { const: "org" },
            slug: { type: "string" },
            seats: { type: "number" },
          },
          required: ["type", "slug", "seats"],
        },
      ],
    });
  });

  test("throws when duplicate discriminator values are registered", () => {
    expect(() =>
      s.discriminatedUnion("type", [
        s.object({
          type: s.literal("user"),
          id: s.string(),
        }),
        s.object({
          type: s.literal("user"),
          slug: s.string(),
        }),
      ]),
    ).toThrow("Duplicate discriminated union member for: type=user");
  });
});
