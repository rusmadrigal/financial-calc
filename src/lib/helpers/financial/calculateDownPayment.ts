/**
 * Down payment: home price + down % → down amount, loan amount.
 * Optional: current savings, monthly savings → months to reach down payment goal.
 */

export interface DownPaymentInput {
  homePrice: number;
  downPaymentPercent: number;
  /** Optional: current savings */
  currentSavings?: number;
  /** Optional: monthly contribution to savings */
  monthlySavings?: number;
  /** Optional: annual rate on savings (e.g. 4) */
  savingsRatePercent?: number;
}

export interface DownPaymentOutput {
  homePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
  /** Months to reach down payment (if currentSavings + monthlySavings provided) */
  monthsToGoal: number | null;
  /** Monthly amount needed to reach down in target months (if targetMonths provided) */
  monthlyNeeded: number | null;
}

export function calculateDownPayment(
  input: DownPaymentInput,
): DownPaymentOutput {
  const homePrice = Math.max(0, input.homePrice);
  const downPct = Math.max(0, Math.min(100, input.downPaymentPercent)) / 100;
  const downPaymentAmount = Math.round(homePrice * downPct * 100) / 100;
  const loanAmount = Math.round((homePrice - downPaymentAmount) * 100) / 100;

  let monthsToGoal: number | null = null;
  const currentSavings = Math.max(0, input.currentSavings ?? 0);
  const monthlySavings = Math.max(0, input.monthlySavings ?? 0);
  const savingsRate = Math.max(0, (input.savingsRatePercent ?? 0) / 100) / 12;

  if (downPaymentAmount > currentSavings && monthlySavings > 0) {
    const needed = downPaymentAmount - currentSavings;
    let balance = currentSavings;
    let months = 0;
    while (balance < downPaymentAmount && months < 600) {
      balance += monthlySavings;
      balance *= 1 + savingsRate;
      months++;
    }
    monthsToGoal = balance >= downPaymentAmount ? months : 600;
  } else if (downPaymentAmount <= currentSavings) {
    monthsToGoal = 0;
  }

  return {
    homePrice: Math.round(homePrice * 100) / 100,
    downPaymentPercent: Math.round(input.downPaymentPercent * 100) / 100,
    downPaymentAmount,
    loanAmount,
    monthsToGoal,
    monthlyNeeded: null,
  };
}
