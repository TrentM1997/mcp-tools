import type { ToolDefinition } from "../types.js";

export function defineTool<TInput, TOutput = unknown>(
  tool: ToolDefinition<TInput, TOutput>,
): ToolDefinition<TInput, TOutput> {
  return tool;
}
