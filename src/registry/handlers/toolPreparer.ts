import type { Schema } from "../../schema/types/schema.js";
import type { NormalizedTool, StoredTool } from "../types/management.js";
import type { ToolDefinition } from "../types/definition.js";

export class ToolPreparer {
  constructor() {}

  public prepareTool<TInput, TOutput>(
    tool: ToolDefinition<TInput, TOutput>,
  ): StoredTool {
    const normailzedTool = this.normalizeTool(tool);

    return this.toStoredTool(normailzedTool);
  }

  private normalizeTool<TInput, TOutput>(
    tool: ToolDefinition<TInput, TOutput>,
  ): NormalizedTool<TInput, TOutput> {
    return {
      ...tool,
      inputJSONSchema: tool.inputSchema.toJSONSchema(),
    };
  }

  private toStoredTool<TInput, TOutput>(
    tool: NormalizedTool<TInput, TOutput>,
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
}
