/**
 * 401(k) calculator: balance growth with contributions and employer match.
 * All amounts USD; rates as percent. Annual return compounded monthly.
 */

export interface Calculate401kInput {
  currentBalance: number;
  monthlyContribution: number;
  employerMatchPercent: number;
  years: number;
  expectedReturnPercent: number;
}

export interface Calculate401kYearRow {
  year: number;
  balance: number;
  contributions: number;
  employerMatch: number;
  earnings: number;
}

export interface Calculate401kOutput {
  finalBalance: number;
  totalContributions: number;
  totalEmployerMatch: number;
  totalEarnings: number;
  yearlyBreakdown: Calculate401kYearRow[];
}

export function calculate401k(input: Calculate401kInput): Calculate401kOutput {
  const currentBalance = Math.max(0, input.currentBalance);
  const monthlyContribution = Math.max(0, input.monthlyContribution);
  const employerMatchPct =
    Math.max(0, Math.min(100, input.employerMatchPercent)) / 100;
  const years = Math.max(1, Math.min(50, Math.round(input.years)));
  const annualReturn = Math.max(0, input.expectedReturnPercent) / 100;
  const monthlyReturn = annualReturn / 12;

  const yearlyBreakdown: Calculate401kYearRow[] = [];
  let balance = currentBalance;
  let totalContributions = 0;
  let totalEmployerMatch = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    let yearContributions = 0;
    let yearMatch = 0;
    for (let m = 0; m < 12; m++) {
      const contrib = monthlyContribution;
      const match = contrib * employerMatchPct;
      balance += contrib + match;
      yearContributions += contrib;
      yearMatch += match;
      balance *= 1 + monthlyReturn;
    }
    totalContributions += yearContributions;
    totalEmployerMatch += yearMatch;
    const earnings = balance - startBalance - yearContributions - yearMatch;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: yearContributions,
      employerMatch: yearMatch,
      earnings,
    });
  }

  const totalEarnings = Math.max(
    0,
    balance - currentBalance - totalContributions - totalEmployerMatch,
  );

  return {
    finalBalance: balance,
    totalContributions,
    totalEmployerMatch,
    totalEarnings,
    yearlyBreakdown,
  };
}
