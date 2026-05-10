import type { ParseResult, Path } from "../../types/result.js";
import type { Schema } from "../../types/schema.js";
import type { ObjectShape, InferObjectShape } from "../../types/inference.js";
import {
  parseArrayItems,
  parseObjectProperties,
  parseStrictObjectSchema,
} from "./walkers.js";
import type { ObjectSchemaConfig } from "../../types/config.js";
import { isObject } from "../validation/assertions.js";
import { expectedTypeFailure } from "../error/failures.js";

function finalizeParseResult<TShape extends ObjectShape>(
  input: unknown,
  shape: TShape,
  path: Path,
  config: ObjectSchemaConfig,
): ParseResult<InferObjectShape<TShape>> {
  if (!isObject(input)) {
    return expectedTypeFailure(path, "object", input);
  }

  switch (config.unknownKeys) {
    case "strict": {
      const { issues, values } = parseStrictObjectSchema(shape, input, path);

      if (issues.length > 0) {
        return {
          ok: false,
          issues: issues,
        };
      }

      return { ok: true, value: values as InferObjectShape<TShape> };
    }

    default: {
      const { issues, values } = parseObjectProperties(shape, input, path);

      if (issues.length > 0) {
        return {
          ok: false,
          issues: issues,
        };
      }

      return { ok: true, value: values as InferObjectShape<TShape> };
    }
  }
}

function finalizeArrayResult<T>(
  input: Array<T>,
  path: Path,
  item: Schema<T>,
): ParseResult<Array<T>> {
  const { values, issues } = parseArrayItems(input, path, item);

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, value: values };
}

export { finalizeParseResult, finalizeArrayResult };
