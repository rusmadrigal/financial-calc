/**
 * High-yield savings: same as savings — initial + monthly contributions, compounded monthly.
 */

export interface HighYieldSavingsInput {
  initialBalance: number;
  monthlyContribution: number;
  apyPercent: number;
  years: number;
}

export interface HighYieldSavingsYearRow {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface HighYieldSavingsOutput {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: HighYieldSavingsYearRow[];
}

export function calculateHighYieldSavings(
  input: HighYieldSavingsInput,
): HighYieldSavingsOutput {
  const initial = Math.max(0, input.initialBalance);
  const monthly = Math.max(0, input.monthlyContribution);
  const years = Math.max(1, Math.min(50, Math.round(input.years)));
  const apy = Math.max(0, input.apyPercent) / 100;
  const monthlyRate = apy / 12;

  const yearlyBreakdown: HighYieldSavingsYearRow[] = [];
  let balance = initial;
  let totalContributions = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    let yearContrib = 0;
    for (let m = 0; m < 12; m++) {
      balance += monthly;
      yearContrib += monthly;
      totalContributions += monthly;
      balance *= 1 + monthlyRate;
    }
    const interest = balance - startBalance - yearContrib;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(yearContrib * 100) / 100,
      interest: Math.round(interest * 100) / 100,
    });
  }

  const totalInterest = Math.max(0, balance - initial - totalContributions);

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}
