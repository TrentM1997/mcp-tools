import type { Schema } from "../types/schema.js";
import type {
  InferObjectShape,
  ObjectShape,
  InferUnion,
  UnionMembers,
} from "../types/inference.js";
import { defineSchema } from "../config/defineSchema.js";
import { expectedTypeFailure } from "../utils/failures.js";
import { isObject } from "../utils/assertions.js";
import { finalizeArrayResult, finalizeParseResult } from "../utils/results.js";
import { emitObjectJSON } from "../emitters/emitObjectJSON.js";
import { parseUnion } from "../utils/walkers.js";

function object<TShape extends ObjectShape>(
  shape: TShape,
): Schema<InferObjectShape<TShape>> {
  return defineSchema({
    parseAtPath(input, path) {
      if (!isObject(input)) {
        return expectedTypeFailure(path, "object", input);
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
        return expectedTypeFailure(path, "array", input);
      }

      return finalizeArrayResult(input, path, item);
    },
    toJSONSchema() {
      return { type: "array", items: item.toJSONSchema() };
    },
  });
}

function union<const TSchemas extends UnionMembers>(
  schemas: TSchemas,
): Schema<InferUnion<TSchemas>> {
  return defineSchema({
    parseAtPath(input, path) {
      return parseUnion(input, path, schemas);
    },
    toJSONSchema() {
      return {
        anyOf: schemas.map((schema) => schema.toJSONSchema()),
      };
    },
  });
}

export { array, object, union };
