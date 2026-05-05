import type { JSONSchema } from "../types/schema.js";
import type { ObjectShape } from "../types/inference.js";
import { collectObjectProperties } from "../utils/walkers.js";

export function emitObjectJSON<TShape extends ObjectShape>(
  shape: TShape,
): JSONSchema {
  const { properties, required } = collectObjectProperties(shape);

  return {
    type: "object",
    properties,
    required,
  };
}
