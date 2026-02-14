/**
 * Emergency fund: target (expenses × months), current savings, monthly contribution → months to goal, yearly breakdown.
 */

export interface EmergencyFundInput {
  monthlyExpenses: number;
  monthsOfCoverage: number;
  currentSavings: number;
  monthlyContribution: number;
  /** Optional annual growth rate (e.g. savings account). Default 0. */
  annualGrowthPercent?: number;
  /** Max years to project */
  years?: number;
}

export interface EmergencyFundYearRow {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface EmergencyFundOutput {
  targetAmount: number;
  currentSavings: number;
  monthsToGoal: number;
  monthlyContribution: number;
  goalReachedInYear?: number;
  yearlyBreakdown: EmergencyFundYearRow[];
}

export function calculateEmergencyFund(
  input: EmergencyFundInput,
): EmergencyFundOutput {
  const monthlyExpenses = Math.max(0, input.monthlyExpenses);
  const monthsOfCoverage = Math.max(1, Math.round(input.monthsOfCoverage));
  const target = monthlyExpenses * monthsOfCoverage;
  const current = Math.max(0, input.currentSavings);
  const monthly = Math.max(0, input.monthlyContribution);
  const growth = (input.annualGrowthPercent ?? 0) / 100;
  const maxYears = Math.min(30, Math.max(1, Math.round(input.years ?? 15)));
  const monthlyRate = growth / 12;

  const yearlyBreakdown: EmergencyFundYearRow[] = [];
  let balance = current;
  let goalReachedInYear: number | undefined;

  for (let y = 1; y <= maxYears; y++) {
    const startBalance = balance;
    let yearContrib = 0;
    for (let m = 0; m < 12; m++) {
      balance += monthly;
      yearContrib += monthly;
      balance *= 1 + monthlyRate;
    }
    const interest = balance - startBalance - yearContrib;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(yearContrib * 100) / 100,
      interest: Math.round(interest * 100) / 100,
    });
    if (goalReachedInYear == null && balance >= target) {
      goalReachedInYear = y;
    }
  }

  let monthsToGoal = 0;
  if (monthly > 0 && current < target) {
    let b = current;
    const monthlyRateM = growth / 12;
    while (b < target && monthsToGoal < 360) {
      monthsToGoal++;
      b += monthly;
      b *= 1 + monthlyRateM;
    }
  } else if (current >= target) {
    monthsToGoal = 0;
  } else {
    monthsToGoal = 999;
  }

  return {
    targetAmount: target,
    currentSavings: current,
    monthsToGoal,
    monthlyContribution: monthly,
    goalReachedInYear,
    yearlyBreakdown,
  };
}
