import { mockSchemas, mockValues } from "./mockSchemas.js";

const { RequiredObjectSchema, OptionalObjectSchema, LiteralSchema } =
  mockSchemas;

const { noHeight, withHeight, literalShouldFail, literalShouldPass } =
  mockValues;

export function testRequiredObjectSchema(schema: typeof RequiredObjectSchema) {
  const emitted = { "JSONSchema emitted": schema.toJSONSchema() };
  const test = { "Required Schema Test": schema.parse(noHeight) };
  return {
    Tests: test,
    toJSONSchema: emitted,
  };
}

export function testOptionalSchema(
  schema: typeof OptionalObjectSchema,
  input: unknown,
) {
  const emitted = { "JSONSchema emitted": schema.toJSONSchema() };
  const test = { "Required Schema Test": schema.parse(input) };

  return {
    Tests: test,
    toJSONSchema: emitted,
  };
}

export function testLiteralSchema(schema: typeof LiteralSchema) {
  const literaltests = {
    "Should Pass": schema.parse(literalShouldPass),
    "Should Fail": schema.parse(literalShouldFail),
  };

  const emitted = { "JSONSchema emitted": schema.toJSONSchema() };

  return {
    Tests: literaltests,
    toJSONSchema: emitted,
  };
}

console.dir(testOptionalSchema(OptionalObjectSchema, withHeight), {
  depth: null,
});

console.dir(testOptionalSchema(OptionalObjectSchema, noHeight), {
  depth: null,
});
