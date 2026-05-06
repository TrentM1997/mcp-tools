import type { ToolDefinition } from "../types/definition.js";

export function defineTool<TInput, TOutput = unknown>(
  tool: ToolDefinition<TInput, TOutput>,
): ToolDefinition<TInput, TOutput> {
  return tool;
}
