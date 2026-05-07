import { defineTool, s } from "../../../index.js";
import { WeatherToolInputSchema } from "../schema/mockSchemas.js";

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

const invalidOutputTool = defineTool({
  name: "invalid_output_tool",
  description: "Returns an invalid output shape on purpose",
  inputSchema: s.object({
    id: s.string(),
  }),

  outputSchema: s.object({
    id: s.string(),
    count: s.number(),
  }),
  async handler(input) {
    return {
      id: input.id,
      count: "not-a-number",
    } as unknown as {
      id: string;
      count: number;
    };
  },
});

const throwingTool = defineTool({
  name: "throwing_tool",
  description: "Always throws during handler execution",
  inputSchema: s.object({
    id: s.string(),
  }),
  async handler() {
    throw new Error("boom");
  },
});

export { getUser, weatherTool, invalidOutputTool, throwingTool };
