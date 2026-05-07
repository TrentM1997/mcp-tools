import { array, object, union } from "./constructors/composites.js";
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
  union,
};

export { s };
