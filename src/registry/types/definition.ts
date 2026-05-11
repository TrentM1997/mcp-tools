import type { Schema } from "../../schema/types/schema.js";

type ToolHandlerWithContext<TInput, TOutput, TContext> = (
  input: TInput,
  context: TContext,
) => TOutput | Promise<TOutput>;

type ToolHandler<TInput, TOutput> = (
  input: TInput,
) => TOutput | Promise<TOutput>;

type ToolDefinition<TInput, TOutput> = {
  name: string;
  description: string;
  inputSchema: Schema<TInput>;
  handler: (input: TInput) => TOutput | Promise<TOutput>;
  outputSchema?: Schema<TOutput>;
};

export type {
  ToolDefinition,
  ToolHandler,
  ContextualToolDefinition,
  ToolHandlerWithContext,
};

//******** experimental type  */
type ContextualToolDefinition<TInput, TOutput, TContext> = {
  name: string;
  description: string;
  inputSchema: Schema<TInput>;
  handler: (input: TInput, context: TContext) => TOutput | Promise<TOutput>;
  outputSchema?: Schema<TOutput>;
};

//******** experimental type  */
