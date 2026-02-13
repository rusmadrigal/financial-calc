"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { exportToCSV } from "@/lib/exports/exportToCSV";
import {
  calculateDebtSnowball,
  type DebtEntry,
} from "@/lib/helpers/financial/calculateDebtSnowball";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const defaultDebts: DebtEntry[] = [
  { name: "Credit Card", balance: 5000, aprPercent: 18, minPayment: 150 },
  { name: "Personal Loan", balance: 3000, aprPercent: 10, minPayment: 120 },
  { name: "Store Card", balance: 1200, aprPercent: 22, minPayment: 40 },
];

function DebtRow({
  debt,
  onChange,
  onRemove,
  canRemove,
}: {
  debt: DebtEntry;
  onChange: (d: DebtEntry) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-border pb-3 last:border-0 sm:grid-cols-5">
      <Input
        placeholder="Name"
        value={debt.name}
        onChange={(e) => onChange({ ...debt, name: e.target.value })}
        className="sm:col-span-1"
      />
      <Input
        type="number"
        min={0}
        placeholder="Balance"
        value={debt.balance || ""}
        onChange={(e) =>
          onChange({ ...debt, balance: parseFloat(e.target.value) || 0 })
        }
      />
      <Input
        type="number"
        min={0}
        step="0.01"
        placeholder="APR %"
        value={debt.aprPercent || ""}
        onChange={(e) =>
          onChange({ ...debt, aprPercent: parseFloat(e.target.value) || 0 })
        }
      />
      <Input
        type="number"
        min={0}
        placeholder="Min payment"
        value={debt.minPayment || ""}
        onChange={(e) =>
          onChange({ ...debt, minPayment: parseFloat(e.target.value) || 0 })
        }
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export function DebtSnowballCalculator() {
  const [debts, setDebts] = useState<DebtEntry[]>(defaultDebts);
  const [extraMonthly, setExtraMonthly] = useState("200");

  const result = useMemo(() => {
    return calculateDebtSnowball({
      debts,
      extraMonthlyPayment: Math.max(0, parseFloat(extraMonthly) || 0),
    });
  }, [debts, extraMonthly]);

  const chartDataBalance = useMemo(
    () =>
      result.schedule.map((row) => ({
        month: row.period,
        balance: row.remainingBalance,
      })),
    [result.schedule],
  );

  const chartDataPayment = useMemo(() => {
    const slice = result.schedule.slice(0, 24);
    return slice.map((row) => ({
      month: row.period,
      payment: Math.round(row.totalPayment),
      interest: Math.round(row.totalInterest),
    }));
  }, [result.schedule]);

  const tableHeadersSummary = [
    "Month",
    "Total Payment",
    "Total Interest",
    "Remaining Balance",
  ];
  const tableRowsSummary = result.schedule.map(
    (row) =>
      [
        row.period,
        Number(row.totalPayment.toFixed(2)),
        Number(row.totalInterest.toFixed(2)),
        Number(row.remainingBalance.toFixed(2)),
      ] as (string | number)[],
  );

  const tableHeadersFull = [
    "Period",
    "Debt",
    "Payment",
    "Interest",
    "Principal",
    "Balance",
  ];
  const tableRowsFull = result.debtRows.map(
    (row) =>
      [
        row.period,
        row.debtName,
        Number(row.payment.toFixed(2)),
        Number(row.interest.toFixed(2)),
        Number(row.principal.toFixed(2)),
        Number(row.balance.toFixed(2)),
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Months to Debt-Free": result.monthsToDebtFree,
      "Total Interest": usd.format(result.totalInterest),
      "Payoff Order":
        result.payoffOrder.map((o) => o.debtName).join(" → ") || "—",
    }),
    [result],
  );

  const hasResults = result.schedule.length > 0;

  const handleCopyResults = () => {
    if (!hasResults) return;
    const text = Object.entries(summaryData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
    });
  };

  const addDebt = () =>
    setDebts((d) => [
      ...d,
      { name: "Debt", balance: 0, aprPercent: 0, minPayment: 0 },
    ]);
  const updateDebt = (i: number, debt: DebtEntry) =>
    setDebts((d) => d.map((x, j) => (j === i ? debt : x)));
  const removeDebt = (i: number) =>
    setDebts((d) => d.filter((_, j) => j !== i));

  const handleExportPDF = () => {
    if (!hasResults) return;
    exportToPDF(
      "Debt Snowball",
      summaryData,
      tableHeadersSummary,
      tableRowsSummary,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel(
      "Debt Snowball Schedule",
      result.debtRows.length > 0 ? tableHeadersFull : tableHeadersSummary,
      result.debtRows.length > 0 ? tableRowsFull : tableRowsSummary,
    );
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    const headers =
      result.debtRows.length > 0 ? tableHeadersFull : tableHeadersSummary;
    const rows = result.debtRows.length > 0 ? tableRowsFull : tableRowsSummary;
    exportToCSV("Debt-Snowball-Full-Schedule", headers, rows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setDebts(defaultDebts);
    setExtraMonthly("200");
    toast.info("Calculator reset");
  };

  const previewSummary = result.schedule.slice(0, 12);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Debts (smallest balance first)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Debts</Label>
                <div className="space-y-3">
                  {debts.map((debt, i) => (
                    <DebtRow
                      key={i}
                      debt={debt}
                      onChange={(d) => updateDebt(i, d)}
                      onRemove={() => removeDebt(i)}
                      canRemove={debts.length > 1}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDebt}
                >
                  <Plus className="mr-2 size-4" /> Add debt
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra">Extra monthly payment ($)</Label>
                <Input
                  id="extra"
                  type="number"
                  min={0}
                  value={extraMonthly}
                  onChange={(e) => setExtraMonthly(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Calculate</Button>
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Snowball: pay smallest balance first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Months to Debt-Free
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.monthsToDebtFree}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Interest
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payoff Order</p>
                  <p className="mt-1 text-sm font-medium">
                    {result.payoffOrder.length
                      ? result.payoffOrder.map((o) => o.debtName).join(" → ")
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyResults}
                  disabled={!hasResults}
                >
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={!hasResults}
                >
                  <Download className="mr-2 size-4" /> Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                  disabled={!hasResults}
                >
                  <FileSpreadsheet className="mr-2 size-4" /> Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Snowball: pay minimums on all debts and put extra toward the
              smallest balance. When one is paid off, roll that payment into the
              next.
            </AlertDescription>
          </Alert>

          {hasResults && chartDataBalance.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Remaining Balance Over Time</CardTitle>
                  <CardDescription>
                    Total debt remaining by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartDataBalance}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="var(--chart-3)"
                          strokeWidth={2}
                          name="Remaining Balance"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              {chartDataPayment.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Breakdown Over Time</CardTitle>
                    <CardDescription>
                      Total payment vs. interest by month (first 24 months)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataPayment}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                          />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar
                            dataKey="payment"
                            fill="var(--chart-1)"
                            name="Total Payment"
                          />
                          <Bar
                            dataKey="interest"
                            fill="var(--chart-2)"
                            name="Interest"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {result.payoffOrder.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payoff Order</CardTitle>
                <CardDescription>Order debts are paid off</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Debt</TableHead>
                      <TableHead className="text-right">Payoff Month</TableHead>
                      <TableHead className="text-right">Total Paid</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.payoffOrder.map((o, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>{o.debtName}</TableCell>
                        <TableCell className="text-right">
                          {o.payoffMonth}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(o.totalPaid)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(o.totalInterest)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary (preview)</CardTitle>
              <CardDescription>First 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">
                        Total Payment
                      </TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewSummary.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">
                          {row.period}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.totalPayment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.totalInterest)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.remainingBalance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadFullSchedule}
                  disabled={!hasResults}
                >
                  <Download className="mr-2 size-4" /> Download Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimates only. Minimum payments and APRs may change.
        </AlertDescription>
      </Alert>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur lg:hidden">
        <div className="flex gap-3">
          <Button className="flex-1">Calculate</Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </>
  );
}
