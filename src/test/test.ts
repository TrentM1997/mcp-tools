import { failureTestInput, weatherToolInput } from "./mockInputs.js";
import { weatherTool, getUser, mockRegistry } from "./mockTools.js";

mockRegistry.register(getUser);

mockRegistry.register(weatherTool);

async function getLocalWeather(location: unknown) {
  return mockRegistry.call("weather_tool", location);
}

const result = await getLocalWeather(failureTestInput);

console.dir(result, { depth: null });
