import type { Schema } from "../../schema/types/schema.js";

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

export type { ToolDefinition, ToolHandler, ToolHandlerWithContext };
