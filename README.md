# MCP Tooling Library

An experimental TypeScript library for exposing validated tools to LLMs by implementing MCP behavior from first principles rather than relying on an MCP SDK.

## Why this exists

This project has two goals:

- deepen understanding of MCP by building the core pieces directly
- produce a library another developer could pick up and use without much explanation

## Decisions made so far

### Audience and design goal

This library is being built as a learning project, but the intended result is still a developer-friendly package for other people to use.

That means the library should:

- feel approachable from the outside
- hide unnecessary protocol ceremony where it makes sense
- stay opinionated enough to be useful without becoming rigid

### Protocol ownership

The current direction is to own the whole stack rather than lean on an MCP SDK.

That includes implementing:

- JSON-RPC handling
- MCP method routing
- transport behavior
- schema validation
- JSON Schema emission
- error formatting and mapping

### Transport choice

`v0` should focus on `Streamable HTTP` rather than `stdio`.

Reasoning:

- `stdio` is already familiar territory
- `Streamable HTTP` is the more interesting area to learn next
- it also pushes the library toward a cleaner separation between core logic and transport concerns

### Tool schema authoring

Tool authors should not need to write raw JSON Schema by hand for normal use.

Instead, the library should provide a friendlier schema API and derive the MCP-facing JSON Schema from that definition.

This makes the library responsible for:

- runtime validation
- schema representation
- JSON Schema output for MCP clients

### Scope of the schema system

Building a small schema system is considered part of the core work, not an extra burden.

At minimum, common JSON-shaped tool inputs should feel natural to define.

## Open questions

These are still being worked through:

- whether output validation should be optional per tool
- how strict handler return values should be before normalization into MCP responses
- how much of the MCP HTTP/session model should land in `v0`

## Working principle

Build the internals from first principles, but make the external API feel small, clear, and practical.
