/**
 * HSA: current balance, annual contribution, growth %, years → yearly breakdown.
 * Simplified: annual contribution at start of year, growth applied.
 */

export interface HSAInput {
  currentBalance: number;
  annualContribution: number;
  growthPercent: number;
  years: number;
}

export interface HSAYearRow {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface HSAOutput {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: HSAYearRow[];
}

export function calculateHSA(input: HSAInput): HSAOutput {
  const initial = Math.max(0, input.currentBalance);
  const annual = Math.max(0, input.annualContribution);
  const rate = Math.max(0, input.growthPercent) / 100;
  const years = Math.max(1, Math.min(40, Math.round(input.years)));

  const yearlyBreakdown: HSAYearRow[] = [];
  let balance = initial;
  let totalContributions = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    balance += annual;
    totalContributions += annual;
    balance *= 1 + rate;
    const interest = balance - startBalance - annual;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: annual,
      interest: Math.round(interest * 100) / 100,
    });
  }

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest:
      Math.round(Math.max(0, balance - initial - totalContributions) * 100) /
      100,
    yearlyBreakdown,
  };
}
