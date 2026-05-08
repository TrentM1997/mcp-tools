import type {
  DiscriminatedUnionMembers,
  JSONLiteral,
} from "../../types/schema.js";

export function buildDiscriminatorMap<
  TKey extends string,
  TSchemas extends DiscriminatedUnionMembers<TKey>,
>(key: TKey, schemas: TSchemas): Map<JSONLiteral, TSchemas[number]> {
  const branches = new Map<JSONLiteral, TSchemas[number]>();

  for (const schema of schemas) {
    const discriminator = schema.shape[key];

    if (branches.has(discriminator.value)) {
      throw new Error(
        `Duplicate discriminated union member for ${key}=${String(discriminator.value)}`,
      );
    }

    branches.set(discriminator.value, schema);
  }

  return branches;
}
