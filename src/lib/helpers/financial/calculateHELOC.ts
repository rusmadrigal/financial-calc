/**
 * HELOC: interest-only during draw; then amortizing repayment.
 * Simplified: assume full draw at start, interest-only for draw period, then repay over repayment term.
 */

export interface HELOCInput {
  drawAmount: number;
  annualRatePercent: number;
  drawPeriodYears: number;
  repaymentYears: number;
}

export interface HELOCMonthRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface HELOCOutput {
  drawAmount: number;
  drawPeriodInterestOnlyPayment: number;
  repaymentMonthlyPayment: number;
  totalInterestDraw: number;
  totalInterestRepayment: number;
  totalInterest: number;
  schedule: HELOCMonthRow[];
}

export function calculateHELOC(input: HELOCInput): HELOCOutput {
  const principal = Math.max(0, input.drawAmount);
  const annualRate = Math.max(0, input.annualRatePercent) / 100;
  const drawYears = Math.max(0, input.drawPeriodYears);
  const repayYears = Math.max(1, input.repaymentYears);

  const monthlyRate = annualRate / 12;
  const drawMonths = Math.round(drawYears * 12);
  const repayMonths = Math.round(repayYears * 12);

  const interestOnlyPayment = principal * monthlyRate;
  let totalInterestDraw = 0;
  const schedule: HELOCMonthRow[] = [];
  let period = 0;

  for (let m = 0; m < drawMonths; m++) {
    period++;
    const interest = principal * monthlyRate;
    totalInterestDraw += interest;
    schedule.push({
      period,
      payment: Math.round(interest * 100) / 100,
      principal: 0,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(principal * 100) / 100,
    });
  }

  const numRepay = repayMonths;
  const repayPayment =
    principal > 0 && numRepay > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numRepay)) /
        (Math.pow(1 + monthlyRate, numRepay) - 1)
      : 0;

  let balance = principal;
  let totalInterestRepayment = 0;

  for (let m = 0; m < numRepay; m++) {
    period++;
    const interest = balance * monthlyRate;
    const prin = Math.min(repayPayment - interest, balance);
    balance -= prin;
    totalInterestRepayment += interest;
    schedule.push({
      period,
      payment: Math.round(repayPayment * 100) / 100,
      principal: Math.round(prin * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100,
    });
  }

  return {
    drawAmount: Math.round(principal * 100) / 100,
    drawPeriodInterestOnlyPayment: Math.round(interestOnlyPayment * 100) / 100,
    repaymentMonthlyPayment: Math.round(repayPayment * 100) / 100,
    totalInterestDraw: Math.round(totalInterestDraw * 100) / 100,
    totalInterestRepayment: Math.round(totalInterestRepayment * 100) / 100,
    totalInterest:
      Math.round((totalInterestDraw + totalInterestRepayment) * 100) / 100,
    schedule,
  };
}
