/**
 * Loan amortization: payment, totals, full schedule.
 * Optional start date for schedule labels. All amounts USD; APR as percent.
 */

export interface AmortizationInput {
  /** Loan principal (USD) */
  principal: number;
  /** APR percent */
  aprPercent: number;
  /** Term in months (if termYears provided, termMonths = termYears * 12) */
  termMonths?: number;
  /** Term in years (used if termMonths not set) */
  termYears?: number;
  /** Optional start date for period labels (not used in math) */
  startDate?: Date;
}

export interface AmortizationScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

export interface AmortizationOutput {
  /** Monthly payment */
  payment: number;
  /** Total amount paid */
  totalPayment: number;
  /** Total interest paid */
  totalInterest: number;
  /** Number of periods */
  numPeriods: number;
  schedule: AmortizationScheduleRow[];
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

export function calculateAmortization(
  input: AmortizationInput,
): AmortizationOutput {
  const principal = Math.max(0, input.principal);
  const apr = Math.max(0, input.aprPercent);
  const numMonths =
    input.termMonths != null && input.termMonths >= 1
      ? Math.round(input.termMonths)
      : Math.max(1, Math.round((input.termYears ?? 30) * 12));

  const monthlyRate = apr / 100 / 12;
  const payment = monthlyPayment(principal, monthlyRate, numMonths);
  const totalPayment = payment * numMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const schedule: AmortizationScheduleRow[] = [];
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
    payment,
    totalPayment,
    totalInterest,
    numPeriods: numMonths,
    schedule,
  };
}
