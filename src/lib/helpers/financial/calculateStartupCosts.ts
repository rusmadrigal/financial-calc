/**
 * Startup costs: one-time + recurring monthly → yearly breakdown for charts.
 */

export interface StartupCostsInput {
  oneTimeCosts: number;
  recurringMonthly: number;
  /** Number of years to project */
  years: number;
}

export interface StartupCostsYearRow {
  year: number;
  oneTime: number;
  recurring: number;
  total: number;
  cumulative: number;
}

export interface StartupCostsOutput {
  oneTimeCosts: number;
  recurringMonthly: number;
  totalFirstYear: number;
  yearlyBreakdown: StartupCostsYearRow[];
}

export function calculateStartupCosts(
  input: StartupCostsInput,
): StartupCostsOutput {
  const oneTime = Math.max(0, input.oneTimeCosts);
  const recurring = Math.max(0, input.recurringMonthly);
  const years = Math.max(1, Math.min(30, Math.round(input.years)));

  const yearlyBreakdown: StartupCostsYearRow[] = [];
  let cumulative = 0;

  for (let y = 1; y <= years; y++) {
    const oneTimeThisYear = y === 1 ? oneTime : 0;
    const recurringThisYear = recurring * 12;
    const total = oneTimeThisYear + recurringThisYear;
    cumulative += total;
    yearlyBreakdown.push({
      year: y,
      oneTime: Math.round(oneTimeThisYear * 100) / 100,
      recurring: Math.round(recurringThisYear * 100) / 100,
      total: Math.round(total * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
    });
  }

  const totalFirstYear = yearlyBreakdown[0]?.total ?? 0;

  return {
    oneTimeCosts: Math.round(oneTime * 100) / 100,
    recurringMonthly: Math.round(recurring * 100) / 100,
    totalFirstYear,
    yearlyBreakdown,
  };
}
