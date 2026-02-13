/**
 * Investment return: growth with optional periodic contributions.
 * Same structure as IRA/401k: initial + contributions, compounded monthly.
 */

export interface InvestmentReturnInput {
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  expectedReturnPercent: number;
}

export interface InvestmentReturnYearRow {
  year: number;
  balance: number;
  contributions: number;
  earnings: number;
}

export interface InvestmentReturnOutput {
  finalBalance: number;
  totalContributions: number;
  totalEarnings: number;
  yearlyBreakdown: InvestmentReturnYearRow[];
}

export function calculateInvestmentReturn(
  input: InvestmentReturnInput,
): InvestmentReturnOutput {
  const initial = Math.max(0, input.initialInvestment);
  const monthlyContrib = Math.max(0, input.monthlyContribution);
  const years = Math.max(1, Math.min(50, Math.round(input.years)));
  const annualReturn = Math.max(0, input.expectedReturnPercent) / 100;
  const monthlyReturn = annualReturn / 12;

  const yearlyBreakdown: InvestmentReturnYearRow[] = [];
  let balance = initial;
  let totalContributions = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    let yearContrib = 0;
    for (let m = 0; m < 12; m++) {
      balance += monthlyContrib;
      yearContrib += monthlyContrib;
      balance *= 1 + monthlyReturn;
    }
    totalContributions += yearContrib;
    const earnings = balance - startBalance - yearContrib;
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(yearContrib * 100) / 100,
      earnings: Math.round(earnings * 100) / 100,
    });
  }

  const totalEarnings = Math.max(0, balance - initial - totalContributions);

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    yearlyBreakdown,
  };
}
