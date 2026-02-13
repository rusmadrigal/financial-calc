import { NextResponse } from "next/server";
import { getCalculatorsList } from "@/lib/calculators/calculatorDataset";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcalclab.com";

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
  const calculators = getCalculatorsList();
  const now = formatDate(new Date());

  const urlEntries = calculators
    .map(
      (entry) =>
        `  <url>
    <loc>${escapeXml(`${BASE_URL}/calculators/${entry.slug}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("\n");

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
