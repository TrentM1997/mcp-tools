import { ToolManager } from "../../index.js";
import { beforeEach, describe, expect, test } from "vitest";
import {
  failureTestInput,
  weatherBloomington,
  weatherClinton,
} from "../mocks/mockInputs.js";
import {
  getUser,
  weatherTool,
  invalidOutputTool,
  throwingTool,
} from "../mocks/mockTools.js";

describe("ToolManager", () => {
  let manager: ToolManager;

  beforeEach(() => {
    manager = new ToolManager();
  });

  describe("register()", () => {
    test("Returns ok: true and tool metadata when registering a valid tool", () => {
      const tool = manager.register(weatherTool);

      expect(tool).toEqual({
        ok: true,
        registered: {
          name: weatherTool.name,
          description: weatherTool.description,
          inputJSONSchema: weatherTool.inputSchema.toJSONSchema(),
        },
      });
    });

    test("Returns ok:false, and reason for failure when a tool has already been registered with the same name property", () => {
      manager.register(weatherTool);
      const duplicateTool = manager.register(weatherTool);

      expect(duplicateTool).toEqual({
        ok: false,
        reason: `tool already registered with name ${weatherTool.name}`,
      });
    });
  });

  describe("list()", () => {
    test("Returns registered tool metadata without exposing execution internals", () => {
      manager.register(getUser);
      manager.register(weatherTool);

      const tools = manager.list();

      expect(tools).toEqual([
        {
          name: getUser.name,
          description: getUser.description,
          inputJSONSchema: getUser.inputSchema.toJSONSchema(),
        },
        {
          name: weatherTool.name,
          description: weatherTool.description,
          inputJSONSchema: weatherTool.inputSchema.toJSONSchema(),
        },
      ]);
      expect(tools[0]).not.toHaveProperty("handler");
      expect(tools[0]).not.toHaveProperty("inputSchema");
    });
  });

  describe("call()", () => {
    test("Returns ok: true and the handler result when a registered tool succeeds", async () => {
      manager.register(weatherTool);

      const result = await manager.call(weatherTool.name, weatherBloomington);

      expect(result).toEqual({
        ok: true,
        value: {
          id: weatherBloomington.id,
          data: weatherBloomington.location,
        },
      });
    });

    test("Returns not_found when a tool has not been registered", async () => {
      const result = await manager.call("missing_tool", weatherClinton);

      expect(result).toEqual({
        ok: false,
        code: "not_found",
        reason: "Could not find tool named: missing_tool",
      });
    });

    test("Returns invalid_input with structured issues and formatted issue text", async () => {
      manager.register(weatherTool);

      const result = await manager.call(weatherTool.name, failureTestInput);

      expect(result).toMatchObject({
        ok: false,
        code: "invalid_input",
        reason: "Tool input failed validation",
        formattedIssues:
          "location.city: Expected type: string, received type: number; " +
          "location.state: Expected type: string, received type: undefined; " +
          "location.zipCode: Expected type: string, received type: number",
      });

      if (!result.ok && result.code === "invalid_input") {
        expect(result.issues).toEqual([
          {
            path: ["location", "city"],
            message: "Expected type: string, received type: number",
          },
          {
            path: ["location", "state"],
            message: "Expected type: string, received type: undefined",
          },
          {
            path: ["location", "zipCode"],
            message: "Expected type: string, received type: number",
          },
        ]);
      }
    });

    test("Returns handler_error when a tool handler throws during execution", async () => {
      manager.register(throwingTool);

      const result = await manager.call(throwingTool.name, { id: "tool-123" });

      expect(result).toEqual({
        ok: false,
        code: "handler_error",
        reason: "Tool Handler threw during execution",
      });
    });

    test("Returns invalid_output when a handler returns a value that fails output validation", async () => {
      manager.register(invalidOutputTool);

      const result = await manager.call(invalidOutputTool.name, {
        id: "tool-123",
      });

      expect(result).toMatchObject({
        ok: false,
        code: "invalid_output",
        reason: "Tool output failed validation",
        formattedIssues: "count: Expected type: number, received type: string",
      });

      if (!result.ok && result.code === "invalid_output") {
        expect(result.issues).toEqual([
          {
            path: ["count"],
            message: "Expected type: number, received type: string",
          },
        ]);
      }
    });
  });
});
