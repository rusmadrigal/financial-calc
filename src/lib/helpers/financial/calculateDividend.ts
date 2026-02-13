/**
 * Dividend calculator: income from dividends, optional reinvestment.
 * Shares × price × yield = annual dividend. If reinvest: shares grow each year by reinvested dividends.
 */

export interface DividendInput {
  shares: number;
  pricePerShare: number;
  dividendYieldPercent: number;
  /** Reinvest dividends to buy more shares */
  reinvest: boolean;
  years: number;
}

export interface DividendYearRow {
  year: number;
  shares: number;
  dividendIncome: number;
  cumulativeDividends: number;
}

export interface DividendOutput {
  totalDividendIncome: number;
  finalShares: number;
  yearlyBreakdown: DividendYearRow[];
}

export function calculateDividend(input: DividendInput): DividendOutput {
  let shares = Math.max(0, input.shares);
  const pricePerShare = Math.max(0, input.pricePerShare);
  const yieldPct = Math.max(0, input.dividendYieldPercent) / 100;
  const reinvest = input.reinvest ?? false;
  const years = Math.max(1, Math.min(50, Math.round(input.years)));

  const yearlyBreakdown: DividendYearRow[] = [];
  let totalDividendIncome = 0;
  let cumulative = 0;

  for (let y = 1; y <= years; y++) {
    const dividendIncome = shares * pricePerShare * yieldPct;
    totalDividendIncome += dividendIncome;
    cumulative += dividendIncome;

    if (reinvest && pricePerShare > 0) {
      const newShares = dividendIncome / pricePerShare;
      shares += newShares;
    }

    yearlyBreakdown.push({
      year: y,
      shares: Math.round(shares * 10000) / 10000,
      dividendIncome: Math.round(dividendIncome * 100) / 100,
      cumulativeDividends: Math.round(cumulative * 100) / 100,
    });
  }

  return {
    totalDividendIncome: Math.round(totalDividendIncome * 100) / 100,
    finalShares: Math.round(shares * 10000) / 10000,
    yearlyBreakdown,
  };
}
