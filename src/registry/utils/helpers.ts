import type { Schema } from "../../schema/types/schema.js";
import type {
  RegisteredTool,
  StoredTool,
  ToolDefinition,
  ToolsRegistered,
} from "../types.js";

export function normalizeTool<TInput, TOutput>(
  tool: ToolDefinition<TInput, TOutput>,
): RegisteredTool<TInput, TOutput> {
  return {
    ...tool,
    inputJSONSchema: tool.inputSchema.toJSONSchema(),
  };
}

export function toStoredTool<TInput, TOutput>(
  tool: RegisteredTool<TInput, TOutput>,
): StoredTool {
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema as Schema<unknown>,
    inputJSONSchema: tool.inputJSONSchema,
    handler: (input: unknown) => tool.handler(input as TInput),
    outputSchema: tool.outputSchema as Schema<unknown> | undefined,
  };
}

export function registerNewTool<TInput, TOutput>(
  tools: ToolsRegistered,
  tool: ToolDefinition<TInput, TOutput>,
) {
  if (tools.has(tool.name)) {
    throw new Error(`Tool already registered: ${tool.name}`);
  }

  const registered = normalizeTool(tool);
  const stored = toStoredTool(registered);
  tools.set(tool.name, stored);
  return registered;
}
