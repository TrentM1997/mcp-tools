import type {
  ObjectShape,
  ParsedShape,
  ShapeKey,
} from "../../types/inference.js";
import type { ParseFailedResult } from "../../types/result.js";

export function assignValidatedField<TShape extends ObjectShape>(
  values: Partial<ParsedShape<TShape>>,
  key: ShapeKey<TShape>,
  value: unknown,
) {
  (values as Record<string, unknown>)[key] = value;
}

export function chooseMoreRelevantFailure(
  current: ParseFailedResult | undefined,
  next: ParseFailedResult,
): ParseFailedResult {
  if (!current) {
    return next;
  }

  return next.issues.length < current.issues.length ? next : current;
}
