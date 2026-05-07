# mcp-tools

An experimental TypeScript library for building validated MCP-style tools from first principles.

The project is still early, but it has moved past pure planning. Today the strongest part of the codebase is a small schema system for tool inputs, plus the first pass at a tool definition and registry layer.

## Current status

What exists today:

- a typed schema API for common JSON-shaped inputs
- runtime parsing with structured validation issues
- JSON Schema emission from the same schema definitions
- a `defineTool(...)` helper for authoring tools
- a registry scaffold that can register, store, and list tools

What does not exist yet:

- JSON-RPC handling
- MCP method routing
- Streamable HTTP transport
- session lifecycle handling
- a full tool execution pipeline that validates input before invoking handlers
- output validation / normalization

## Goals

This repo has two active goals:

- understand MCP deeply by implementing the core pieces directly
- shape those pieces into a library that feels small, readable, and practical to use

The intent is still to own the internals rather than wrap an MCP SDK, but the current implementation is focused on the foundations needed before protocol work makes sense.

## Public API today

The package currently exports:

- `defineTool`
- `s`
- `ToolManager`

```ts
import { defineTool, s, ToolManager } from "mcp-tools";
```

## Schema system

The schema layer is the most complete part of the library right now.

Supported schema constructors:

- `s.string()`
- `s.number()`
- `s.boolean()`
- `s.literal(value)`
- `s.array(itemSchema)`
- `s.object(shape)`
- `s.optional(schema)`
- `s.union(schema[])`

Each schema currently supports two core operations:

- `parse(input)` for runtime validation
- `toJSONSchema()` for MCP-facing schema emission

### Example

```ts
import { s } from "mcp-tools";

const GetUserInput = s.object({
  id: s.string(),
  verbose: s.optional(s.boolean()),
  tags: s.array(s.string()),
});

const parsed = GetUserInput.parse({
  id: "user_123",
  verbose: true,
  tags: ["admin", "beta"],
});

const jsonSchema = GetUserInput.toJSONSchema();
```

### Validation behavior

The current parser behavior is intentionally small and predictable:

- primitive schemas validate by JavaScript type
- `literal(...)` validates exact equality
- object schemas validate each declared field
- optional object fields are skipped when absent
- arrays validate each item and collect item-level issues
- failures include a `path` and `message`
- unknown object properties are currently ignored rather than rejected

Example result shapes:

```ts
type ParseSuccess<T> = {
  ok: true;
  value: T;
};

type ParseFailure = {
  ok: false;
  issues: Array<{
    path: Array<string | number>;
    message: string;
  }>;
};
```

### JSON Schema support

The emitted JSON Schema is intentionally narrow right now. The current emitter can produce:

- `type: "string"`
- `type: "number"`
- `type: "boolean"`
- `type: "array"`
- `type: "object"`
- `const`
- `required`

That keeps the schema surface aligned with what the runtime validator actually understands today.

## Tool definition

Tool authoring has started with a minimal `defineTool(...)` helper:

```ts
import { defineTool, s } from "mcp-tools";

const getUser = defineTool({
  name: "get_user",
  description: "Fetch a user by ID",
  inputSchema: s.object({
    id: s.string(),
    verbose: s.optional(s.boolean()),
  }),
  async handler(input) {
    return { id: input.id, name: "Trent" };
  },
});
```

At the moment, `defineTool(...)` is mostly a typed authoring boundary. It does not yet execute validation automatically or wrap handler output.

`outputSchema` is present in the types, but output validation is not wired through yet.

## Registry progress

The repo now also has the first registry pass.

Current registry behavior:

- register a tool by name
- reject duplicate tool names
- derive and store `inputJSONSchema` during registration
- list registered tools
- look up a tool by name

This is useful as a foundation, but it is still scaffolding:

- the registry is not yet part of the top-level public export surface
- there is no invocation API yet
- registered handlers are stored, but not run through a validation/execution pipeline
- MCP tool-list and tool-call protocol layers have not been connected yet

## Design direction

The current shape of the repo suggests a clear sequence:

1. finish the schema and tool-definition foundations
2. make registry-backed tool execution explicit
3. layer MCP method handling on top
4. add transport, with Streamable HTTP still the intended `v0` target

That order keeps the protocol layer thin and lets the library derive MCP-facing behavior from first-class internal types instead of treating JSON Schema as the source of truth.

## Known gaps

A few limitations are visible in the current implementation:

- no enums, nullable values, refinements, or transforms yet
- no object strictness mode for rejecting extra properties
- no custom error formatting beyond path + message
- no test runner integration yet; the repo currently uses simple executable test files
- no transport or server implementation yet

## Working principle

Build the internals directly, but keep the user-facing API compact enough that a tool author should not need to think in raw JSON Schema or MCP protocol details for normal use.
