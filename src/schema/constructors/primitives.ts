import type { Schema } from "../types/schema.js";
import {
  expectedLiteralFailure,
  expectedTypeFailure,
} from "../utils/failures.js";
import { defineSchema } from "../config/defineSchema.js";

function string(): Schema<string> {
  return defineSchema({
    parseAtPath(input, path) {
      if (typeof input !== "string") {
        return expectedTypeFailure(path, "string", input);
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
        return expectedTypeFailure(path, "boolean", input);
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
        return expectedTypeFailure(path, "number", input);
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
        return expectedLiteralFailure(path, `${String(value)}`, input);
      }

      return { ok: true, value };
    },
    toJSONSchema() {
      return { const: value };
    },
  });
}

export { string, number, boolean, literal };
