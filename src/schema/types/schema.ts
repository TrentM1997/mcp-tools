import type { InferObjectShape, ObjectShape } from "./inference.js";
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
  | { anyOf: JSONSchema[] }
  | { oneOf: JSONSchema[] };

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

interface LiteralSchema<T extends JSONLiteral> extends Schema<T> {
  kind: "literal";
  value: T;
}

interface ObjectSchema<TShape extends ObjectShape> extends Schema<
  InferObjectShape<TShape>
> {
  kind: "object";
  shape: TShape;
}

type DiscriminatedUnionShape<
  TKey extends string,
  TValue extends JSONLiteral = JSONLiteral,
> = ObjectShape & Record<TKey, LiteralSchema<TValue>>;

type DiscriminatedMember<TKey extends string> = ObjectSchema<
  DiscriminatedUnionShape<TKey>
>;

type DiscriminatedUnionMembers<TKey extends string> = readonly [
  DiscriminatedMember<TKey>,
  ...DiscriminatedMember<TKey>[],
];

export type {
  Schema,
  ObjectSchema,
  LiteralSchema,
  DiscriminatedUnionShape,
  DiscriminatedMember,
  DiscriminatedUnionMembers,
  DefineSchemaConfig,
  JSONLiteral,
  JSONSchema,
  InternalSchema,
  OptionalSchema,
  ObjectProperties,
  ExpectedRuntimeType,
};
