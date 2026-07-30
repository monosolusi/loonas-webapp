import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Node environment only: every suite here covers pure functions — parsers, the
    // price preview and payload construction. No DOM, no Clerk, no network.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
