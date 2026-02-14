/**
 * Federal income tax (simplified): taxable income, filing status → tax, effective rate, bracket.
 * Uses simplified 2024-style single/married brackets for illustration.
 */

export type FilingStatus = "single" | "married";

export interface FederalTaxInput {
  taxableIncome: number;
  filingStatus: FilingStatus;
}

/** Simplified bracket: max of bracket, rate for that portion. */
const BRACKETS_SINGLE_2024: { max: number; rate: number }[] = [
  { max: 11600, rate: 0.1 },
  { max: 47150, rate: 0.12 },
  { max: 100525, rate: 0.22 },
  { max: 191950, rate: 0.24 },
  { max: 243725, rate: 0.32 },
  { max: 609350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

const BRACKETS_MARRIED_2024: { max: number; rate: number }[] = [
  { max: 23200, rate: 0.1 },
  { max: 94300, rate: 0.12 },
  { max: 201050, rate: 0.22 },
  { max: 383900, rate: 0.24 },
  { max: 487450, rate: 0.32 },
  { max: 731200, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

export interface FederalTaxOutput {
  taxableIncome: number;
  tax: number;
  effectiveRatePercent: number;
  marginalRatePercent: number;
  bracketBreakdown: { bracket: string; rate: number; amount: number }[];
}

function taxFromBrackets(
  income: number,
  brackets: { max: number; rate: number }[],
): number {
  let tax = 0;
  let prevMax = 0;
  for (const b of brackets) {
    if (income <= prevMax) break;
    const taxableInBracket = Math.min(income, b.max) - prevMax;
    tax += taxableInBracket * b.rate;
    prevMax = b.max;
  }
  return tax;
}

function getMarginalRate(
  income: number,
  brackets: { max: number; rate: number }[],
): number {
  for (const b of brackets) {
    if (income < b.max) return b.rate * 100;
  }
  return brackets[brackets.length - 1].rate * 100;
}

export function calculateFederalIncomeTax(
  input: FederalTaxInput,
): FederalTaxOutput {
  const income = Math.max(0, input.taxableIncome);
  const brackets =
    input.filingStatus === "married"
      ? BRACKETS_MARRIED_2024
      : BRACKETS_SINGLE_2024;

  const tax = taxFromBrackets(income, brackets);
  const effectiveRatePercent = income > 0 ? (tax / income) * 100 : 0;
  const marginalRatePercent = getMarginalRate(income, brackets);

  const bracketBreakdown: { bracket: string; rate: number; amount: number }[] =
    [];
  let prevMax = 0;
  for (const b of brackets) {
    if (income <= prevMax) break;
    const taxableInBracket = Math.min(income, b.max) - prevMax;
    bracketBreakdown.push({
      bracket: `Up to $${b.max === Infinity ? "∞" : b.max.toLocaleString()}`,
      rate: b.rate * 100,
      amount: Math.round(taxableInBracket * b.rate * 100) / 100,
    });
    prevMax = b.max;
  }

  return {
    taxableIncome: income,
    tax: Math.round(tax * 100) / 100,
    effectiveRatePercent: Math.round(effectiveRatePercent * 100) / 100,
    marginalRatePercent,
    bracketBreakdown,
  };
}
