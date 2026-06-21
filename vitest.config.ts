import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["__tests__/**/*.unit.test.{ts,tsx}"],
    setupFiles: ["./__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        statements: 40,
        branches: 29,
        functions: 49,
        lines: 40,
      },
      exclude: ["__tests__/**", "src/**/*.d.ts", "src/index.tsx"],
    },
  },
});
