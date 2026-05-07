import { ToolManager } from "mcp-tools";
import { expect, test, describe, it } from "vitest";
import { weatherTool } from "../mocks/mockTools.js";

//TODO: test the public facing API for ToolManager

describe("ToolManager", () => {
  const manager = new ToolManager();

  manager.register(weatherTool);

  describe("registerTool() ", () => {
    test("Returns ok:false when a tool has already been registered with the same name property", () => {
      const duplicateTool = manager.register(weatherTool);

      expect(duplicateTool.ok === false && duplicateTool.reason);
    });
  });
});
