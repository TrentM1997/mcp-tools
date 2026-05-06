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

export { getUser };
