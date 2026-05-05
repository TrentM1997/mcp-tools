import type { ParseResult, Path } from "../types/result.js";
import type { Schema } from "../types/schema.js";
import type { ObjectShape, InferObjectShape } from "../types/inference.js";
import { parseArrayItems, parseObjectProperties } from "./walkers.js";

function finalizeParseResult<TShape extends ObjectShape>(
  input: unknown,
  shape: TShape,
  path: Path,
): ParseResult<InferObjectShape<TShape>> {
  const objectInput = input as Record<string, unknown>;

  const { issues, values } = parseObjectProperties(shape, objectInput, path);

  if (issues.length > 0) {
    return {
      ok: false,
      issues: issues,
    };
  }

  return { ok: true, value: values };
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
