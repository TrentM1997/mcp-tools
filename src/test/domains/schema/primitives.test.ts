import { describe, expect, test } from "vitest";
import { createPathErrorMessage } from "../../../schema/utils/error/failures.js";

describe("createPathErrorMessage()", () => {
  test("formats a root-level issue as <root>", () => {
    const message = createPathErrorMessage([
      {
        path: [],
        code: "invalid_type",
        expected: "string",
        received: "number",
        message: "Expected type: string, received type: number",
      },
    ]);

    expect(message).toBe(
      "<root>: Expected type: string, received type: number",
    );
  });

  test("formats array indexes inside nested paths", () => {
    const message = createPathErrorMessage([
      {
        path: ["items", 2, "price"],
        code: "invalid_type",
        expected: "number",
        received: "string",
        message: "Expected type: number, received type: string",
      },
    ]);

    expect(message).toBe(
      "items[2].price: Expected type: number, received type: string",
    );
  });
});
