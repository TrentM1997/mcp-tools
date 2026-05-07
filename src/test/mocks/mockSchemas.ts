import { s } from "../../index.js";

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

export { WeatherToolInputSchema };
