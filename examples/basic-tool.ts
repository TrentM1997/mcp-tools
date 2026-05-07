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
      name: input.verbose ? "Trent (verbose)" : "Trent",
    };
  },
});

async function main() {
  const tools = new ToolManager();
  const registration = tools.register(getUser);

  if (!registration.ok) {
    throw new Error(registration.reason);
  }

  const result = await tools.call("get_user", {
    id: "user_123",
    verbose: true,
  });

  if (!result.ok) {
    console.error(result.code, result.reason, result.issues);
    return;
  }

  console.log(result.value);
}

void main();
