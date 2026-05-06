import { defineTool } from "./config/defineTool.js";
import { createRegistry } from "./config/createRegistry.js";
import { s } from "../schema/index.js";
import { getUser } from "./tools/mockRegisteredTools.js";

const ToolInputSchema = s.object({
  methods: s.object({
    placeholder: s.literal("Function Definition"),
  }),
});

const input = {
  name: "Tool One",
  description: "First time defining a tool",
  inputSchema: ToolInputSchema,
  handler: (input: any) => {
    console.log(input);
  },
};

const tool = defineTool(input);

const registry = createRegistry();

registry.register(tool);

registry.register(getUser);

console.dir(registry.get("get_user"), {
  depth: null,
});
