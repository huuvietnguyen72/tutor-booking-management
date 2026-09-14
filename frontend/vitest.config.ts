import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/**"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
});
