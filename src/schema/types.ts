type ObjectShape = Record<string, Schema<any>>;

type Path = Array<string | number>;

type JSONSchema =
  | { type: "string" }
  | { type: "number" }
  | { type: "boolean" }
  | { type: "array"; items: JSONSchema }
  | {
      type: "object";
      properties: Record<string, JSONSchema>;
      required?: string[];
    };

type IssueMessage = `Expected ${JSONSchema["type"]}`;

type Issue = {
  path: Path;
  message: IssueMessage;
};

type ParseSuccessResult<T> = { ok: true; value: T };

type ParseFailedResult = { ok: false; issues: Issue[] };

type ParseResult<T> = ParseSuccessResult<T> | ParseFailedResult;

type InternalSchema<T> = {
  parse(input: unknown): ParseResult<T>;
  parseAtPath(input: unknown, path: Path): ParseResult<T>;
};

interface DefineSchemaConfig<T> {
  parseAtPath(input: unknown, path: Path): ParseResult<T>;
  toJSONSchema(): JSONSchema;
}

interface Schema<T> {
  parse(input: unknown, path?: Path): ParseResult<T>;
  toJSONSchema(): JSONSchema;
}

type InferSchema<TSchema> =
  TSchema extends Schema<infer TValue> ? TValue : never;

type InferObjectShape<TShape> = {
  [K in keyof TShape]: InferSchema<TShape[K]>;
};

export type {
  Schema,
  ObjectShape,
  InternalSchema,
  ParseResult,
  ParseFailedResult,
  ParseSuccessResult,
  Path,
  Issue,
  JSONSchema,
  DefineSchemaConfig,
  InferObjectShape,
};
