/**
 * Car lease calculator (MVP): residual, depreciation, finance fee, monthly payment, total cost.
 * Money factor is decimal (e.g. 0.0025). All amounts USD.
 */

export interface CarLeaseInput {
  /** MSRP (USD) */
  msrp: number;
  /** Negotiated price / cap cost (USD) */
  negotiatedPrice: number;
  /** Cap cost reduction (USD) */
  downPayment: number;
  /** Trade-in value (USD) */
  tradeIn: number;
  /** Money factor (decimal, e.g. 0.0025) */
  moneyFactor: number;
  /** Residual value as percent of MSRP (0–100) */
  residualPercent: number;
  /** Lease term in months */
  termMonths: number;
  /** Sales tax percent (applied to monthly payment in many states) */
  salesTaxPercent: number;
  /** Upfront fees: acquisition, doc, etc. (USD) */
  fees: number;
  /** Rebates (USD) */
  rebates: number;
}

export interface CarLeaseScheduleRow {
  period: number;
  payment: number;
  depreciation: number;
  finance: number;
  tax: number;
  balance?: number;
}

export interface CarLeaseOutput {
  residualValue: number;
  depreciationFeeMonthly: number;
  financeFeeMonthly: number;
  basePayment: number;
  monthlyTax: number;
  totalMonthlyPayment: number;
  /** Total cost over term (monthly payments * term + down + fees - rebates) */
  totalCost: number;
  schedule: CarLeaseScheduleRow[];
}

export function calculateCarLease(input: CarLeaseInput): CarLeaseOutput {
  const msrp = Math.max(0, input.msrp);
  const negotiated = Math.max(0, input.negotiatedPrice);
  const down = Math.max(0, input.downPayment);
  const tradeInVal = Math.max(0, input.tradeIn);
  const moneyFactor = Math.max(0, input.moneyFactor);
  const residualPct = Math.max(0, Math.min(100, input.residualPercent)) / 100;
  const termMonths = Math.max(1, Math.round(input.termMonths));
  const salesTaxPct = Math.max(0, input.salesTaxPercent) / 100;
  const fees = Math.max(0, input.fees);
  const rebates = Math.max(0, input.rebates);

  const residualValue = msrp * residualPct;
  const capCostReduction = down + tradeInVal - rebates;
  const adjustedCapCost = Math.max(0, negotiated + fees - capCostReduction);

  const depreciation = Math.max(0, adjustedCapCost - residualValue);
  const depreciationFeeMonthly = depreciation / termMonths;
  const financeFeeMonthly = (adjustedCapCost + residualValue) * moneyFactor;
  const basePayment = depreciationFeeMonthly + financeFeeMonthly;
  const monthlyTax = basePayment * salesTaxPct;
  const totalMonthlyPayment = basePayment + monthlyTax;

  const totalPayments = totalMonthlyPayment * termMonths;
  const totalCost = totalPayments + down + fees - rebates;

  const schedule: CarLeaseScheduleRow[] = [];
  for (let period = 1; period <= termMonths; period++) {
    schedule.push({
      period,
      payment: totalMonthlyPayment,
      depreciation: depreciationFeeMonthly,
      finance: financeFeeMonthly,
      tax: monthlyTax,
      balance: 0,
    });
  }

  return {
    residualValue,
    depreciationFeeMonthly,
    financeFeeMonthly,
    basePayment,
    monthlyTax,
    totalMonthlyPayment,
    totalCost,
    schedule,
  };
}
