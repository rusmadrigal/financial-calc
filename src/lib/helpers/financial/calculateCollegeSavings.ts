/**
 * College savings: target, years to goal, current balance, monthly contribution, return % → yearly breakdown.
 * Same structure as high-yield savings / compound with contributions.
 */

export interface CollegeSavingsInput {
  targetAmount: number;
  yearsToGoal: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturnPercent: number;
}

export interface CollegeSavingsYearRow {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface CollegeSavingsOutput {
  targetAmount: number;
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  goalMet: boolean;
  yearlyBreakdown: CollegeSavingsYearRow[];
}

export function calculateCollegeSavings(
  input: CollegeSavingsInput,
): CollegeSavingsOutput {
  const target = Math.max(0, input.targetAmount);
  const years = Math.max(1, Math.min(30, Math.round(input.yearsToGoal)));
  const initial = Math.max(0, input.currentSavings);
  const monthly = Math.max(0, input.monthlyContribution);
  const rate = Math.max(0, input.expectedReturnPercent) / 100;
  const monthlyRate = rate / 12;

  const yearlyBreakdown: CollegeSavingsYearRow[] = [];
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

  return {
    targetAmount: target,
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest:
      Math.round(Math.max(0, balance - initial - totalContributions) * 100) /
      100,
    goalMet: balance >= target,
    yearlyBreakdown,
  };
}
