import type { ObjectProperties, Schema } from "../types/schema.js";
import type { ObjectShape, InferObjectShape } from "../types/inference.js";
import type { Path, Issue } from "../types/result.js";
import { isOptionalSchema } from "./parse.js";

function parseArrayItems<T>(input: Array<T>, path: Path, item: Schema<T>) {
  const values: T[] = [];
  const issues: Issue[] = [];

  input.forEach((value, index) => {
    const result = item.parse(value, [...path, index]);

    if (result.ok) {
      values.push(result.value);
    } else {
      issues.push(...result.issues);
    }
  });

  return { values, issues };
}

function parseObjectProperties<TShape extends ObjectShape>(
  shape: TShape,
  input: Record<string, unknown>,
  path: Path,
) {
  const values = {} as InferObjectShape<TShape>;
  const issues: Issue[] = [];

  for (const key in shape) {
    const propertySchema = shape[key];
    const propertyValue = input[key];
    const result = propertySchema.parse(propertyValue, [...path, key]);
    if (result.ok) {
      values[key] = result.value;
    } else {
      issues.push(...result.issues);
    }
  }

  return { values, issues };
}

function collectObjectProperties<TShape extends ObjectShape>(shape: TShape) {
  const properties: ObjectProperties = {};
  const required: string[] = [];

  for (const key of Object.keys(shape)) {
    const property = shape[key];

    if (isOptionalSchema(property)) {
      properties[key] = property.inner.toJSONSchema();
    } else {
      properties[key] = property.toJSONSchema();
      required.push(key);
    }
  }

  return { properties, required };
}

export { parseArrayItems, parseObjectProperties, collectObjectProperties };
