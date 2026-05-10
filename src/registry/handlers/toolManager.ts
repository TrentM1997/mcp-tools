import type {
  StoredTool,
  ToolMetadata,
  ToolCallResult,
  RegistrationResult,
  ToolCallOptions,
  ToolCallResponse,
} from "../types/management.js";
import type { ToolDefinition } from "../types/definition.js";
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

  public register<TInput, TOutput>(
    tool: ToolDefinition<TInput, TOutput>,
  ): RegistrationResult {
    if (this.tools.has(tool.name)) {
      return {
        ok: false,
        reason: `tool already registered with name ${tool.name}`,
      };
    }

    const registered = this.preparer.prepareTool(tool);
    this.tools.set(tool.name, registered);

    const description = this.describe(registered);

    return {
      ok: true,
      registered: description,
    };
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
    options?: ToolCallOptions,
  ): Promise<ToolCallResponse<unknown>> {
    const callId = options?.callId ?? crypto.randomUUID();

    const tool = this.get(name);
    if (!tool) {
      return {
        callId: callId,
        requestedToolName: "No tool found",
        result: {
          ok: false,
          code: "not_found",
          reason: `Could not find tool named: ${name}`,
        },
      };
    }

    const result = await this.runner.execute(tool, rawInput);

    return {
      callId: callId,
      requestedToolName: tool.name,
      result,
    };
  }

  private describe(tool: StoredTool): ToolMetadata {
    return {
      name: tool.name,
      description: tool.description,
      inputJSONSchema: tool.inputJSONSchema,
    };
  }

  private get(name: string): StoredTool | undefined {
    return this.tools.get(name);
  }
}
