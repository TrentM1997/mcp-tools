import type { JSONSchema } from "../types/schema.js";
import type { ObjectShape } from "../types/inference.js";
import { collectObjectProperties } from "../utils/composites/walkers.js";
import type { ObjectSchemaConfig } from "../types/config.js";

export function emitObjectJSON<TShape extends ObjectShape>(
  shape: TShape,
  config: ObjectSchemaConfig,
): JSONSchema {
  const { properties, required } = collectObjectProperties(shape);

  switch (config.unknownKeys) {
    case "ignore": {
      return {
        type: "object",
        properties,
        required,
        additionalProperties: true,
      };
    }
    case "strict": {
      return {
        type: "object",
        properties,
        required,
        additionalProperties: false,
      };
    }
  }
}
