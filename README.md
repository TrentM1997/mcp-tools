# mcp-tools

An experimental TypeScript library for defining, validating, registering, and invoking MCP-style tools from first principles.

The project is still early, but it now has a real working core:

- a schema system for JSON-shaped inputs
- runtime validation with structured issues
- JSON Schema emission from the same schema definitions
- a typed `defineTool(...)` authoring helper
- a `ToolManager` that registers tools and invokes them through validation
- output validation when a tool provides an `outputSchema`
- a Vitest suite covering the current runtime contract

## Current focus

The scope is intentionally narrow right now:

- tool definition
- input and output validation
- tool registration and discovery
- validated tool invocation
- JSON Schema emission

What is not part of the library yet:

- JSON-RPC handling
- MCP method routing
- Streamable HTTP or stdio transport
- session lifecycle handling
- auth, middleware, or orchestration layers

The goal is to make the validated tool layer solid first, then treat protocol and server concerns as a higher layer later.

## Public API

The top-level package currently exports:

- `defineTool`
- `s`
- `ToolManager`

```ts
import { defineTool, s, ToolManager } from "mcp-tools";
```

## Quick example

```ts
import { defineTool, s, ToolManager } from "mcp-tools";

const getUser = defineTool({
  name: "get_user",
  description: "Fetch a user by ID",
  inputSchema: s.object({
    id: s.string(),
    verbose: s.optional(s.boolean()),
  }),
  outputSchema: s.object({
    id: s.string(),
    name: s.string(),
  }),
  async handler(input) {
    return {
      id: input.id,
      name: "Trent",
    };
  },
});

const tools = new ToolManager();

const registration = tools.register(getUser);

if (!registration.ok) {
  throw new Error(registration.reason);
}

const result = await tools.call("get_user", {
  id: "user_123",
  verbose: true,
});

if (result.ok) {
  console.log(result.value.name);
} else {
  console.error(result.code, result.reason, result.issues);
}
```

## Schema system

The schema layer is the most complete part of the library.

Supported schema constructors:

- `s.string()`
- `s.number()`
- `s.boolean()`
- `s.literal(value)`
- `s.array(itemSchema)`
- `s.object(shape, config?)`
- `s.optional(schema)`
- `s.union([schemaA, schemaB, ...])`
- `s.discriminatedUnion(key, [schemaA, schemaB, ...])`

Each schema supports:

- `parse(input)` for runtime validation
- `toJSONSchema()` for schema emission

### Example

```ts
import { s } from "mcp-tools";

const SearchInput = s.object({
  query: s.string(),
  page: s.optional(s.number()),
  tags: s.array(s.string()),
  id: s.union([s.string(), s.number()]),
});

const parsed = SearchInput.parse({
  query: "mcp tools",
  tags: ["typescript", "validation"],
  id: "user_123",
});

const jsonSchema = SearchInput.toJSONSchema();
```

### Object policy example

```ts
import { s } from "mcp-tools";

const StrictInput = s.object({
  id: s.string(),
  verbose: s.optional(s.boolean()),
});

const LooseInput = s.object(
  {
    id: s.string(),
  },
  { unknownKeys: "ignore" },
);
```

`object(...)` defaults to `unknownKeys: "strict"`, which rejects undeclared input keys.
Use `{ unknownKeys: "ignore" }` when you want extra keys to be accepted and omitted from the parsed output.

### Discriminated union example

```ts
import { s } from "mcp-tools";

const EntitySchema = s.discriminatedUnion("type", [
  s.object({
    type: s.literal("user"),
    id: s.string(),
    active: s.boolean(),
  }),
  s.object({
    type: s.literal("org"),
    slug: s.string(),
    seats: s.number(),
  }),
]);

const parsed = EntitySchema.parse({
  type: "user",
  id: "user_123",
  active: true,
});
```

### Validation behavior

Current parser behavior:

