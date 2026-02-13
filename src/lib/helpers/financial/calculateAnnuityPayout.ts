/**
 * Fixed-period annuity payout: given principal and rate, compute payment per period.
 * Payments at end of each period; balance declines to zero.
 */

export interface AnnuityPayoutInput {
  principal: number;
  annualRatePercent: number;
  /** Payout period in years */
  years: number;
  /** true = monthly payments, false = annual */
  monthly: boolean;
}

export interface AnnuityYearRow {
  year: number;
  payments: number;
  interest: number;
  principalPaid: number;
  balance: number;
}

export interface AnnuityPayoutOutput {
  paymentPerPeriod: number;
  totalPayments: number;
  totalInterest: number;
  yearlyBreakdown: AnnuityYearRow[];
}

export function calculateAnnuityPayout(
  input: AnnuityPayoutInput,
): AnnuityPayoutOutput {
  const principal = Math.max(0, input.principal);
  const annualRate = Math.max(0, input.annualRatePercent) / 100;
  const years = Math.max(1, Math.min(50, Math.round(input.years)));
  const monthly = input.monthly ?? true;

  const n = monthly ? years * 12 : years;
  const r = monthly ? annualRate / 12 : annualRate;

  if (principal <= 0) {
    return {
      paymentPerPeriod: 0,
      totalPayments: 0,
      totalInterest: 0,
      yearlyBreakdown: [],
    };
  }

  let paymentPerPeriod: number;
  if (r === 0) {
    paymentPerPeriod = principal / n;
  } else {
    paymentPerPeriod =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const yearlyBreakdown: AnnuityYearRow[] = [];
  let balance = principal;
  const periodsPerYear = monthly ? 12 : 1;
  let totalPayments = 0;
  let totalInterest = 0;

  for (let y = 1; y <= years; y++) {
    let yearPayments = 0;
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let p = 0; p < periodsPerYear && balance > 0; p++) {
      const interestPortion = balance * r;
      const principalPortion = Math.min(
        paymentPerPeriod - interestPortion,
        balance,
      );
      balance = Math.max(0, balance - principalPortion);
      yearPayments += paymentPerPeriod;
      yearInterest += interestPortion;
      yearPrincipal += principalPortion;
    }
    totalPayments += yearPayments;
    totalInterest += yearInterest;
    yearlyBreakdown.push({
      year: y,
      payments: Math.round(yearPayments * 100) / 100,
      interest: Math.round(yearInterest * 100) / 100,
      principalPaid: Math.round(yearPrincipal * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return {
    paymentPerPeriod: Math.round(paymentPerPeriod * 100) / 100,
    totalPayments: Math.round(totalPayments * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}
