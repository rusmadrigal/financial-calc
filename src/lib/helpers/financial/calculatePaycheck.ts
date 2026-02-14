/**
 * Paycheck (simplified): gross per period, pay frequency, state rate → net, federal, FICA, state.
 */

export type PayFrequency =
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly"
  | "annual";

export interface PaycheckInput {
  grossAmount: number;
  payFrequency: PayFrequency;
  federalExemptions?: number;
  stateTaxPercent?: number;
}

export interface PaycheckOutput {
  grossPay: number;
  federalWithholding: number;
  socialSecurity: number;
  medicare: number;
  stateTax: number;
  netPay: number;
  annualGross: number;
}

const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const SS_WAGE_LIMIT_2024 = 168_600;

function getPeriodsPerYear(freq: PayFrequency): number {
  switch (freq) {
    case "weekly":
      return 52;
    case "biweekly":
      return 26;
    case "semimonthly":
      return 24;
    case "monthly":
      return 12;
    case "annual":
      return 1;
    default:
      return 26;
  }
}

/** Simplified federal: flat 12% of (annual - exemption). */
function annualFederal(annualGross: number, exemptions: number): number {
  const exempt = exemptions * 4_400;
  return Math.max(0, annualGross - exempt) * 0.12;
}

export function calculatePaycheck(input: PaycheckInput): PaycheckOutput {
  const gross = Math.max(0, input.grossAmount);
  const freq = input.payFrequency ?? "biweekly";
  const exemptions = Math.max(0, input.federalExemptions ?? 0);
  const statePct = Math.max(0, Math.min(100, input.stateTaxPercent ?? 0)) / 100;

  const periodsPerYear = getPeriodsPerYear(freq);
  const annualGross = gross * periodsPerYear;

  const federalAnnual = annualFederal(annualGross, exemptions);
  const federalWithholding = federalAnnual / periodsPerYear;

  const ssAnnual = Math.min(annualGross, SS_WAGE_LIMIT_2024) * SS_RATE;
  const socialSecurity = ssAnnual / periodsPerYear;

  const medicareAnnual = annualGross * MEDICARE_RATE;
  const medicare = medicareAnnual / periodsPerYear;

  const stateAnnual = annualGross * statePct;
  const stateTax = stateAnnual / periodsPerYear;

  const netPay =
    gross - federalWithholding - socialSecurity - medicare - stateTax;

  return {
    grossPay: Math.round(gross * 100) / 100,
    federalWithholding: Math.round(federalWithholding * 100) / 100,
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    netPay: Math.round(Math.max(0, netPay) * 100) / 100,
    annualGross: Math.round(annualGross * 100) / 100,
  };
}
