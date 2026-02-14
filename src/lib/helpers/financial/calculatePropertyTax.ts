/**
 * Property tax: assessed value × rate (mill rate or %) → annual tax, monthly equivalent.
 * Supports annual rate as percent of assessed value (e.g. 1.2%).
 */

export interface PropertyTaxInput {
  assessedValue: number;
  /** Annual tax rate as percent of assessed value (e.g. 1.2 for 1.2%) */
  annualRatePercent: number;
  /** Optional: annual exemption amount (reduces taxable value or direct deduction) */
  annualExemption?: number;
}

export interface PropertyTaxOutput {
  assessedValue: number;
  taxableValue: number;
  annualRatePercent: number;
  annualTax: number;
  monthlyEquivalent: number;
}

export function calculatePropertyTax(
  input: PropertyTaxInput,
): PropertyTaxOutput {
  const assessedValue = Math.max(0, input.assessedValue);
  const ratePct = Math.max(0, input.annualRatePercent) / 100;
  const exemption = Math.max(0, input.annualExemption ?? 0);
  const taxableValue = Math.max(0, assessedValue - exemption);
  const annualTax = Math.round(taxableValue * ratePct * 100) / 100;
  const monthlyEquivalent = Math.round((annualTax / 12) * 100) / 100;

  return {
    assessedValue: Math.round(assessedValue * 100) / 100,
    taxableValue: Math.round(taxableValue * 100) / 100,
    annualRatePercent: input.annualRatePercent,
    annualTax,
    monthlyEquivalent,
  };
}
