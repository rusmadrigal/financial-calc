/**
 * Simplified Social Security benefit estimator.
 * Uses estimated benefit at FRA and claiming age to approximate monthly benefit.
 * FRA assumed 67; reduction ~5.5% per year before FRA (before 67), increase ~8% per year after (up to 70).
 */

export interface SocialSecurityInput {
  /** Estimated monthly benefit at Full Retirement Age (67) */
  estimatedBenefitAtFRA: number;
  /** Age at which you plan to start claiming (62–70) */
  ageToClaim: number;
  /** Years to project benefits (e.g. 25) */
  yearsOfBenefits: number;
}

export interface SocialSecurityYearRow {
  year: number;
  age: number;
  monthlyBenefit: number;
  yearlyBenefit: number;
}

export interface SocialSecurityOutput {
  monthlyBenefit: number;
  yearlyBenefit: number;
  totalProjectedBenefits: number;
  yearlyBreakdown: SocialSecurityYearRow[];
}

const FRA_AGE = 67;
const REDUCTION_PER_YEAR_EARLY = 0.055; // ~5.5% per year before FRA
const INCREASE_PER_YEAR_DELAYED = 0.08; // ~8% per year after FRA up to 70

export function calculateSocialSecurity(
  input: SocialSecurityInput,
): SocialSecurityOutput {
  const benefitAtFRA = Math.max(0, input.estimatedBenefitAtFRA);
  const ageToClaim = Math.max(62, Math.min(70, Math.round(input.ageToClaim)));
  const yearsOfBenefits = Math.max(
    1,
    Math.min(40, Math.round(input.yearsOfBenefits)),
  );

  let multiplier = 1;
  if (ageToClaim < FRA_AGE) {
    const yearsEarly = FRA_AGE - ageToClaim;
    multiplier = 1 - yearsEarly * REDUCTION_PER_YEAR_EARLY;
  } else if (ageToClaim > FRA_AGE) {
    const yearsDelayed = Math.min(ageToClaim - FRA_AGE, 3);
    multiplier = 1 + yearsDelayed * INCREASE_PER_YEAR_DELAYED;
  }

  const monthlyBenefit = Math.max(0, benefitAtFRA * multiplier);
  const yearlyBenefit = monthlyBenefit * 12;

  const yearlyBreakdown: SocialSecurityYearRow[] = [];
  for (let y = 1; y <= yearsOfBenefits; y++) {
    const age = ageToClaim + y - 1;
    yearlyBreakdown.push({
      year: y,
      age,
      monthlyBenefit,
      yearlyBenefit,
    });
  }

  const totalProjectedBenefits = yearlyBenefit * yearsOfBenefits;

  return {
    monthlyBenefit,
    yearlyBenefit,
    totalProjectedBenefits,
    yearlyBreakdown,
  };
}
