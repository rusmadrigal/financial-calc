/**
 * Inflation: initial amount, annual inflation %, years → purchasing power and nominal value by year.
 */

export interface InflationInput {
  amount: number;
  inflationPercentPerYear: number;
  years: number;
}

export interface InflationYearRow {
  year: number;
  nominalValue: number;
  purchasingPower: number;
}

export interface InflationOutput {
  initialAmount: number;
  inflationPercent: number;
  finalNominalValue: number;
  finalPurchasingPower: number;
  yearlyBreakdown: InflationYearRow[];
}

export function calculateInflation(input: InflationInput): InflationOutput {
  const amount = Math.max(0, input.amount);
  const inflation = Math.max(0, input.inflationPercentPerYear) / 100;
  const years = Math.max(1, Math.min(50, Math.round(input.years)));

  const yearlyBreakdown: InflationYearRow[] = [];
  for (let y = 1; y <= years; y++) {
    const nominalValue = amount * Math.pow(1 + inflation, y);
    const purchasingPower = amount / Math.pow(1 + inflation, y);
    yearlyBreakdown.push({
      year: y,
      nominalValue: Math.round(nominalValue * 100) / 100,
      purchasingPower: Math.round(purchasingPower * 100) / 100,
    });
  }

  const finalNominal = amount * Math.pow(1 + inflation, years);
  const finalPurchasingPower = amount / Math.pow(1 + inflation, years);

  return {
    initialAmount: amount,
    inflationPercent: input.inflationPercentPerYear,
    finalNominalValue: Math.round(finalNominal * 100) / 100,
    finalPurchasingPower: Math.round(finalPurchasingPower * 100) / 100,
    yearlyBreakdown,
  };
}
