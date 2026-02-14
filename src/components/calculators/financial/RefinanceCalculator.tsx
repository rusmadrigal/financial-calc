"use client";

import { useState, useMemo } from "react";
import {
  Download,
  Copy,
  FileSpreadsheet,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateRefinance } from "@/lib/helpers/financial/calculateRefinance";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState("300000");
  const [currentRate, setCurrentRate] = useState("7");
  const [remainingYears, setRemainingYears] = useState("25");
  const [newRate, setNewRate] = useState("6");
  const [newTermYears, setNewTermYears] = useState("30");
  const [closingCosts, setClosingCosts] = useState("5000");

  const result = useMemo(() => {
    const balance = Math.max(0, parseFloat(currentBalance) || 0);
    const remMonths = Math.max(1, (parseFloat(remainingYears) || 0) * 12);
    const newTermMonths = Math.max(1, (parseFloat(newTermYears) || 0) * 12);
    return calculateRefinance({
      currentBalance: balance,
      currentAprPercent: Math.max(0, parseFloat(currentRate) || 0),
      remainingTermMonths: remMonths,
      newAprPercent: Math.max(0, parseFloat(newRate) || 0),
      newTermMonths,
      closingCosts: Math.max(0, parseFloat(closingCosts) || 0),
    });
  }, [
    currentBalance,
    currentRate,
    remainingYears,
    newRate,
    newTermYears,
    closingCosts,
  ]);

  const chartData = useMemo(() => {
    const maxLen = Math.max(
      result.scheduleCurrent.length,
      result.scheduleNew.length,
    );
    const years = Math.ceil(maxLen / 12);
    return Array.from({ length: Math.min(years, 15) }, (_, i) => {
      const y = i + 1;
      const start = i * 12;
      let currInt = 0;
      let newInt = 0;
      let balanceNew = 0;
      for (let m = 0; m < 12; m++) {
        const rowCurr = result.scheduleCurrent[start + m];
        const rowNew = result.scheduleNew[start + m];
        if (rowCurr) currInt += rowCurr.interest;
        if (rowNew) {
          newInt += rowNew.interest;
          balanceNew = rowNew.balance;
        }
      }
      return {
        year: y,
        balance: Math.round(balanceNew),
        current: Math.round(currInt),
        new: Math.round(newInt),
      };
    });
  }, [result.scheduleCurrent, result.scheduleNew]);

  const chartDataLine = useMemo(
    () => chartData.map((row) => ({ year: row.year, balance: row.balance })),
    [chartData],
  );

  const chartDataBar = useMemo(
    () =>
      chartData
        .slice(0, 15)
        .map((row) => ({ year: row.year, current: row.current, new: row.new })),
    [chartData],
  );

  const tableHeaders = ["Month", "Payment", "Principal", "Interest", "Balance"];
  const tableRows = result.scheduleNew.map(
    (row) =>
      [
        row.period,
        Number(row.payment.toFixed(2)),
        Number(row.principal.toFixed(2)),
        Number(row.interest.toFixed(2)),
        Number(row.balance.toFixed(2)),
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Current Payment": usd.format(result.currentPayment),
      "New Payment": usd.format(result.newPayment),
      "Monthly Savings": usd.format(result.monthlySavings),
      "Break-even (months)": result.breakEvenMonths,
      "Total Interest (current)": usd.format(result.totalInterestCurrent),
      "Total Interest (new)": usd.format(result.totalInterestNew),
      "Lifetime Savings": usd.format(result.lifetimeSavings),
    }),
    [result],
  );

  const handleCopyResults = () => {
    const text = Object.entries(summaryData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
    });
  };

  const handleExportPDF = () => {
    exportToPDF("Refinance Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel("Refinance Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    exportToCSV("Refinance-Full-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setCurrentBalance("300000");
    setCurrentRate("7");
    setRemainingYears("25");
    setNewRate("6");
    setNewTermYears("30");
    setClosingCosts("5000");
    toast.info("Calculator reset");
  };

  const previewRows = result.scheduleNew.slice(0, 12);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Current loan vs new loan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentBalance">Current Balance</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="currentBalance"
                    type="number"
                    min={0}
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentRate">Current APR (%)</Label>
                <Input
                  id="currentRate"
                  type="number"
                  min={0}
                  step="0.01"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remainingYears">Remaining Term (years)</Label>
                <Input
                  id="remainingYears"
                  type="number"
                  min={1}
                  value={remainingYears}
                  onChange={(e) => setRemainingYears(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newRate">New APR (%)</Label>
                <Input
                  id="newRate"
                  type="number"
                  min={0}
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newTermYears">New Term (years)</Label>
                <Input
                  id="newTermYears"
                  type="number"
                  min={1}
                  value={newTermYears}
                  onChange={(e) => setNewTermYears(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closingCosts">Closing Costs</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="closingCosts"
                    type="number"
                    min={0}
                    value={closingCosts}
                    onChange={(e) => setClosingCosts(e.target.value)}
                    className="pl-7"
                  />
                </div>
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
              <CardTitle>Refinance Results</CardTitle>
              <CardDescription>Comparison and savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Payment
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.currentPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Payment</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.newPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Savings
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
                    {usd.format(result.monthlySavings)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Break-even</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.breakEvenMonths} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Lifetime Savings
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.lifetimeSavings)}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyResults}>
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="mr-2 size-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 size-4" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Break-even is how many months of savings it takes to recover
              closing costs. Lifetime savings = interest saved minus closing
              costs.
            </AlertDescription>
          </Alert>

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance Over Time</CardTitle>
                <CardDescription>New loan balance by year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataLine}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis dataKey="year" className="text-xs" />
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
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        name="Balance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {chartDataBar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interest Comparison by Year</CardTitle>
                <CardDescription>
                  Current vs new loan interest (first 15 years)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataBar}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="current"
                        fill="var(--chart-3)"
                        name="Current"
                      />
                      <Bar dataKey="new" fill="var(--chart-1)" name="New" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Yearly Breakdown</CardTitle>
                <CardDescription>First 10 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">
                          Current Interest
                        </TableHead>
                        <TableHead className="text-right">
                          New Interest
                        </TableHead>
                        <TableHead className="text-right">
                          New Balance
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartData.slice(0, 10).map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.current)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.new)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>New Loan Schedule (preview)</CardTitle>
              <CardDescription>First 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Month</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">
                          {row.period}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.payment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.principal)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.interest)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {usd.format(row.balance)}
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
                >
                  <Download className="mr-2 size-4" />
                  Download Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> Estimates only. Consult a lender for
          actual refinance terms and closing costs.
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
