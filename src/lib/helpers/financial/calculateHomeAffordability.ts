/**
 * Home affordability: from income, debts, DTI, rate, term, down % → max home price.
 * Max P&I = (monthlyGross * maxDTIPercent/100) - monthlyDebts.
 * Max loan = PV of that payment stream. Max home = maxLoan / (1 - downPercent/100).
 */

export interface HomeAffordabilityInput {
  annualIncome: number;
  monthlyDebts: number;
  maxDTIPercent: number;
  aprPercent: number;
  termYears: number;
  downPaymentPercent: number;
}

export interface HomeAffordabilityOutput {
  maxMonthlyPandI: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  downPaymentAmount: number;
  monthlyPayment: number;
}

function pmt(
  principal: number,
  monthlyRate: number,
  numMonths: number,
): number {
  if (principal <= 0 || numMonths < 1) return 0;
  if (monthlyRate <= 0) return principal / numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

function loanAmountFromPayment(
  payment: number,
  monthlyRate: number,
  numMonths: number,
): number {
  if (payment <= 0 || numMonths < 1) return 0;
  if (monthlyRate <= 0) return payment * numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (payment * (factor - 1)) / (monthlyRate * factor);
}

export function calculateHomeAffordability(
  input: HomeAffordabilityInput,
): HomeAffordabilityOutput {
  const annualIncome = Math.max(0, input.annualIncome);
  const monthlyDebts = Math.max(0, input.monthlyDebts);
  const maxDTI = Math.max(0, Math.min(100, input.maxDTIPercent)) / 100;
  const apr = Math.max(0, input.aprPercent);
  const termYears = Math.max(1 / 12, Math.min(50, input.termYears));
  const downPct = Math.max(0, Math.min(100, input.downPaymentPercent)) / 100;

  const monthlyGross = annualIncome / 12;
  const maxMonthlyPandI = Math.max(0, monthlyGross * maxDTI - monthlyDebts);

  const numMonths = Math.round(termYears * 12);
  const monthlyRate = apr / 100 / 12;
  const maxLoanAmount = loanAmountFromPayment(
    maxMonthlyPandI,
    monthlyRate,
    numMonths,
  );
  const maxHomePrice =
    downPct >= 1 ? maxLoanAmount : maxLoanAmount / (1 - downPct);
  const downPaymentAmount = maxHomePrice * downPct;
  const actualLoan = maxHomePrice - downPaymentAmount;
  const monthlyPayment =
    actualLoan > 0 ? pmt(actualLoan, monthlyRate, numMonths) : 0;

  return {
    maxMonthlyPandI: Math.round(maxMonthlyPandI * 100) / 100,
    maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
    maxHomePrice: Math.round(maxHomePrice * 100) / 100,
    downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
  };
}
