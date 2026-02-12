/**
 * Credit card payoff calculator: months to payoff, total interest, schedule.
 * Handles payment too low (willNeverPayoff). Cap schedule at 600 months.
 */

export interface CreditCardPayoffInput {
  /** Current balance (USD) */
  balance: number;
  /** APR percent */
  aprPercent: number;
  /** Monthly payment (USD) */
  monthlyPayment: number;
  /** Additional payment (USD) */
  additionalPayment?: number;
  /** Monthly fees (USD) */
  monthlyFees?: number;
}

export interface CreditCardPayoffScheduleRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface CreditCardPayoffOutput {
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  /** Approximate payoff date (from start date) */
  payoffDate: Date | null;
  schedule: CreditCardPayoffScheduleRow[];
  willNeverPayoff: boolean;
}

const MAX_SCHEDULE_MONTHS = 600;

export function calculateCreditCardPayoff(
  input: CreditCardPayoffInput,
  startDate: Date = new Date(),
): CreditCardPayoffOutput {
  const balance = Math.max(0, input.balance);
  const apr = Math.max(0, input.aprPercent);
  const monthlyPayment = Math.max(0, input.monthlyPayment);
  const additional = Math.max(0, input.additionalPayment ?? 0);
  const monthlyFees = Math.max(0, input.monthlyFees ?? 0);
  const totalPaymentPerMonth = monthlyPayment + additional;

  const monthlyRate = apr / 100 / 12;
  const schedule: CreditCardPayoffScheduleRow[] = [];
  let b = balance;
  let totalInterest = 0;
  let month = 0;

  const interestOnlyFirstMonth = balance * monthlyRate + monthlyFees;
  if (totalPaymentPerMonth <= interestOnlyFirstMonth && balance > 0) {
    return {
      monthsToPayoff: 0,
      totalInterest: 0,
      totalPaid: 0,
      payoffDate: null,
      schedule: [],
      willNeverPayoff: true,
    };
  }

  while (b > 0 && month < MAX_SCHEDULE_MONTHS) {
    month++;
    const interest = b * monthlyRate;
    const feesThisMonth = monthlyFees;
    const totalOwed = b + interest + feesThisMonth;
    const paymentApplied = Math.min(totalPaymentPerMonth, totalOwed);
    const principalPaid = Math.max(
      0,
      paymentApplied - interest - feesThisMonth,
    );
    const actualPrincipal = Math.min(principalPaid, b);
    b = Math.max(0, b - actualPrincipal);
    totalInterest += interest;

    schedule.push({
      period: month,
      payment: totalPaymentPerMonth,
      interest,
      principal: actualPrincipal,
      balance: b,
    });
  }

  const totalPaid = balance + totalInterest + monthlyFees * month;
  const payoffDate = new Date(startDate);
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    monthsToPayoff: b <= 0 ? month : 0,
    totalInterest,
    totalPaid,
    payoffDate: b <= 0 ? payoffDate : null,
    schedule,
    willNeverPayoff: false,
  };
}
