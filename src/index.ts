import { defineTool } from "./registry/config/defineTool.js";
import {
  string,
  number,
  boolean,
  literal,
} from "./schema/constructors/primitives.js";
import { array, object, union } from "./schema/constructors/composites.js";
import { optional } from "./schema/constructors/modifiers.js";
import { ToolManager } from "./registry/index.js";

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

export { defineTool, s, ToolManager };
