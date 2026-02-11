import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID ?? "";
const dataset = process.env.SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2024-01-01";
const token = process.env.SANITY_READ_TOKEN ?? undefined;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Client with token for private/draft content (optional). */
export const sanityClientWithToken = token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
      perspective: "previewDrafts",
    })
  : sanityClient;
