import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCalculatorPageBySlug } from "@/lib/sanity/fetchCalculatorPageBySlug";
import { CalculatorDetailShell } from "@/components/calculators/shell/CalculatorDetailShell";

const CANONICAL_BASE = "https://www.smartcalclab.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchCalculatorPageBySlug(slug);
  if (!page) return { title: "Calculator" };

  const title = page.metaTitle ?? page.title;
  const description =
    page.metaDescription ?? page.shortDescription ?? undefined;
  const robots = page.noindex
    ? { index: false as const, follow: false as const }
    : undefined;

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: `${CANONICAL_BASE}/calculators/${slug}`,
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await fetchCalculatorPageBySlug(slug);
  if (!page) notFound();

  return (
    <CalculatorDetailShell
      title={page.title}
      shortDescription={page.shortDescription}
      content={page.content}
      faqs={page.faqs}
      calculatorType={page.calculatorType}
    />
  );
}
