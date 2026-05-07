import { describe, expect, test } from "vitest";
import { createPathErrorMessage } from "../../schema/utils/failures.js";

describe("createPathErrorMessage()", () => {
  test("formats a root-level issue as <root>", () => {
    const message = createPathErrorMessage([
      {
        path: [],
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
        message: "Expected type: number, received type: string",
      },
    ]);

    expect(message).toBe(
      "items[2].price: Expected type: number, received type: string",
    );
  });
});
