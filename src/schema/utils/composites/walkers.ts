import type {
  DiscriminatedUnionMembers,
  JSONLiteral,
  ObjectProperties,
  Schema,
} from "../../types/schema.js";
import type {
  ObjectShape,
  ShapeKey,
  ParsedShape,
  UnionMembers,
  InferDiscriminatedUnion,
} from "../../types/inference.js";
import type {
  Path,
  Issue,
  ParseFailedResult,
  ParseResult,
} from "../../types/result.js";
import { isObject, isOptionalSchema } from "../validation/assertions.js";
import { parseOptionalSchema, parseRequiredSchema } from "./parsers.js";
import { chooseMoreRelevantFailure } from "./helpers.js";
import { expectedTypeFailure } from "../error/failures.js";

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
  const keys = Object.keys(shape) as ShapeKey<TShape>[];

  const { values, issues } = parseInferredObjectSchema(
    keys,
    shape,
    input,
    path,
  );

  return { values, issues };
}

function parseInferredObjectSchema<TShape extends ObjectShape>(
  keys: ShapeKey<TShape>[],
  shape: TShape,
  input: Record<string, unknown>,
  path: Path,
) {
  const values: Partial<ParsedShape<TShape>> = {};
  const issues: Issue[] = [];

  for (const key of keys) {
    const propertySchema = shape[key];
    const propertyValue = input[key as string];

    if (isOptionalSchema(propertySchema)) {
      if (Object.hasOwn(input, key)) {
        parseOptionalSchema(
          propertySchema,
          propertyValue,
          path,
          key,
          values,
          issues,
        );
      }
    } else {
      parseRequiredSchema(
        propertySchema,
        propertyValue,
        path,
        key,
        values,
        issues,
      );
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

function parseUnion<TSchemas extends UnionMembers>(
  input: unknown,
  path: Path,
  schemas: TSchemas,
) {
  let mostRelevantFailure: ParseFailedResult | undefined;

  for (const schema of schemas) {
    const result = schema.parse(input, path);

    if (result.ok) {
      return result;
    }

    mostRelevantFailure = chooseMoreRelevantFailure(
      mostRelevantFailure,
      result,
    );
  }

  return (
    mostRelevantFailure ?? {
      ok: false,
      issues: [
        {
          path,
          message: "Expected value to match at least one union member",
        },
      ],
    }
  );
}

function parseDiscriminatedUnion<
  TKey extends string,
  TSchemas extends DiscriminatedUnionMembers<TKey>,
>(
  input: unknown,
  path: Path,
  key: TKey,
  branches: Map<JSONLiteral, TSchemas[number]>,
): ParseResult<InferDiscriminatedUnion<TSchemas>> {
  if (!isObject(input)) {
    return expectedTypeFailure(path, "object", input);
  }

  const discriminatorValue = input[key];
  const branch = branches.get(discriminatorValue as JSONLiteral);

  if (!branch) {
    return {
      ok: false,
      issues: [
        {
          path: [...path, key],
          message: `Expected discriminator "${key}" to match one of: ${Array.from(branches.keys()).join(", ")}, received: ${String(discriminatorValue)}`,
        },
      ],
    } satisfies ParseFailedResult;
  }

  return branch.parse(input, path) as ParseResult<
    InferDiscriminatedUnion<TSchemas>
  >;
}

export {
  parseArrayItems,
  parseObjectProperties,
  collectObjectProperties,
  parseUnion,
  parseDiscriminatedUnion,
};
