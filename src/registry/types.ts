import type { JSONSchema, Schema } from "../schema/types/schema.js";

type ToolHandlerV2<TInput, TOutput, TContext = undefined> = (
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

interface RegisteredTool<TInput = unknown, TOutput = unknown> {
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

interface ToolRegistry {
  register<TInput, TOutput>(
    tool: ToolDefinition<TInput, TOutput>,
  ): RegisteredTool<TInput, TOutput>;
  get(name: string): RegisteredTool | undefined;
  list(): RegisteredTool[];
}

type ToolsRegistered = Map<string, StoredTool>;

export type {
  ToolDefinition,
  ToolHandler,
  RegisteredTool,
  ToolHandlerV2,
  ToolRegistry,
  StoredTool,
  ToolsRegistered,
};
