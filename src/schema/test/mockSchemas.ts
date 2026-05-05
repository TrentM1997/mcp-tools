import { string, number, literal } from "../constructors/primitives.js";
import { object } from "../constructors/composites.js";
import { optional } from "../constructors/modifiers.js";

const shouldFailRequired = {
  trent: "Trent",
  job: "Software Engineer",
  howOld: 28,
};

const noHeight = {
  name: "Trent",
  occupation: "Software Engineer",
  age: 28,
};

const withHeight = {
  name: "Trent",
  occupation: "Software Engineer",
  age: 28,
  height: `6'4"`,
};

const literalShouldFail = "Java";

const literalShouldPass = "TypeScript";

const LiteralSchema = literal("TypeScript");

const RequiredObjectSchema = object({
  name: string(),
  occupation: string(),
  age: number(),
});

const OptionalObjectSchema = object({
  name: string(),
  occupation: string(),
  age: number(),
  height: optional(string()),
});

const mockValues = {
  literalShouldFail,
  literalShouldPass,
  shouldFailRequired,
  withHeight,
  noHeight,
};

const mockSchemas = {
  OptionalObjectSchema,
  RequiredObjectSchema,
  LiteralSchema,
};

export { mockSchemas };

export { mockValues };
