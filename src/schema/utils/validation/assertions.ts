import type { Schema, OptionalSchema } from "../../types/schema.js";

function parse<T>(schema: Schema<T>, input: unknown) {
  return schema.parse(input);
}
function isObject(input: unknown): input is Record<string, unknown> {
  return input !== null && !Array.isArray(input) && typeof input === "object";
}

function isOptionalSchema<T>(
  value: Schema<T> | OptionalSchema<T>,
): value is OptionalSchema<T> {
  return "kind" in value && value.kind === "optional";
}

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export { parse, isObject, isOptionalSchema, isValidNumber };
