/** Category from Sanity (toolCategory). */
export interface ToolCategory {
  title: string;
  slug: { current: string };
  icon?: string | null;
  order?: number | null;
  hidden?: boolean | null;
}

/** FAQ item. */
export interface CalculatorPageFaq {
  question: string;
  answer: string;
}

/** Portable Text block (minimal). */
export type PortableTextBlock = unknown;

/** Calculator page from Sanity (calculatorPage). */
export interface CalculatorPage {
  title: string;
  slug: { current: string };
  calculatorType: string;
  shortDescription?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  noindex?: boolean | null;
  content?: PortableTextBlock[] | null;
  faqs?: CalculatorPageFaq[] | null;
  category: ToolCategory | null;
}
