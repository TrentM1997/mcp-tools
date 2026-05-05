import type { ObjectShape, ParsedShape, ShapeKey } from "../types/inference.js";

export function assignValidatedField<TShape extends ObjectShape>(
  values: Partial<ParsedShape<TShape>>,
  key: ShapeKey<TShape>,
  value: unknown,
) {
  (values as Record<string, unknown>)[key] = value;
}
