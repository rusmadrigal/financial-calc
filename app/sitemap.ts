import type { MetadataRoute } from "next";
import { getCalculatorsList } from "@/lib/calculators/calculatorDataset";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcalclab.com";

/** Static pages: path, priority, changeFrequency. /embed and /states-demo are excluded. */
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly" },
  { path: "/overview", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/design-system", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    (route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );

  const calculators = getCalculatorsList();
  const calculatorEntries: MetadataRoute.Sitemap = calculators.map(
    (entry) => ({
      url: `${BASE_URL}/calculators/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  return [...staticEntries, ...calculatorEntries];
}
