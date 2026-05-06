import { array, object } from "./constructors/composites.js";
import { literal, number, boolean, string } from "./constructors/primitives.js";
import { optional } from "./constructors/modifiers.js";

const s = {
  string,
  boolean,
  number,
  literal,
  optional,
  array,
  object,
};

export { s };
