import { describe, expect, test } from "vitest";
import { s } from "../../../index.js";
import {
  ObjectUnionTestSchema,
  PrimitiveUnionSchema,
} from "../../mocks/schema/mockSchemas.js";

describe("union()", () => {
  test("parses values that match any union member", () => {
    expect(PrimitiveUnionSchema.parse("Trent")).toEqual({
      ok: true,
      value: "Trent",
    });

    expect(PrimitiveUnionSchema.parse(28)).toEqual({
      ok: true,
      value: 28,
    });

    expect(PrimitiveUnionSchema.parse(true)).toEqual({
      ok: true,
      value: true,
    });
  });

  test("returns the most relevant branch failure when all union members fail", () => {
    const result = ObjectUnionTestSchema.parse({
      id: "abc",
      count: "wrong",
    });

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          path: ["count"],
          message: "Expected type: number, received type: string",
        },
      ],
    });
  });

  test("emits anyOf JSON Schema for union members", () => {
    expect(PrimitiveUnionSchema.toJSONSchema()).toEqual({
      anyOf: [{ type: "string" }, { type: "number" }, { const: true }],
    });
  });
});
