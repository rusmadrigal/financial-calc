/**
 * Auto loan calculator: amount financed, payment, totals, schedule.
 * Inputs: vehicle price, down payment, trade-in, tax %, fees, APR, term months.
 */

export interface AutoLoanInput {
  /** Vehicle price (USD) */
  vehiclePrice: number;
  /** Down payment (USD) */
  downPayment: number;
  /** Trade-in value (USD) */
  tradeIn: number;
  /** Sales tax percent */
  salesTaxPercent: number;
  /** Fees (USD) added to amount financed */
  fees: number;
  /** APR percent */
  aprPercent: number;
  /** Term in months */
  termMonths: number;
}

export interface AutoLoanScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

export interface AutoLoanOutput {
  /** Amount financed (after down, trade-in, plus tax and fees on financed amount) */
  amountFinanced: number;
  /** Monthly payment */
  payment: number;
  /** Total of all payments */
  totalPayment: number;
  /** Total interest */
  totalInterest: number;
  schedule: AutoLoanScheduleRow[];
}

function monthlyPayment(
  principal: number,
  monthlyRate: number,
  numMonths: number,
): number {
  if (principal <= 0 || numMonths < 1) return 0;
  if (monthlyRate <= 0) return principal / numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export function calculateAutoLoan(input: AutoLoanInput): AutoLoanOutput {
  const vehiclePrice = Math.max(0, input.vehiclePrice);
  const downPayment = Math.max(0, input.downPayment);
  const tradeIn = Math.max(0, input.tradeIn);
  const salesTaxPercent = Math.max(0, input.salesTaxPercent) / 100;
  const fees = Math.max(0, input.fees);
  const apr = Math.max(0, input.aprPercent);
  const termMonths = Math.max(1, Math.round(input.termMonths));

  const afterDownAndTrade = Math.max(
    0,
    vehiclePrice - downPayment - tradeIn,
  );
  const taxAmount = afterDownAndTrade * salesTaxPercent;
  const amountFinanced = afterDownAndTrade + taxAmount + fees;

  const monthlyRate = apr / 100 / 12;
  const payment = monthlyPayment(amountFinanced, monthlyRate, termMonths);
  const totalPayment = payment * termMonths;
  const totalInterest = Math.max(0, totalPayment - amountFinanced);

  const schedule: AutoLoanScheduleRow[] = [];
  let balance = amountFinanced;

  for (let period = 1; period <= termMonths && balance > 0; period++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    schedule.push({
      period,
      payment: principalPaid + interest,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  return {
    amountFinanced,
    payment,
    totalPayment,
    totalInterest,
    schedule,
  };
}
