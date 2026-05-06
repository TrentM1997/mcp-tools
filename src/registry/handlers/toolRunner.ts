import type { StoredTool, ToolCallResult } from "../types.js";

export class ToolRunner {
  constructor() {}

  public async execute(
    tool: StoredTool,
    rawInput: unknown,
  ): Promise<ToolCallResult<unknown>> {
    const parsed = this.validateToolInput(tool, rawInput);

    if (!parsed.ok) {
      return {
        ok: false,
        code: "invalid_input",
        message: "Tool input failed validation",
        issues: parsed.issues,
      };
    }

    return await this.executeTool(tool, parsed.value);
  }

  private async executeTool(
    tool: StoredTool,
    input: unknown,
  ): Promise<ToolCallResult<unknown>> {
    const execution = await this.invokeTool(tool, input);

    if (!execution.ok) {
      return execution;
    }

    const validatedOutput = this.validateToolOutput(tool, execution.value);

    if (!validatedOutput.ok) {
      return {
        ok: false,
        code: "invalid_output",
        message: "Tool output failed validation",
        issues: validatedOutput.issues,
      };
    }

    return validatedOutput;
  }

  private async invokeTool(
    tool: StoredTool,
    input: unknown,
  ): Promise<ToolCallResult<unknown>> {
    try {
      const value = await tool.handler(input);

      return {
        ok: true,
        value,
      };
    } catch (err) {
      return {
        ok: false,
        code: "handler_error",
        message: "Tool Handler threw during execution",
      };
    }
  }

  private validateToolInput(tool: StoredTool, rawInput: unknown) {
    return tool.inputSchema.parse(rawInput);
  }

  private validateToolOutput(tool: StoredTool, output: unknown) {
    if (!tool.outputSchema) {
      return { ok: true as const, value: output };
    }

    return tool.outputSchema.parse(output);
  }
}
