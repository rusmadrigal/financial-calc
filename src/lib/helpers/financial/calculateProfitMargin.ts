/**
 * Profit margin: revenue and cost → margin %, profit.
 * For charts: same revenue/cost repeated by year (or single summary).
 */

export interface ProfitMarginInput {
  revenue: number;
  cost: number;
  /** Years to build for chart (same values each year) */
  years?: number;
}

export interface ProfitMarginYearRow {
  year: number;
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
}

export interface ProfitMarginOutput {
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
  yearlyBreakdown: ProfitMarginYearRow[];
}

export function calculateProfitMargin(
  input: ProfitMarginInput,
): ProfitMarginOutput {
  const revenue = Math.max(0, input.revenue);
  const cost = Math.max(0, input.cost);
  const profit = revenue - cost;
  const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;

  const years = Math.max(1, Math.min(15, Math.round(input.years ?? 10)));
  const yearlyBreakdown: ProfitMarginYearRow[] = [];
  for (let y = 1; y <= years; y++) {
    yearlyBreakdown.push({
      year: y,
      revenue: Math.round(revenue * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      marginPercent: Math.round(marginPercent * 100) / 100,
    });
  }

  return {
    revenue: Math.round(revenue * 100) / 100,
    cost: Math.round(cost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    marginPercent: Math.round(marginPercent * 100) / 100,
    yearlyBreakdown,
  };
}
