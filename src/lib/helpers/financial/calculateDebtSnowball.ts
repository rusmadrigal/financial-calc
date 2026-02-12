/**
 * Debt snowball: pay minimums on all, put extra toward smallest balance first.
 * As a debt is paid off, roll its minimum into the next target.
 */

export interface DebtEntry {
  name: string;
  balance: number;
  aprPercent: number;
  minPayment: number;
}

export interface DebtSnowballInput {
  debts: DebtEntry[];
  extraMonthlyPayment: number;
}

export interface DebtSnowballPayoffOrderItem {
  debtName: string;
  payoffMonth: number;
  totalPaid: number;
  totalInterest: number;
}

export interface DebtSnowballMonthlySummary {
  period: number;
  totalPayment: number;
  totalInterest: number;
  remainingBalance: number;
}

export interface DebtSnowballDebtRow {
  period: number;
  debtName: string;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface DebtSnowballOutput {
  payoffOrder: DebtSnowballPayoffOrderItem[];
  monthsToDebtFree: number;
  totalInterest: number;
  schedule: DebtSnowballMonthlySummary[];
  debtRows: DebtSnowballDebtRow[];
}

export function runDebtStrategy(
  debts: Array<{
    name: string;
    balance: number;
    apr: number;
    minPayment: number;
  }>,
  extraMonthly: number,
  sortCompare: (
    a: { balance: number; apr: number },
    b: { balance: number; apr: number },
  ) => number,
): Omit<DebtSnowballOutput, never> {
  const list = debts.map((d) => ({
    name: d.name,
    balance: d.balance,
    apr: Math.max(0, d.apr) / 100 / 12,
    minPayment: Math.max(0, d.minPayment),
  }));

  list.sort(sortCompare);

  const payoffOrder: DebtSnowballPayoffOrderItem[] = [];
  const schedule: DebtSnowballMonthlySummary[] = [];
  const debtRows: DebtSnowballDebtRow[] = [];
  let period = 0;
  let totalInterest = 0;
  let totalRemaining = list.reduce((s, d) => s + d.balance, 0);
  const maxMonths = 600;
  let extraAvailable = Math.max(0, extraMonthly);
  const paidOff = new Set<number>();

  while (totalRemaining > 0 && period < maxMonths) {
    period++;
    let totalPaymentThisMonth = 0;
    let totalInterestThisMonth = 0;

    for (let i = 0; i < list.length; i++) {
      const d = list[i];
      if (d.balance <= 0) continue;

      const interest = d.balance * d.apr;
      totalInterestThisMonth += interest;
      totalInterest += interest;

      let payment = d.minPayment;
      const isTarget = !paidOff.has(i) && extraAvailable > 0;
      if (isTarget) {
        payment += extraAvailable;
        extraAvailable = 0;
      }

      const totalOwed = d.balance + interest;
      const paymentApplied = Math.min(payment, totalOwed);
      const principal = Math.min(paymentApplied - interest, d.balance);
      d.balance = Math.max(0, d.balance - principal);
      totalPaymentThisMonth += paymentApplied;

      debtRows.push({
        period,
        debtName: d.name,
        payment: paymentApplied,
        interest,
        principal,
        balance: d.balance,
      });

      if (d.balance <= 0) {
        paidOff.add(i);
        const totalPaidForDebt = debtRows
          .filter((r) => r.debtName === d.name)
          .reduce((s, r) => s + r.payment, 0);
        const interestForDebt = debtRows
          .filter((r) => r.debtName === d.name)
          .reduce((s, r) => s + r.interest, 0);
        payoffOrder.push({
          debtName: d.name,
          payoffMonth: period,
          totalPaid: totalPaidForDebt,
          totalInterest: interestForDebt,
        });
        extraAvailable += d.minPayment;
      }
    }

    totalRemaining = list.reduce((s, d) => s + d.balance, 0);
    schedule.push({
      period,
      totalPayment: totalPaymentThisMonth,
      totalInterest: totalInterestThisMonth,
      remainingBalance: totalRemaining,
    });
  }

  return {
    monthsToDebtFree: period,
    totalInterest,
    schedule,
    debtRows,
    payoffOrder,
  };
}

export function calculateDebtSnowball(
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
    (a, b) => a.balance - b.balance,
  ) as DebtSnowballOutput;
}
