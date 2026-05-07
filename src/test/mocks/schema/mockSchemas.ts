import { s } from "mcp-tools";

const LocationSchema = s.object({
  city: s.string(),
  state: s.string(),
  zipCode: s.string(),
});

const WeatherToolInputSchema = s.object({
  id: s.string(),
  verbose: s.optional(s.boolean()),
  location: LocationSchema,
});

const ObjectUnionTestSchema = s.union([
  s.object({
    id: s.string(),
    count: s.number(),
  }),
  s.object({
    slug: s.string(),
    active: s.boolean(),
    label: s.string(),
  }),
]);

const PrimitiveUnionSchema = s.union([s.string(), s.number(), s.literal(true)]);

export { WeatherToolInputSchema, ObjectUnionTestSchema, PrimitiveUnionSchema };
