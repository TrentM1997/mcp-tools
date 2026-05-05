import type { InferObjectShape, ObjectShape, Schema } from "./types.js";
import {
  parseArrayItems,
  defineSchema,
  expectedTypeFailure,
  parseObjectProperties,
} from "./factory.js";

function object<TShape extends ObjectShape>(
  shape: TShape,
): Schema<InferObjectShape<TShape>> {
  return defineSchema({
    parseAtPath(input, path) {
      if (input === null || Array.isArray(input) || typeof input !== "object") {
        return expectedTypeFailure(path, "object");
      }

      const objectInput = input as Record<string, unknown>;

      const { issues, values } = parseObjectProperties(
        shape,
        objectInput,
        path,
      );

      if (issues.length > 0) {
        return {
          ok: false,
          issues: issues,
        };
      }

      return { ok: true, value: values };
    },
    toJSONSchema() {
      const keys = Object.keys(shape);
      const properties = Object.fromEntries(
        keys.map((key) => [key, shape[key].toJSONSchema()]),
      );

      return { type: "object", properties, required: keys };
    },
  });
}

function string(): Schema<string> {
  return defineSchema({
    parseAtPath(input, path) {
      if (typeof input !== "string") {
        return expectedTypeFailure(path, "string");
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
        return expectedTypeFailure(path, "boolean");
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
        return expectedTypeFailure(path, "number");
      }
      return { ok: true, value: input };
    },

    toJSONSchema() {
      return { type: "number" };
    },
  });
}

function array<T>(item: Schema<T>): Schema<Array<T>> {
  return defineSchema({
    parseAtPath(input, path) {
      if (!Array.isArray(input)) {
        return expectedTypeFailure(path, "array");
      }
      const { values, issues } = parseArrayItems(input, path, item);

      if (issues.length > 0) {
        return { ok: false, issues };
      }

      return { ok: true, value: values };
    },
    toJSONSchema() {
      return { type: "array", items: item.toJSONSchema() };
    },
  });
}

function parse<T>(schema: Schema<T>, input: unknown) {
  return schema.parse(input);
}

export { parse, array, string, number, boolean, object };

//const test = object({
//  tool: string(),
//  description: string(),
//  isPublic: boolean(),
//});
//
//const tool = {
//  tool: "News Aggregate",
//  description: "NewsCatcher API service",
//  isPublic: true,
//};
//
//const toolV2 = {
//  tool: "News Aggregate",
//  description: "NewsCatcher API service",
//  isPublic: "true",
//};
//
//console.dir(JSON.stringify(test.toJSONSchema()));
//
//console.dir(JSON.stringify(test.parse(tool)));
