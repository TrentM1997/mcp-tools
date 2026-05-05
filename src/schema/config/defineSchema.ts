import type { Schema, DefineSchemaConfig } from "../types/schema.js";

function defineSchema<T>(config: DefineSchemaConfig<T>): Schema<T> {
  return {
    parse(input, path = []) {
      return config.parseAtPath(input, path);
    },
    toJSONSchema: config.toJSONSchema,
  };
}

export { defineSchema };
