import type { Schema } from "../types/schema.js";
import { expectedTypeFailure } from "../utils/failures.js";
import { defineSchema } from "../config/defineSchema.js";

function string(): Schema<string> {
  return defineSchema({
    parseAtPath(input, path) {
      if (typeof input !== "string") {
        return expectedTypeFailure(path, "Expected type: string");
      }

      return { ok: true, value: input };
    },

    toJSONSchema() {
      return { type: "string" };
    },
  });
}

function boolean(): Schema<boolean> {
  return defineSchema({
    parseAtPath(input, path) {
      if (typeof input !== "boolean") {
        return expectedTypeFailure(path, "Expected type: boolean");
      }

      return { ok: true, value: input };
    },

    toJSONSchema() {
      return { type: "boolean" };
    },
  });
}

function number(): Schema<number> {
  return defineSchema({
    parseAtPath(input, path) {
      if (typeof input !== "number") {
        return expectedTypeFailure(path, "Expected type: number");
      }
      return { ok: true, value: input };
    },

    toJSONSchema() {
      return { type: "number" };
    },
  });
}

function literal<T extends string | number | boolean>(value: T): Schema<T> {
  return defineSchema({
    parseAtPath(input, path) {
      if (input !== value) {
        return expectedTypeFailure(path, `Expected literal: ${String(value)}`);
      }

      return { ok: true, value };
    },
    toJSONSchema() {
      return { const: value };
    },
  });
}

export { string, number, boolean, literal };
