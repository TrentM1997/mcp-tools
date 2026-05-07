import type { ParseResult, Path } from "./result.js";

type ExpectedRuntimeType = "string" | "number" | "boolean" | "array" | "object";

type JSONLiteral = string | number | boolean;

type JSONSchema =
  | { type: "string" }
  | { type: "number" }
  | { type: "boolean" }
  | { type: "array"; items: JSONSchema }
  | {
      type: "object";
      properties: Record<string, JSONSchema>;
      required: string[];
    }
  | { const: JSONLiteral }
  | { anyOf: JSONSchema[] };

type ObjectProperties = Record<string, JSONSchema>;

interface DefineSchemaConfig<T> {
  parseAtPath(input: unknown, path: Path): ParseResult<T>;
  toJSONSchema(): JSONSchema;
}

type InternalSchema<T> = {
  parse(input: unknown): ParseResult<T>;
  parseAtPath(input: unknown, path: Path): ParseResult<T>;
};

interface Schema<T> {
  parse(input: unknown, path?: Path): ParseResult<T>;
  toJSONSchema(): JSONSchema;
}

interface OptionalSchema<T> {
  kind: "optional";
  inner: Schema<T>;
}

export type {
  Schema,
  DefineSchemaConfig,
  JSONSchema,
  InternalSchema,
  OptionalSchema,
  ObjectProperties,
  ExpectedRuntimeType,
};
