/**
 * Roth IRA calculator: balance growth (tax-free). Same math as traditional IRA.
 * All amounts USD; rate as percent. Compounded monthly.
 */

export interface RothIRAInput {
  currentBalance: number;
  annualContribution: number;
  years: number;
  expectedReturnPercent: number;
}

export interface RothIRAYearRow {
  year: number;
  balance: number;
  contributions: number;
  earnings: number;
}

export interface RothIRAOutput {
  finalBalance: number;
  totalContributions: number;
  totalEarnings: number;
  yearlyBreakdown: RothIRAYearRow[];
}

export function calculateRothIRA(input: RothIRAInput): RothIRAOutput {
  const currentBalance = Math.max(0, input.currentBalance);
  const annualContribution = Math.max(0, input.annualContribution);
  const years = Math.max(1, Math.min(50, Math.round(input.years)));
  const annualReturn = Math.max(0, input.expectedReturnPercent) / 100;
  const monthlyReturn = annualReturn / 12;

  const yearlyBreakdown: RothIRAYearRow[] = [];
  let balance = currentBalance;
  let totalContributions = 0;

  for (let y = 1; y <= years; y++) {
    const monthlyContrib = annualContribution / 12;
    for (let m = 0; m < 12; m++) {
      balance += monthlyContrib;
      balance *= 1 + monthlyReturn;
    }
    totalContributions += annualContribution;
    const startBalance = y === 1 ? currentBalance : yearlyBreakdown[y - 2].balance;
    const earnings = balance - startBalance - annualContribution;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: annualContribution,
      earnings,
    });
  }

  const totalEarnings = Math.max(0, balance - currentBalance - totalContributions);

  return {
    finalBalance: balance,
    totalContributions,
    totalEarnings,
    yearlyBreakdown,
  };
}
