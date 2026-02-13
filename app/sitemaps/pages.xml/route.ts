import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcalclab.com";

/** Static pages only. /embed and /states-demo excluded. */
const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
}> = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/calculators", priority: 0.9, changefreq: "weekly" },
  { path: "/overview", priority: 0.5, changefreq: "monthly" },
  { path: "/about", priority: 0.5, changefreq: "monthly" },
  { path: "/design-system", priority: 0.4, changefreq: "monthly" },
  { path: "/contact", priority: 0.5, changefreq: "monthly" },
  { path: "/terms", priority: 0.2, changefreq: "yearly" },
  { path: "/privacy", priority: 0.2, changefreq: "yearly" },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function GET() {
  const now = formatDate(new Date());

  const urlEntries = STATIC_PAGES.map(
    (page) =>
      `  <url>
    <loc>${escapeXml(`${BASE_URL}${page.path}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
