import type {
  DiscriminatedUnionMembers,
  ObjectSchema,
  Schema,
} from "../types/schema.js";
import type {
  ObjectShape,
  InferUnion,
  UnionMembers,
  InferDiscriminatedUnion,
} from "../types/inference.js";
import { defineSchema } from "../config/defineSchema.js";
import { expectedTypeFailure } from "../utils/error/failures.js";
import { isObject } from "../utils/validation/assertions.js";
import {
  finalizeArrayResult,
  finalizeParseResult,
} from "../utils/composites/results.js";
import { emitObjectJSON } from "../emitters/emitObjectJSON.js";
import {
  parseDiscriminatedUnion,
  parseUnion,
} from "../utils/composites/walkers.js";
import { buildDiscriminatorMap } from "../utils/composites/builders.js";

function object<TShape extends ObjectShape>(
  shape: TShape,
): ObjectSchema<TShape> {
  const schema = defineSchema({
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

  return {
    ...schema,
    kind: "object",
    shape,
  };
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

function discriminatedUnion<
  const TKey extends string,
  const TSchemas extends DiscriminatedUnionMembers<TKey>,
>(key: TKey, schemas: TSchemas): Schema<InferDiscriminatedUnion<TSchemas>> {
  const branches = buildDiscriminatorMap(key, schemas);

  return defineSchema({
    parseAtPath(input, path) {
      return parseDiscriminatedUnion(input, path, key, branches);
    },
    toJSONSchema() {
      return {
        oneOf: schemas.map((schema) => schema.toJSONSchema()),
      };
    },
  });
}

export { array, object, union, discriminatedUnion };
