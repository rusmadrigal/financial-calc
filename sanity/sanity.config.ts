import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

// From Vite (import.meta.env) when bundled, or process.env when run in Node
const projectId =
  (import.meta as unknown as { env?: Record<string, string> }).env?.SANITY_PROJECT_ID ??
  process.env.SANITY_PROJECT_ID ??
  "";
const dataset =
  (import.meta as unknown as { env?: Record<string, string> }).env?.SANITY_DATASET ??
  process.env.SANITY_DATASET ??
  "production";
const apiVersion =
  (import.meta as unknown as { env?: Record<string, string> }).env?.SANITY_API_VERSION ??
  process.env.SANITY_API_VERSION ??
  "2024-01-01";

export default defineConfig({
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
