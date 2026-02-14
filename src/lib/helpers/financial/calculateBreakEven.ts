/**
 * Break-even: fixed costs, variable cost per unit, price per unit → break-even quantity.
 * Optional: units sold per year → yearly revenue vs cost for charts.
 */

export interface BreakEvenInput {
  fixedCostsAnnual: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  /** Optional: for yearly chart (revenue vs cost by year) */
  unitsSoldPerYear?: number;
  /** Years to project when unitsSoldPerYear is set */
  years?: number;
}

export interface BreakEvenYearRow {
  year: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface BreakEvenOutput {
  breakEvenUnits: number;
  contributionMarginPerUnit: number;
  /** When unitsSoldPerYear provided */
  yearlyBreakdown: BreakEvenYearRow[];
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenOutput {
  const fixed = Math.max(0, input.fixedCostsAnnual);
  const variable = Math.max(0, input.variableCostPerUnit);
  const price = Math.max(0, input.pricePerUnit);
  const contribution = Math.max(0, price - variable);
  const breakEvenUnits = contribution > 0 ? fixed / contribution : 0;

  const yearlyBreakdown: BreakEvenYearRow[] = [];
  const unitsPerYear = Math.max(0, input.unitsSoldPerYear ?? 0);
  const years = Math.max(1, Math.min(15, Math.round(input.years ?? 10)));

  if (unitsPerYear > 0) {
    for (let y = 1; y <= years; y++) {
      const revenue = price * unitsPerYear;
      const cost = fixed + variable * unitsPerYear;
      const profit = revenue - cost;
      yearlyBreakdown.push({
        year: y,
        revenue: Math.round(revenue * 100) / 100,
        cost: Math.round(cost * 100) / 100,
        profit: Math.round(profit * 100) / 100,
      });
    }
  }

  return {
    breakEvenUnits: Math.round(breakEvenUnits * 100) / 100,
    contributionMarginPerUnit: Math.round(contribution * 100) / 100,
    yearlyBreakdown,
  };
}
