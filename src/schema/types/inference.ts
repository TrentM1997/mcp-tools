import type { OptionalSchema, Schema } from "./schema.js";

type SchemaEntry = Schema<any> | OptionalSchema<any>;

type ObjectShape = Record<string, SchemaEntry>;

type InferField<TField> =
  TField extends Schema<infer TValue>
    ? TValue
    : TField extends OptionalSchema<infer TValue>
      ? TValue
      : never;

type OptionalKeys<TShape extends ObjectShape> = {
  [K in keyof TShape]: TShape[K] extends OptionalSchema<any> ? K : never;
}[keyof TShape];

type InferSchema<TSchema> =
  TSchema extends Schema<infer TValue> ? TValue : never;

type RequiredKeys<TShape extends ObjectShape> = Exclude<
  keyof TShape,
  OptionalKeys<TShape>
>;

type RequiredPart<TShape extends ObjectShape> = {
  [K in RequiredKeys<TShape>]: InferField<TShape[K]>;
};

type OptionalPart<TShape extends ObjectShape> = {
  [K in OptionalKeys<TShape>]?: InferField<TShape[K]>;
};

type InferObjectShape<TShape extends ObjectShape> = RequiredPart<TShape> &
  OptionalPart<TShape>;

export type {
  InferObjectShape,
  InferSchema,
  ObjectShape,
  OptionalKeys,
  InferField,
  RequiredKeys,
  RequiredPart,
  OptionalPart,
};
