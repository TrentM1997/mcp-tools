import type { Issue } from "../../schema/types/result.js";
import type { JSONSchema, Schema } from "../../schema/types/schema.js";
import type { ToolHandler } from "./definition.js";

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

interface ToolCallOptions {
  callId?: string;
}
type ToolCallResponse<T> = {
  callId: string;
  requestedToolName: string;
  resolvedToolName?: string;
  result: ToolCallResult<T>;
};

type ToolCallResult<T = unknown> =
  | { ok: true; value: T }
  | {
      ok: false;
      code: "not_found" | "invalid_input" | "handler_error" | "invalid_output";
      reason: string;
      issues?: Issue[];
      formattedIssues?: string;
    };

type ToolsRegistered = Map<string, StoredTool>;

interface ToolMetadata {
  name: string;
  description: string;
  inputJSONSchema: JSONSchema;
}

type RegistrationResult =
  | {
      ok: true;
      registered: ToolMetadata;
    }
  | {
      ok: false;
      reason: string;
    };

export type {
  NormalizedTool,
  StoredTool,
  ToolCallOptions,
  ToolCallResult,
  RegistrationResult,
  ToolsRegistered,
  ToolMetadata,
  ToolCallResponse,
};
