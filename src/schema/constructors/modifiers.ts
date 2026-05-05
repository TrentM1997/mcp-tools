import type { OptionalSchema, Schema } from "../types/schema.js";

function optional<T>(schema: Schema<T>): OptionalSchema<T> {
  return {
    kind: "optional",
    inner: schema,
  };
}

export { optional };
