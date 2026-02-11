import path from "path";
import dotenv from "dotenv";

// Load .env from sanity folder first, then from repo root (so either location works)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_PROJECT_ID ?? "";
const dataset = process.env.SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2024-01-01";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  vite: (config: Record<string, unknown>) => ({
    ...config,
    // Load .env from sanity folder so SANITY_PROJECT_ID is available in the browser
    envDir: process.cwd(),
    envPrefix: ["VITE_", "SANITY_"],
    define: {
      ...(typeof config.define === "object" && config.define !== null ? config.define : {}),
      "process.env.SANITY_PROJECT_ID": JSON.stringify(projectId),
      "process.env.SANITY_DATASET": JSON.stringify(dataset),
      "process.env.SANITY_API_VERSION": JSON.stringify(apiVersion),
    },
  }),
});
