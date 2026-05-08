import type {
  DiscriminatedUnionMembers,
  JSONLiteral,
} from "../../types/schema.js";

export function buildDiscriminatorMap<
  TKey extends string,
  TSchemas extends DiscriminatedUnionMembers<TKey>,
>(key: TKey, schemas: TSchemas): Map<JSONLiteral, TSchemas[number]> {
  const branches = new Map<JSONLiteral, TSchemas[number]>();

  for (const [index, schema] of schemas.entries()) {
    const discriminator = schema.shape[key];

    if (!discriminator || discriminator.kind !== "literal") {
      throw new Error(
        `Discriminated union member at index ${index} must define a literal discriminator for "${key}"`,
      );
    }

    if (branches.has(discriminator.value)) {
      throw new Error(
        `Duplicate discriminated union member for: ${key}=${discriminator.value}`,
      );
    }

    branches.set(discriminator.value, schema);
  }

  return branches;
}
