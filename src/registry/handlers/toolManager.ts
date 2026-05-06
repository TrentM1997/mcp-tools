import type {
  StoredTool,
  ToolDefinition,
  ToolMetadata,
  ToolCallResult,
} from "../types.js";
import { ToolPreparer } from "./toolPreparer.js";
import { ToolRunner } from "./toolRunner.js";

export class ToolManager {
  private readonly tools: Map<string, StoredTool>;
  private readonly runner: ToolRunner;
  private readonly preparer: ToolPreparer;
  constructor() {
    this.preparer = new ToolPreparer();
    this.runner = new ToolRunner();
    this.tools = new Map();
  }

  public register<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>) {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool already registered: ${tool.name}`);
    }

    const registered = this.preparer.prepareTool(tool);
    this.tools.set(tool.name, registered);
    return registered;
  }

  public list(): Array<ToolMetadata> {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputJSONSchema: tool.inputJSONSchema,
    }));
  }

  public async call(
    name: string,
    rawInput: unknown,
  ): Promise<ToolCallResult<unknown>> {
    const tool = this.get(name);
    if (!tool) {
      return {
        ok: false,
        code: "not_found",
        message: `Could not find tool named: ${name}`,
      };
    }
    return await this.runner.execute(tool, rawInput);
  }

  private get(name: string): StoredTool | undefined {
    return this.tools.get(name);
  }
}
