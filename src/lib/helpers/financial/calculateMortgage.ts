/**
 * Mortgage calculator: monthly payment, totals, and amortization schedule.
 * All amounts in USD; rate as APR percent. Monthly rate = APR/100/12.
 */

export interface MortgageInput {
  /** Home price (USD) */
  homePrice: number;
  /** Down payment (USD) */
  downPayment: number;
  /** APR as percent (e.g. 6.5) */
  aprPercent: number;
  /** Loan term in years */
  termYears: number;
}

export interface MortgageScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

export interface MortgageOutput {
  /** Loan principal (homePrice - downPayment) */
  principal: number;
  /** Monthly payment (P&I) */
  monthlyPayment: number;
  /** Total of all payments */
  totalPayment: number;
  /** Total interest over life of loan */
  totalInterest: number;
  schedule: MortgageScheduleRow[];
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

export function calculateMortgage(input: MortgageInput): MortgageOutput {
  const homePrice = Math.max(0, input.homePrice);
  const downPayment = Math.max(0, Math.min(homePrice, input.downPayment));
  const principal = Math.max(0, homePrice - downPayment);
  const apr = Math.max(0, input.aprPercent);
  const termYears = Math.max(1 / 12, Math.min(50, input.termYears));
  const numMonths = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = apr / 100 / 12;

  const payment = monthlyPayment(principal, monthlyRate, numMonths);
  const totalPayment = payment * numMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const schedule: MortgageScheduleRow[] = [];
  let balance = principal;

  for (let period = 1; period <= numMonths && balance > 0; period++) {
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
    principal,
    monthlyPayment: payment,
    totalPayment,
    totalInterest,
    schedule,
  };
}
