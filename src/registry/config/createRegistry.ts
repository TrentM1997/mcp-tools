import type { StoredTool, ToolRegistry } from "../types.js";
import { registerNewTool } from "../utils/helpers.js";

export function createRegistry(): ToolRegistry {
  const tools = new Map<string, StoredTool>();

  return {
    register(tool) {
      return registerNewTool(tools, tool);
    },

    get(name) {
      return tools.get(name);
    },

    list() {
      return Array.from(tools.values());
    },
  };
}
