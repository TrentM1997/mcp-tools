import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: ["verbose"],
    include: ["src/test/**/*.test.ts"],
    exclude: ["dist/**"],
  },
});
