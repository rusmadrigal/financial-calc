/**
 * Compound interest: future value and yearly breakdown.
 * Optional monthly contribution. Rate as percent; compound frequency monthly or yearly.
 */

export interface CompoundInterestInput {
  principal: number;
  annualRatePercent: number;
  years: number;
  /** Optional monthly contribution */
  monthlyContribution: number;
  /** "monthly" or "yearly" compounding */
  compoundFrequency: "monthly" | "yearly";
}

export interface CompoundInterestYearRow {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface CompoundInterestOutput {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: CompoundInterestYearRow[];
}

export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestOutput {
  const principal = Math.max(0, input.principal);
  const annualRate = Math.max(0, input.annualRatePercent) / 100;
  const years = Math.max(1, Math.min(50, Math.round(input.years)));
  const monthlyContribution = Math.max(0, input.monthlyContribution ?? 0);
  const isMonthly = input.compoundFrequency === "monthly";

  const monthlyRate = annualRate / 12;
  const yearlyBreakdown: CompoundInterestYearRow[] = [];
  let balance = principal;
  let totalContributions = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    const periods = isMonthly ? 12 : 1;
    const contribPerPeriod = isMonthly
      ? monthlyContribution
      : monthlyContribution * 12;
    let yearContrib = 0;

    for (let i = 0; i < periods; i++) {
      balance += contribPerPeriod;
      totalContributions += contribPerPeriod;
      yearContrib += contribPerPeriod;
      balance *= isMonthly ? 1 + monthlyRate : 1 + annualRate;
    }
    const interest = balance - startBalance - yearContrib;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(yearContrib * 100) / 100,
      interest: Math.round(interest * 100) / 100,
    });
  }

  const totalInterest = Math.max(0, balance - principal - totalContributions);

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}
