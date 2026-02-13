/**
 * Retirement calculator: project portfolio to retirement, then drawdown.
 * All amounts USD; rates as percent.
 */

export interface RetirementInput {
  currentSavings: number;
  monthlyContribution: number;
  yearsToRetirement: number;
  expectedReturnPercent: number;
  annualIncomeNeeded: number;
  yearsInRetirement: number;
  retirementReturnPercent: number;
}

export interface RetirementYearRow {
  year: number;
  balance: number;
  phase: "accumulation" | "retirement";
  income?: number;
  withdrawal?: number;
}

export interface RetirementOutput {
  balanceAtRetirement: number;
  totalContributions: number;
  yearlyBreakdown: RetirementYearRow[];
  /** Whether projected balance can support income for years in retirement (simplified) */
  canMeetIncome: boolean;
}

export function calculateRetirement(input: RetirementInput): RetirementOutput {
  const currentSavings = Math.max(0, input.currentSavings);
  const monthlyContribution = Math.max(0, input.monthlyContribution);
  const yearsToRetirement = Math.max(1, Math.min(50, Math.round(input.yearsToRetirement)));
  const annualReturn = Math.max(0, input.expectedReturnPercent) / 100;
  const monthlyReturn = annualReturn / 12;
  const annualIncomeNeeded = Math.max(0, input.annualIncomeNeeded);
  const yearsInRetirement = Math.max(1, Math.min(50, Math.round(input.yearsInRetirement)));
  const retirementReturn = Math.max(0, input.retirementReturnPercent) / 100;
  const monthlyRetReturn = retirementReturn / 12;

  const yearlyBreakdown: RetirementYearRow[] = [];
  let balance = currentSavings;
  let totalContributions = 0;

  for (let y = 1; y <= yearsToRetirement; y++) {
    for (let m = 0; m < 12; m++) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
      balance *= 1 + monthlyReturn;
    }
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      phase: "accumulation",
    });
  }

  const balanceAtRetirement = balance;
  const monthlyWithdrawal = annualIncomeNeeded / 12;

  for (let y = 1; y <= yearsInRetirement; y++) {
    const yearWithdrawal = annualIncomeNeeded;
    for (let m = 0; m < 12; m++) {
      balance -= monthlyWithdrawal;
      if (balance > 0) balance *= 1 + monthlyRetReturn;
    }
    balance = Math.max(0, balance);
    yearlyBreakdown.push({
      year: yearsToRetirement + y,
      balance: Math.round(balance * 100) / 100,
      phase: "retirement",
      income: annualIncomeNeeded,
      withdrawal: yearWithdrawal,
    });
  }

  const canMeetIncome = balance >= 0;

  return {
    balanceAtRetirement,
    totalContributions,
    yearlyBreakdown,
    canMeetIncome,
  };
}
