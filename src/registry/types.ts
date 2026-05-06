import type { Issue } from "../schema/types/result.js";
import type { JSONSchema, Schema } from "../schema/types/schema.js";

type ToolHandlerWithContext<TInput, TOutput, TContext> = (
  input: TInput,
  context: TContext,
) => TOutput | Promise<TOutput>;

type ToolHandler<TInput, TOutput> = (
  input: TInput,
) => TOutput | Promise<TOutput>;

interface ToolDefinition<TInput, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: Schema<TInput>;
  handler: ToolHandler<TInput, TOutput>;
  outputSchema?: Schema<TOutput>;
}

interface NormalizedTool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: Schema<TInput>;
  inputJSONSchema: JSONSchema;
  handler: ToolHandler<TInput, TOutput>;
  outputSchema?: Schema<TOutput>;
}

interface StoredTool {
  name: string;
  description: string;
  inputSchema: Schema<unknown>;
  inputJSONSchema: JSONSchema;
  handler: (input: unknown) => unknown | Promise<unknown>;
  outputSchema?: Schema<unknown>;
}

type ToolCallResult<T = unknown> =
  | { ok: true; value: T }
  | {
      ok: false;
      code: "not_found" | "invalid_input" | "handler_error" | "invalid_output";
      message: string;
      issues?: Issue[];
    };

type ToolsRegistered = Map<string, StoredTool>;

interface ToolMetadata {
  name: string;
  description: string;
  inputJSONSchema: JSONSchema;
}

export type {
  ToolDefinition,
  ToolHandler,
  NormalizedTool,
  ToolHandlerWithContext,
  StoredTool,
  ToolsRegistered,
  ToolCallResult,
  ToolMetadata,
};
