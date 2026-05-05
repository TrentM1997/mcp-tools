import type { OptionalSchema, Schema } from "../types/schema.js";
import type { ObjectShape, ShapeKey, ParsedShape } from "../types/inference.js";
import type { Path, Issue } from "../types/result.js";
import { assignValidatedField } from "./helpers.js";

function parseRequiredSchema<TShape extends ObjectShape>(
  propertySchema: Schema<any>,
  propertyValue: unknown,
  path: Path,
  key: ShapeKey<TShape>,
  values: Partial<ParsedShape<TShape>>,
  issues: Issue[],
): void {
  const result = propertySchema.parse(propertyValue, [...path, key]);
  if (result.ok) {
    assignValidatedField(values, key, result.value);
  } else {
    issues.push(...result.issues);
  }
}

function parseOptionalSchema<TShape extends ObjectShape>(
  propertySchema: OptionalSchema<any>,
  propertyValue: unknown,
  path: Path,
  key: ShapeKey<TShape>,
  values: Partial<ParsedShape<TShape>>,
  issues: Issue[],
) {
  const result = propertySchema.inner.parse(propertyValue, [...path, key]);
  if (result.ok) {
    assignValidatedField(values, key, result.value);
  } else {
    issues.push(...result.issues);
  }
}

export { parseRequiredSchema, parseOptionalSchema };
