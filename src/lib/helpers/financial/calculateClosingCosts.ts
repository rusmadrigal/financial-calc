/**
 * Closing costs: loan amount + line items (origination %, appraisal, title, etc.) → total and breakdown.
 */

export interface ClosingCostItem {
  label: string;
  amount: number;
  isPercent: boolean;
  /** If isPercent, applied to loan amount */
  value: number;
}

export interface ClosingCostInput {
  loanAmount: number;
  /** Origination fee as percent of loan (e.g. 1) */
  originationPercent?: number;
  /** Appraisal fee (fixed) */
  appraisalFee?: number;
  /** Title insurance (fixed or 0) */
  titleInsurance?: number;
  /** Other fees (fixed) */
  otherFees?: number;
  /** Points (percent of loan, e.g. 0.5 for half point) */
  pointsPercent?: number;
}

export interface ClosingCostOutput {
  loanAmount: number;
  items: ClosingCostItem[];
  totalClosingCosts: number;
}

export function calculateClosingCosts(
  input: ClosingCostInput,
): ClosingCostOutput {
  const loan = Math.max(0, input.loanAmount);
  const items: ClosingCostItem[] = [];

  const originationPct = Math.max(0, input.originationPercent ?? 0);
  if (originationPct > 0) {
    const amt = (loan * originationPct) / 100;
    items.push({
      label: "Origination",
      amount: amt,
      isPercent: true,
      value: originationPct,
    });
  }

  const pointsPct = Math.max(0, input.pointsPercent ?? 0);
  if (pointsPct > 0) {
    const amt = (loan * pointsPct) / 100;
    items.push({
      label: "Points",
      amount: amt,
      isPercent: true,
      value: pointsPct,
    });
  }

  const appraisal = Math.max(0, input.appraisalFee ?? 0);
  if (appraisal > 0) {
    items.push({
      label: "Appraisal",
      amount: appraisal,
      isPercent: false,
      value: appraisal,
    });
  }

  const title = Math.max(0, input.titleInsurance ?? 0);
  if (title > 0) {
    items.push({
      label: "Title insurance",
      amount: title,
      isPercent: false,
      value: title,
    });
  }

  const other = Math.max(0, input.otherFees ?? 0);
  if (other > 0) {
    items.push({
      label: "Other fees",
      amount: other,
      isPercent: false,
      value: other,
    });
  }

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return {
    loanAmount: Math.round(loan * 100) / 100,
    items: items.map((i) => ({
      ...i,
      amount: Math.round(i.amount * 100) / 100,
    })),
    totalClosingCosts: Math.round(total * 100) / 100,
  };
}
