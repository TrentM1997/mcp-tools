import type {
  Schema,
  DefineSchemaConfig,
  ParseFailedResult,
  JSONSchema,
  Path,
  Issue,
  InferObjectShape,
  ObjectShape,
} from "./types.js";

function defineSchema<T>(config: DefineSchemaConfig<T>): Schema<T> {
  return {
    parse(input, path = []) {
      return config.parseAtPath(input, path);
    },
    toJSONSchema: config.toJSONSchema,
  };
}

function expectedType(type: JSONSchema["type"]) {
  return `Expected ${type}` as const;
}

function validationFailureResult(
  path: Path,
  message: Issue["message"],
): ParseFailedResult {
  return {
    ok: false,
    issues: [{ path, message }],
  };
}

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

function expectedTypeFailure(
  path: Path,
  type: JSONSchema["type"],
): ParseFailedResult {
  return validationFailureResult(path, expectedType(type));
}

export {
  defineSchema,
  validationFailureResult,
  expectedType,
  expectedTypeFailure,
  parseArrayItems,
  parseObjectProperties,
};