- primitive schemas validate by JavaScript runtime type
- `s.number()` accepts only finite numbers
- `literal(...)` validates exact equality
- object schemas validate each declared field
- optional object fields are skipped when absent
- `object(...)` defaults to `unknownKeys: "strict"` and rejects undeclared keys
- `object(..., { unknownKeys: "ignore" })` accepts undeclared keys and omits them from the parsed value
- arrays validate each item and collect item-level issues
- union schemas return the first successful branch
- when every union branch fails, the library returns the most relevant branch failure
- discriminated unions dispatch to a branch by discriminator key instead of parsing every branch
- unknown discriminator values return a discriminator-specific failure at the discriminator path
- failures include a `path` and `message`

Example result shapes:

```ts
type ParseSuccess<T> = {
  ok: true;
  value: T;
};

type ParseFailure = {
  ok: false;
  issues: Array<
    | {
        path: Array<string | number>;
        code: "invalid_type";
        expected: "string" | "number" | "boolean" | "array" | "object";
        received: string;
        message: string;
      }
    | {
        path: Array<string | number>;
        code: "invalid_literal";
        expected: string | number | boolean;
        received: unknown;
        message: string;
      }
    | {
        path: Array<string | number>;
        code: "unknown_key";
        key: string;
        message: string;
      }
  >;
};
```

### JSON Schema support

The emitted JSON Schema currently supports:

- `type: "string"`
- `type: "number"`
- `type: "boolean"`
- `type: "array"`
- `type: "object"`
- `const`
- `required`
- `additionalProperties`
- `anyOf`
- `oneOf`

Plain `union(...)` emits `anyOf`, while `discriminatedUnion(...)` emits `oneOf`.
For objects, `unknownKeys: "strict"` emits `additionalProperties: false`, while `unknownKeys: "ignore"` emits `additionalProperties: true`.
That keeps the emitted schema aligned with the runtime validators that exist today.

## Tool definition

Tools are authored with `defineTool(...)`:

```ts
import { defineTool, s } from "mcp-tools";

const weatherTool = defineTool({
  name: "weather_tool",
  description: "Look up weather for a location",
  inputSchema: s.object({
    id: s.string(),
    location: s.object({
      city: s.string(),
      state: s.string(),
      zipCode: s.string(),
    }),
  }),
  async handler(input) {
    return {
      id: input.id,
      data: input.location,
    };
  },
});
```

Right now, `defineTool(...)` is mostly a typed authoring boundary. It does not perform extra runtime assertions by itself, but it gives tool definitions a clean public shape and preserves useful inference for handlers and schemas.

## ToolManager

`ToolManager` is the current registry and invocation surface.

Current behavior:

- register a tool by name
- reject duplicate tool names
- derive and store `inputJSONSchema` during registration
- list registered tool metadata
- invoke tools through validated execution
- validate tool output when `outputSchema` is present

### Registration result

`register(...)` returns metadata on success:

```ts
type RegistrationResult =
  | {
      ok: true;
      registered: {
        name: string;
        description: string;
        inputJSONSchema: JSONSchema;
      };
    }
  | {
      ok: false;
      reason: string;
    };
```

### Call result

`call(...)` returns a normalized result:

```ts
type ToolCallResult<T = unknown> =
  | { ok: true; value: T }
  | {
      ok: false;
      code: "not_found" | "invalid_input" | "handler_error" | "invalid_output";
      reason: string;
      issues?: Issue[];
      formattedIssues?: string;
    };
```

Validation-related failures include both:

- structured `issues`
- a human-readable `formattedIssues` string

## Scripts

The repo currently provides:

```bash
pnpm build
pnpm typecheck
pnpm test
pnpm check
```

Where:

- `build` emits `dist`
- `typecheck` runs `tsc --noEmit`
- `test` runs the Vitest suite
- `check` runs typecheck and tests together

## Known gaps

The working core is in place, but the library is still intentionally incomplete.

Current limitations:

- no enums, nullable values, refinements, or transforms yet
- the structured issue taxonomy is still small and evolving
- no protocol, transport, or server layer
- the package surface is still optimized for local iteration, not polished npm publishing yet

## Design direction

The current architecture suggests a clear order of work:

1. finish the validated tool core
2. improve tests, docs, and package ergonomics
3. add more schema expressiveness where it clearly earns its keep
4. layer MCP method handling and transport on top later instead of bloating the core

The guiding principle is still the same: keep the internals honest, keep the public API small, and make the safe path feel natural for the next developer who uses it.
