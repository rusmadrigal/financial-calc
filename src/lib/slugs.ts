/**
 * Canonical list of calculator names (must match CalculatorsPage titles).
 * Used to build slug <-> name maps for /calculators/[slug] routes.
 */
const CALCULATOR_NAMES = [
  "Mortgage Calculator",
  "401(k) Calculator",
  "Investment Return Calculator",
  "Credit Card Payoff Calculator",
  "Auto Loan Calculator",
  "Retirement Savings Calculator",
  "Loan Amortization Calculator",
  "Compound Interest Calculator",
  "Debt Consolidation Calculator",
  "Roth IRA Calculator",
  "Personal Loan Calculator",
  "Student Loan Calculator",
] as const;

/** Short names used in Footer etc. -> full calculator name */
const SHORT_NAME_TO_FULL: Record<string, string> = {
  "Credit Card Payoff": "Credit Card Payoff Calculator",
  "Investment Return": "Investment Return Calculator",
  "Loan Calculator": "Personal Loan Calculator",
  "Retirement Savings": "Retirement Savings Calculator",
};

function normalizeToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

const slugToNameMap = new Map<string, string>();
const nameToSlugMap = new Map<string, string>();

CALCULATOR_NAMES.forEach((name) => {
  const slug = normalizeToSlug(name);
  slugToNameMap.set(slug, name);
  nameToSlugMap.set(name, slug);
});

Object.entries(SHORT_NAME_TO_FULL).forEach(([short, full]) => {
  const slug = normalizeToSlug(full);
  slugToNameMap.set(normalizeToSlug(short), full);
  nameToSlugMap.set(short, slug);
});

/** Convert calculator display name to URL slug (e.g. "Mortgage Calculator" -> "mortgage-calculator") */
export function nameToSlug(name: string): string {
  const full = SHORT_NAME_TO_FULL[name] ?? name;
  return nameToSlugMap.get(full) ?? normalizeToSlug(full);
}

/** Convert URL slug to calculator name for CalculatorDetailPage (e.g. "mortgage-calculator" -> "Mortgage Calculator") */
export function slugToName(slug: string): string {
  const normalized = slug
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "");
  return (
    slugToNameMap.get(normalized) ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export { CALCULATOR_NAMES };
