import { defineTool, s, ToolManager } from "mcp-tools";
import { WeatherToolInputSchema } from "./mockSchemas.js";

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

const weatherTool = defineTool({
  name: "weather_tool",
  description: "Fetch a user by ID",
  inputSchema: WeatherToolInputSchema,
  async handler(input) {
    return { id: input.id, data: input.location };
  },
});

const mockRegistry = new ToolManager();

export { getUser, weatherTool, mockRegistry };
