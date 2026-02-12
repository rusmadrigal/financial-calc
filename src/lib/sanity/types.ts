/** Category from Sanity (toolCategory). */
export interface ToolCategory {
  title: string;
  slug: { current: string };
  icon?: string | null;
  order?: number | null;
  hidden?: boolean | null;
}

/** Portable Text span (inline). */
export interface PortableTextSpan {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
}

/** Link annotation (mark definition). */
export interface PortableTextLinkMark {
  _key: string;
  _type: string;
  href?: string;
  blank?: boolean;
}

/** Portable Text block (block content from Sanity). */
export interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: PortableTextLinkMark[];
}

/** FAQ item with rich-text answer. */
export interface CalculatorPageFaq {
  question: string;
  answer: PortableTextBlock[];
}

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
  howItWorks?: PortableTextBlock[] | null;
  sources?: PortableTextBlock[] | null;
  faqs?: CalculatorPageFaq[] | null;
  category: ToolCategory | null;
}
