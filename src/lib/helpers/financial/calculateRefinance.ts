/**
 * Refinance calculator: compare current loan vs new loan.
 * Inputs: current balance, rates, terms, closing costs.
 * Outputs: payments, savings, break-even, schedules.
 */

export interface RefinanceInput {
  /** Current loan balance (USD) */
  currentBalance: number;
  /** Current APR percent */
  currentAprPercent: number;
  /** Remaining term in months */
  remainingTermMonths: number;
  /** New APR percent */
  newAprPercent: number;
  /** New term in months */
  newTermMonths: number;
  /** Closing costs (USD) */
  closingCosts: number;
}

export interface RefinanceScheduleRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

export interface RefinanceOutput {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  totalInterestCurrent: number;
  totalInterestNew: number;
  /** Interest saved minus closing costs */
  lifetimeSavings: number;
  scheduleCurrent: RefinanceScheduleRow[];
  scheduleNew: RefinanceScheduleRow[];
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

function buildSchedule(
  principal: number,
  payment: number,
  monthlyRate: number,
  numMonths: number,
): RefinanceScheduleRow[] {
  const schedule: RefinanceScheduleRow[] = [];
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
  return schedule;
}

function totalInterestFromSchedule(schedule: RefinanceScheduleRow[]): number {
  return schedule.reduce((sum, row) => sum + row.interest, 0);
}

export function calculateRefinance(input: RefinanceInput): RefinanceOutput {
  const balance = Math.max(0, input.currentBalance);
  const remainingMonths = Math.max(1, Math.round(input.remainingTermMonths));
  const newTermMonths = Math.max(1, Math.round(input.newTermMonths));
  const closingCosts = Math.max(0, input.closingCosts);

  const currentRate = Math.max(0, input.currentAprPercent / 100 / 12);
  const newRate = Math.max(0, input.newAprPercent / 100 / 12);

  const currentPayment = monthlyPayment(balance, currentRate, remainingMonths);
  const newPayment = monthlyPayment(balance, newRate, newTermMonths);

  const scheduleCurrent = buildSchedule(
    balance,
    currentPayment,
    currentRate,
    remainingMonths,
  );
  const scheduleNew = buildSchedule(
    balance,
    newPayment,
    newRate,
    newTermMonths,
  );

  const totalInterestCurrent = totalInterestFromSchedule(scheduleCurrent);
  const totalInterestNew = totalInterestFromSchedule(scheduleNew);
  const monthlySavings = Math.max(0, currentPayment - newPayment);

  let breakEvenMonths = 0;
  if (monthlySavings > 0 && closingCosts > 0) {
    breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
  }

  const interestSaved = totalInterestCurrent - totalInterestNew;
  const lifetimeSavings = interestSaved - closingCosts;

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths,
    totalInterestCurrent,
    totalInterestNew,
    lifetimeSavings,
    scheduleCurrent,
    scheduleNew,
  };
}
