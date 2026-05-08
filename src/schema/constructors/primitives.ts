import type { LiteralSchema, Schema } from "../types/schema.js";
import {
  expectedLiteralFailure,
  expectedTypeFailure,
} from "../utils/error/failures.js";
import { defineSchema } from "../config/defineSchema.js";
import { isValidNumber } from "../utils/validation/assertions.js";

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
      if (!isValidNumber(input)) {
        return expectedTypeFailure(path, "number", input);
      }
      return { ok: true, value: input };
    },

    toJSONSchema() {
      return { type: "number" };
    },
  });
}

function literal<T extends string | number | boolean>(
  value: T,
): LiteralSchema<T> {
  const schema = defineSchema({
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

  return {
    ...schema,
    kind: "literal",
    value,
  };
}

export { string, number, boolean, literal };
