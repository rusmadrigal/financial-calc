/**
 * Capital gains tax: cost basis, sale price, holding period, taxable income → gain, tax, net.
 * Short-term = ordinary income rates; long-term = 0%, 15%, 20% by income.
 */

export interface CapitalGainsInput {
  costBasis: number;
  salePrice: number;
  /** "short" = ≤1 year, "long" = >1 year */
  holdingPeriod: "short" | "long";
  /** Other taxable income (for long-term bracket) */
  otherTaxableIncome: number;
}

export interface CapitalGainsOutput {
  costBasis: number;
  salePrice: number;
  gain: number;
  tax: number;
  netProceeds: number;
  ratePercent: number;
}

/** Long-term cap gains brackets 2024 single: 0% up to 47,025, 15% up to 518,900, 20% above. */
function longTermCapGainsRate(
  gain: number,
  otherIncome: number,
  filingStatus: "single" | "married" = "single",
): number {
  const threshold0 = filingStatus === "married" ? 94_050 : 47_025;
  const threshold15 = filingStatus === "married" ? 583_750 : 518_900;
  const total = otherIncome + gain;
  if (total <= threshold0) return 0;
  if (total <= threshold15) return 0.15;
  return 0.2;
}

export function calculateCapitalGainsTax(
  input: CapitalGainsInput,
): CapitalGainsOutput {
  const costBasis = Math.max(0, input.costBasis);
  const salePrice = Math.max(0, input.salePrice);
  const gain = Math.max(0, salePrice - costBasis);
  const otherIncome = Math.max(0, input.otherTaxableIncome ?? 0);

  let rate: number;
  if (input.holdingPeriod === "short") {
    rate = 0.22; // simplified: assume 22% ordinary
  } else {
    rate = longTermCapGainsRate(gain, otherIncome);
  }

  const tax = gain * rate;
  const netProceeds = salePrice - tax;

  return {
    costBasis,
    salePrice,
    gain: Math.round(gain * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    netProceeds: Math.round(netProceeds * 100) / 100,
    ratePercent: Math.round(rate * 10000) / 100,
  };
}
