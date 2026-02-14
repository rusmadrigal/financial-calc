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
  | "Taxes"
  | "Savings"
  | "Real Estate";

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
  "Savings",
  "Real Estate",
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
  {
    title: "Student Loan Calculator",
    slug: "student-loan-calculator",
    category: "Loans",
    complexity: "Simple",
    description:
      "Estimate monthly payments, total interest, and payoff timeline for student loans.",
    features: ["Amortization", "Charts", "Export"],
    popularity: 78,
    componentType: "studentLoan",
    iconKey: "GraduationCap",
  },
  {
    title: "401k Calculator",
    slug: "401k-calculator",
    category: "Retirement",
    complexity: "Simple",
    description:
      "Project 401(k) growth with contributions, employer match, and expected return.",
    features: ["Employer Match", "Charts", "Export"],
    popularity: 88,
    componentType: "calculator401k",
    iconKey: "PiggyBank",
  },
  {
    title: "IRA Calculator",
    slug: "ira-calculator",
    category: "Retirement",
    complexity: "Simple",
    description:
      "Project traditional IRA balance growth with annual contributions and return assumptions.",
    features: ["Yearly Breakdown", "Charts", "Export"],
    popularity: 76,
    componentType: "ira",
    iconKey: "PiggyBank",
  },
  {
    title: "Roth IRA Calculator",
    slug: "roth-ira-calculator",
    category: "Retirement",
    complexity: "Simple",
    description:
      "Project Roth IRA balance growth; qualified withdrawals are tax-free.",
    features: ["Yearly Breakdown", "Charts", "Export"],
    popularity: 77,
    componentType: "rothIra",
    iconKey: "PiggyBank",
  },
  {
    title: "Retirement Calculator",
    slug: "retirement-calculator",
    category: "Retirement",
    complexity: "Advanced",
    description:
      "Project savings to retirement and drawdown; see if your plan can meet target income.",
    features: ["Accumulation & Drawdown", "Charts", "Export"],
    popularity: 85,
    componentType: "retirement",
    iconKey: "TrendingUp",
  },
  {
    title: "Social Security Calculator",
    slug: "social-security-calculator",
    category: "Retirement",
    complexity: "Simple",
    description:
      "Estimate Social Security benefits by claiming age and project yearly benefits.",
    features: ["Claiming Age", "Charts", "Export"],
    popularity: 82,
    componentType: "socialSecurity",
    iconKey: "Landmark",
  },
  {
    title: "Annuity Payout Calculator",
    slug: "annuity-payout-calculator",
    category: "Retirement",
    complexity: "Simple",
    description:
      "Calculate fixed-period annuity payments from principal, rate, and term.",
    features: ["Monthly/Annual", "Schedule", "Charts", "Export"],
    popularity: 68,
    componentType: "annuityPayout",
    iconKey: "CircleDollarSign",
  },
  {
    title: "Compound Interest Calculator",
    slug: "compound-interest-calculator",
    category: "Investing",
    complexity: "Simple",
    description:
      "Project growth with compound interest and optional monthly contributions.",
    features: ["Contributions", "Charts", "Export"],
    popularity: 90,
    componentType: "compoundInterest",
    iconKey: "TrendingUp",
  },
  {
    title: "Investment Return Calculator",
    slug: "investment-return-calculator",
    category: "Investing",
    complexity: "Simple",
    description:
      "Project investment growth with initial amount and monthly contributions.",
    features: ["Contributions", "Charts", "Export"],
    popularity: 88,
    componentType: "investmentReturn",
    iconKey: "TrendingUp",
  },
  {
    title: "Dividend Calculator",
    slug: "dividend-calculator",
    category: "Investing",
    complexity: "Simple",
    description:
      "Estimate dividend income over time with optional reinvestment.",
    features: ["Reinvest", "Charts", "Export"],
    popularity: 75,
    componentType: "dividend",
    iconKey: "Percent",
  },
  {
    title: "Stock Profit Calculator",
    slug: "stock-profit-calculator",
    category: "Investing",
    complexity: "Simple",
    description:
      "Calculate profit or loss from stock trades with buy/sell price, shares, and commissions.",
    features: ["Profit/Loss", "Return %", "Export"],
    popularity: 78,
    componentType: "stockProfit",
    iconKey: "TrendingUp",
  },
  {
    title: "Savings Calculator",
    slug: "savings-calculator",
    category: "Savings",
    complexity: "Simple",
    description:
      "Project savings growth with initial deposit and regular contributions.",
    features: ["Contributions", "Charts", "Export"],
    popularity: 85,
    componentType: "savings",
    iconKey: "PiggyBank",
  },
  {
    title: "CD Calculator",
    slug: "cd-calculator",
    category: "Savings",
    complexity: "Simple",
    description:
      "Estimate certificate of deposit maturity value and interest earned.",
    features: ["APY", "Maturity", "Export"],
    popularity: 72,
    componentType: "cd",
    iconKey: "Landmark",
  },
  {
    title: "High Yield Savings Calculator",
    slug: "high-yield-savings-calculator",
    category: "Savings",
    complexity: "Simple",
    description:
      "Project growth in a high-yield savings account with compound interest.",
    features: ["APY", "Charts", "Export"],
    popularity: 80,
    componentType: "highYieldSavings",
    iconKey: "CircleDollarSign",
  },
  {
    title: "HELOC Calculator",
    slug: "heloc-calculator",
    category: "Real Estate",
    complexity: "Simple",
    description:
      "Estimate payments and interest for a Home Equity Line of Credit.",
    features: ["Draw Period", "Repayment", "Export"],
    popularity: 74,
    componentType: "heloc",
    iconKey: "Home",
  },
  {
    title: "Home Affordability Calculator",
    slug: "home-affordability-calculator",
    category: "Real Estate",
    complexity: "Simple",
    description:
      "See how much home you can afford based on income, debts, DTI, and loan terms.",
    features: ["DTI", "Max Home Price", "Export"],
    popularity: 80,
    componentType: "homeAffordability",
    iconKey: "Home",
  },
  {
    title: "Down Payment Calculator",
    slug: "down-payment-calculator",
    category: "Real Estate",
    complexity: "Simple",
    description:
      "Calculate down payment amount and how long to save with monthly savings.",
    features: ["Savings Goal", "Months to Goal", "Export"],
    popularity: 78,
    componentType: "downPayment",
    iconKey: "DollarSign",
  },
  {
    title: "Property Tax Calculator",
    slug: "property-tax-calculator",
    category: "Real Estate",
    complexity: "Simple",
    description:
      "Estimate annual and monthly property tax from assessed value and rate.",
    features: ["Exemptions", "Monthly Equivalent", "Export"],
    popularity: 72,
    componentType: "propertyTax",
    iconKey: "Receipt",
  },
  {
    title: "Closing Cost Calculator",
    slug: "closing-cost-calculator",
    category: "Real Estate",
    complexity: "Simple",
    description:
      "Break down closing costs: origination, points, appraisal, title, and more.",
    features: ["Line Items", "Export PDF", "Export Excel"],
    popularity: 75,
    componentType: "closingCosts",
    iconKey: "Receipt",
  },
  {
    title: "Mortgage APR Calculator",
    slug: "mortgage-apr-calculator",
    category: "Real Estate",
    complexity: "Simple",
    description:
      "Compute true APR including closing costs for mortgage comparison.",
    features: ["APR vs Stated Rate", "Export"],
    popularity: 76,
    componentType: "mortgageAPR",
    iconKey: "Percent",
  },
];

/** Returns all calculators (only those implemented and in registry). */
export function getCalculatorsList(): CalculatorEntry[] {
  return [...CALCULATORS];
}

/** Get a single calculator by slug (for embed viewer). */
export function getCalculatorBySlug(slug: string): CalculatorEntry | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

/**
 * Returns the number of registered calculators per category.
 * Server-safe; uses the same source as getCalculatorsList().
 */
export function getCategoryCounts(): Record<CalculatorCategory, number> {
  const list = getCalculatorsList();
  const counts: Record<CalculatorCategory, number> = {
    Investing: 0,
    Debt: 0,
    Loans: 0,
    Retirement: 0,
    Taxes: 0,
    Savings: 0,
    "Real Estate": 0,
  };
  for (const entry of list) {
    counts[entry.category] = (counts[entry.category] ?? 0) + 1;
  }
  return counts;
}
