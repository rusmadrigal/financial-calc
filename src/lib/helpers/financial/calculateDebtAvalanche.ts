/**
 * Debt avalanche: pay minimums on all, put extra toward highest APR first.
 * As a debt is paid off, roll its minimum into the next target.
 */

import {
  runDebtStrategy,
  type DebtEntry,
  type DebtSnowballInput,
  type DebtSnowballOutput,
} from "./calculateDebtSnowball";

export type { DebtEntry };
export type DebtAvalancheInput = DebtSnowballInput;
export type DebtAvalancheOutput = DebtSnowballOutput;

export function calculateDebtAvalanche(
  input: DebtSnowballInput,
): DebtSnowballOutput {
  const debts = (input.debts ?? [])
    .filter((d) => d.balance > 0)
    .map((d) => ({
      name: d.name || "Debt",
      balance: Math.max(0, d.balance),
      apr: Math.max(0, d.aprPercent),
      minPayment: Math.max(0, d.minPayment),
    }));

  const extra = Math.max(0, input.extraMonthlyPayment);

  if (debts.length === 0) {
    return {
      payoffOrder: [],
      monthsToDebtFree: 0,
      totalInterest: 0,
      schedule: [],
      debtRows: [],
    };
  }

  return runDebtStrategy(
    debts,
    extra,
    (a, b) => b.apr - a.apr,
  ) as DebtSnowballOutput;
}
