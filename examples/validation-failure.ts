import { defineTool, s, ToolManager } from "mcp-tools";

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

async function main() {
  const tools = new ToolManager();
  tools.register(weatherTool);

  const result = await tools.call("weather_tool", {
    id: "weather_123",
    location: {
      city: 77,
      zipCode: 90999,
    },
  });

  if (result.ok) {
    console.log(result.value);
    return;
  }

  console.log("code:", result.code);
  console.log("reason:", result.reason);
  console.log("issues:", result.issues);
  console.log("formattedIssues:", result.formattedIssues);
}

void main();
