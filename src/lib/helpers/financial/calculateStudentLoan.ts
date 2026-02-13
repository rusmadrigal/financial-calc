/**
 * Student loan calculator: monthly payment, total interest, schedule.
 * Standard amortization. All amounts USD; APR as percent.
 */

export interface StudentLoanInput {
  principal: number;
  aprPercent: number;
  termYears: number;
}

export interface StudentLoanScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface StudentLoanOutput {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  schedule: StudentLoanScheduleRow[];
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

export function calculateStudentLoan(
  input: StudentLoanInput,
): StudentLoanOutput {
  const principal = Math.max(0, input.principal);
  const apr = Math.max(0, input.aprPercent);
  const termYears = Math.max(1 / 12, Math.min(50, input.termYears));
  const numMonths = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = apr / 100 / 12;

  const payment = monthlyPayment(principal, monthlyRate, numMonths);
  const totalPaid = payment * numMonths;
  const totalInterest = Math.max(0, totalPaid - principal);

  const schedule: StudentLoanScheduleRow[] = [];
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
    monthlyPayment: payment,
    totalInterest,
    totalPaid,
    schedule,
  };
}
