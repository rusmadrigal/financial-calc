/**
 * Mortgage APR: loan amount, stated rate, term, closing costs → APR (true cost).
 * APR is the rate at which PV(monthly payments) = loan amount minus closing costs.
 * Solve iteratively (binary search).
 */

export interface MortgageAPRInput {
  loanAmount: number;
  statedRatePercent: number;
  termYears: number;
  closingCosts: number;
}

export interface MortgageAPROutput {
  loanAmount: number;
  statedRatePercent: number;
  closingCosts: number;
  netLoanAmount: number;
  monthlyPayment: number;
  aprPercent: number;
  totalPayments: number;
  totalInterest: number;
}

function paymentFromRate(
  principal: number,
  monthlyRate: number,
  numMonths: number,
): number {
  if (principal <= 0 || numMonths < 1) return 0;
  if (monthlyRate <= 0) return principal / numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

function pvOfPayments(
  payment: number,
  monthlyRate: number,
  numMonths: number,
): number {
  if (payment <= 0 || numMonths < 1) return 0;
  if (monthlyRate <= 0) return payment * numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (payment * (factor - 1)) / (monthlyRate * factor);
}

export function calculateMortgageAPR(
  input: MortgageAPRInput,
): MortgageAPROutput {
  const loanAmount = Math.max(0, input.loanAmount);
  const statedRate = Math.max(0, input.statedRatePercent) / 100;
  const termYears = Math.max(1 / 12, Math.min(50, input.termYears));
  const closingCosts = Math.max(0, Math.min(loanAmount, input.closingCosts));

  const numMonths = Math.round(termYears * 12);
  const netLoanAmount = loanAmount - closingCosts;
  const monthlyStated = statedRate / 12;
  const monthlyPayment = paymentFromRate(loanAmount, monthlyStated, numMonths);

  if (netLoanAmount <= 0 || monthlyPayment <= 0) {
    return {
      loanAmount: Math.round(loanAmount * 100) / 100,
      statedRatePercent: input.statedRatePercent,
      closingCosts: Math.round(closingCosts * 100) / 100,
      netLoanAmount: Math.round(netLoanAmount * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      aprPercent: input.statedRatePercent,
      totalPayments: Math.round(monthlyPayment * numMonths * 100) / 100,
      totalInterest:
        Math.round((monthlyPayment * numMonths - loanAmount) * 100) / 100,
    };
  }

  let low = 0;
  let high = 0.5;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const pv = pvOfPayments(monthlyPayment, mid / 12, numMonths);
    if (Math.abs(pv - netLoanAmount) < 1) {
      low = mid;
      break;
    }
    if (pv < netLoanAmount) high = mid;
    else low = mid;
  }
  const aprPercent = ((low + high) / 2) * 100;
  const totalPayments = monthlyPayment * numMonths;
  const totalInterest = Math.max(0, totalPayments - loanAmount);

  return {
    loanAmount: Math.round(loanAmount * 100) / 100,
    statedRatePercent: Math.round(input.statedRatePercent * 100) / 100,
    closingCosts: Math.round(closingCosts * 100) / 100,
    netLoanAmount: Math.round(netLoanAmount * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    aprPercent: Math.round(aprPercent * 100) / 100,
    totalPayments: Math.round(totalPayments * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
