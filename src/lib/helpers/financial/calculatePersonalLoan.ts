/**
 * Personal loan calculator: monthly payment, total interest, schedule.
 * Same math as amortization. All amounts USD; APR as percent.
 */

export interface PersonalLoanInput {
  /** Loan principal (USD) */
  principal: number;
  /** APR percent */
  aprPercent: number;
  /** Term in months */
  termMonths: number;
}

export interface PersonalLoanScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface PersonalLoanOutput {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: PersonalLoanScheduleRow[];
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

export function calculatePersonalLoan(
  input: PersonalLoanInput,
): PersonalLoanOutput {
  const principal = Math.max(0, input.principal);
  const apr = Math.max(0, input.aprPercent);
  const termMonths = Math.max(1, Math.round(input.termMonths));
  const monthlyRate = apr / 100 / 12;

  const payment = monthlyPayment(principal, monthlyRate, termMonths);
  const totalPaid = payment * termMonths;
  const totalInterest = Math.max(0, totalPaid - principal);

  const schedule: PersonalLoanScheduleRow[] = [];
  let balance = principal;

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
    monthlyPayment: payment,
    totalInterest,
    totalPaid,
    schedule,
  };
}
