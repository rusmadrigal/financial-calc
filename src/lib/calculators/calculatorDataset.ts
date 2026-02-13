/**
 * Central dataset for calculators listing (/calculators).
 * Single source of truth: only calculators that exist in the registry and can render.
 * Slug must match Sanity slug.current (e.g. mortgage-calculator) for /calculators/[slug] to resolve.
 *
 * Popularity: no real analytics yet; fallback = explicit order (higher number = more "popular" for sort).
 */

import type { CalculatorType } from "@/components/calculators/registry/calculatorRegistry";

export type CalculatorCategory =
  | "Investing"
  | "Debt"
  | "Loans"
  | "Retirement"
  | "Taxes";

export type CalculatorComplexity = "Simple" | "Advanced";

export interface CalculatorEntry {
  /** Display title */
  title: string;
  /** URL slug (no leading slash). Must match Sanity slug.current for detail page. */
  slug: string;
  /** Filter: Category */
  category: CalculatorCategory;
  /** Filter: Complexity */
  complexity: CalculatorComplexity;
  /** Short description for card */
  description: string;
  /** Feature chips for card (e.g. "Amortization Table", "Export PDF") */
  features: string[];
  /**
   * Fallback for "Sort by Popular": higher = more popular.
   * When real analytics exist, replace with actual metric.
   */
  popularity: number;
  /** Registry key (must match getCalculatorComponent). */
  componentType: CalculatorType;
  /** Icon key for mapping to Lucide icon in the view */
  iconKey: string;
}

/** Categories for filter UI. "All" is handled in the view. */
export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  "Investing",
  "Debt",
  "Loans",
  "Retirement",
  "Taxes",
];

export const COMPLEXITY_LEVELS: CalculatorComplexity[] = ["Simple", "Advanced"];

/**
 * All calculators that exist in the project and can be opened.
 * Order here = default (popular) order when sort is "Popular".
 */
const CALCULATORS: CalculatorEntry[] = [
  {
    title: "Mortgage Calculator",
    slug: "mortgage-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Calculate monthly payments, total interest, and amortization schedules for home loans with customizable terms.",
    features: ["Amortization Table", "Export PDF", "Charts"],
    popularity: 100,
    componentType: "mortgage",
    iconKey: "Home",
  },
  {
    title: "Refinance Calculator",
    slug: "refinance-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Compare your current loan to a new one. See monthly savings, break-even, and total interest difference.",
    features: ["Break-even", "Schedules", "Export"],
    popularity: 90,
    componentType: "refinance",
    iconKey: "RefreshCw",
  },
  {
    title: "Rent vs Buy Calculator",
    slug: "rent-vs-buy-calculator",
    category: "Loans",
    complexity: "Advanced",
    description:
      "Compare total cost of renting vs buying over time with appreciation, rent growth, and opportunity cost.",
    features: ["Yearly Breakdown", "Charts", "Export"],
    popularity: 85,
    componentType: "rentVsBuy",
    iconKey: "Building2",
  },
  {
    title: "Loan Amortization Calculator",
    slug: "loan-amortization-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Generate detailed payment schedules showing principal and interest breakdown for any loan type.",
    features: ["Payment Schedule", "Charts", "Export"],
    popularity: 88,
    componentType: "amortization",
    iconKey: "Receipt",
  },
  {
    title: "Auto Loan Calculator",
    slug: "auto-loan-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Compare auto financing options with trade-in values, down payments, and APR calculations.",
    features: ["Trade-in Value", "Schedule", "Export"],
    popularity: 82,
    componentType: "autoLoan",
    iconKey: "Car",
  },
  {
    title: "Car Lease Calculator",
    slug: "car-lease-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Estimate monthly lease payment with money factor, residual value, and fees.",
    features: ["Depreciation", "Finance Fee", "Export"],
    popularity: 70,
    componentType: "carLease",
    iconKey: "Car",
  },
  {
    title: "Personal Loan Calculator",
    slug: "personal-loan-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Calculate monthly payments and total interest for personal loans with fixed rates.",
    features: ["Fixed Rates", "APR", "Charts"],
    popularity: 80,
    componentType: "personalLoan",
    iconKey: "DollarSign",
  },
  {
    title: "Credit Card Payoff Calculator",
    slug: "credit-card-payoff-calculator",
    category: "Debt",
    complexity: "Simple",
    description:
      "Determine payoff timeline and total interest with minimum payments vs. accelerated strategies.",
    features: ["Payoff Strategy", "Charts", "Export"],
    popularity: 92,
    componentType: "creditCardPayoff",
    iconKey: "CreditCard",
  },
  {
    title: "Debt Snowball Calculator",
    slug: "debt-snowball-calculator",
    category: "Debt",
    complexity: "Simple",
    description:
      "Pay smallest balance first. See payoff order, months to debt-free, and total interest.",
    features: ["Payoff Order", "Extra Payment", "Export"],
    popularity: 75,
    componentType: "debtSnowball",
    iconKey: "Snowflake",
  },
  {
    title: "Debt Avalanche Calculator",
    slug: "debt-avalanche-calculator",
    category: "Debt",
    complexity: "Simple",
    description:
      "Pay highest APR first. See payoff order, months to debt-free, and total interest.",
    features: ["Payoff Order", "Extra Payment", "Export"],
    popularity: 74,
    componentType: "debtAvalanche",
    iconKey: "TrendingDown",
  },
];

/** Returns all calculators (only those implemented and in registry). */
export function getCalculatorsList(): CalculatorEntry[] {
  return [...CALCULATORS];
}
