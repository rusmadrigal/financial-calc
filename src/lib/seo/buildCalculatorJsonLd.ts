import type { CalculatorPage, PortableTextBlock } from "@/lib/sanity/types";
import { CANONICAL_BASE, getCanonicalUrl } from "@/lib/seo/canonical";

/** JSON-LD WebSite schema. */
interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
}

/** JSON-LD Organization schema. */
interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
}

/** JSON-LD WebPage schema. */
interface WebPageSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  isPartOf: { "@id": string };
  about: { "@id": string };
}

/** JSON-LD SoftwareApplication schema. */
interface SoftwareApplicationSchema {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  "@id": string;
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  description: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  publisher: { "@id": string };
}

/** JSON-LD BreadcrumbList schema. */
interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

/** JSON-LD FAQPage schema. */
interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export type CalculatorJsonLdItem =
  | WebSiteSchema
  | OrganizationSchema
  | WebPageSchema
  | SoftwareApplicationSchema
  | BreadcrumbListSchema
  | FAQPageSchema;

/**
 * Converts Portable Text blocks to a single plain-text string.
 * Extracts children.text from each block; no HTML.
 */
function portableTextToPlainText(
  blocks: PortableTextBlock[] | null | undefined,
): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const parts: string[] = [];
  for (const block of blocks) {
    const children = block.children;
    if (!Array.isArray(children)) continue;
    for (const child of children) {
      if (typeof child.text === "string" && child.text.length > 0) {
        parts.push(child.text);
      }
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Builds an array of JSON-LD schema objects for a calculator page.
 * Dynamic per calculator; uses canonical base from @/lib/seo/canonical
 */
export function buildCalculatorJsonLd(
  page: CalculatorPage,
  slug: string,
): CalculatorJsonLdItem[] {
  const canonical = getCanonicalUrl(`/calculators/${slug}`);
  const name = page.metaTitle ?? page.title;
  const description = page.metaDescription ?? page.shortDescription ?? "";

  const result: CalculatorJsonLdItem[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${CANONICAL_BASE}/#website`,
      url: `${CANONICAL_BASE}/`,
      name: "SmartCalcLab",
    } satisfies WebSiteSchema,
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${CANONICAL_BASE}/#organization`,
      name: "SmartCalcLab",
      url: `${CANONICAL_BASE}/`,
    } satisfies OrganizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name,
      description,
      isPartOf: { "@id": `${CANONICAL_BASE}/#website` },
      about: { "@id": `${canonical}#software` },
    } satisfies WebPageSchema,
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${canonical}#software`,
      name: page.title,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: canonical,
      description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: { "@id": `${CANONICAL_BASE}/#organization` },
    } satisfies SoftwareApplicationSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${CANONICAL_BASE}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Calculators",
          item: `${CANONICAL_BASE}/calculators`,
        },
        { "@type": "ListItem", position: 3, name: page.title },
      ],
    } satisfies BreadcrumbListSchema,
  ];

  if (page.faqs && page.faqs.length > 0) {
    result.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question" as const,
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: portableTextToPlainText(faq.answer),
        },
      })),
    } satisfies FAQPageSchema);
  }

  return result;
}
