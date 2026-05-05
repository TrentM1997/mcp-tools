import type { Schema } from "../types/schema.js";
import type { InferObjectShape, ObjectShape } from "../types/inference.js";
import { defineSchema } from "../config/defineSchema.js";
import { expectedTypeFailure } from "../utils/failures.js";
import { isObject } from "../utils/parse.js";
import { finalizeArrayResult, finalizeParseResult } from "../utils/results.js";
import { emitObjectJSON } from "../emitters/emitObjectJSON.js";

function object<TShape extends ObjectShape>(
  shape: TShape,
): Schema<InferObjectShape<TShape>> {
  return defineSchema({
    parseAtPath(input, path) {
      if (!isObject(input)) {
        return expectedTypeFailure(path, "object");
      }
      return finalizeParseResult(input, shape, path);
    },
    toJSONSchema() {
      return emitObjectJSON(shape);
    },
  });
}

function array<T>(item: Schema<T>): Schema<Array<T>> {
  return defineSchema({
    parseAtPath(input, path) {
      if (!Array.isArray(input)) {
        return expectedTypeFailure(path, "array");
      }

      return finalizeArrayResult(input, path, item);
    },
    toJSONSchema() {
      return { type: "array", items: item.toJSONSchema() };
    },
  });
}

export { array, object };
