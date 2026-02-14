"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  Download,
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
import { calculateCreditCardPayoff } from "@/lib/helpers/financial/calculateCreditCardPayoff";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("18");
  const [monthlyPayment, setMonthlyPayment] = useState("150");
  const [additionalPayment, setAdditionalPayment] = useState("0");
  const [monthlyFees, setMonthlyFees] = useState("0");

  const result = useMemo(() => {
    return calculateCreditCardPayoff({
      balance: Math.max(0, parseFloat(balance) || 0),
      aprPercent: Math.max(0, parseFloat(apr) || 0),
      monthlyPayment: Math.max(0, parseFloat(monthlyPayment) || 0),
      additionalPayment: Math.max(0, parseFloat(additionalPayment) || 0),
      monthlyFees: Math.max(0, parseFloat(monthlyFees) || 0),
    });
  }, [balance, apr, monthlyPayment, additionalPayment, monthlyFees]);

  const yearlyData = useMemo(() => {
    const years = Math.ceil(result.schedule.length / 12);
    return Array.from({ length: Math.min(years, 15) }, (_, i) => {
      const start = i * 12;
      let principalSum = 0;
      let interestSum = 0;
      let endBalance = 0;
      for (let m = 0; m < 12 && start + m < result.schedule.length; m++) {
        const row = result.schedule[start + m];
        if (row) {
          principalSum += row.principal;
          interestSum += row.interest;
          endBalance = row.balance;
        }
      }
      return {
        year: i + 1,
        balance: Math.round(endBalance),
        principal: Math.round(principalSum),
        interest: Math.round(interestSum),
      };
    });
  }, [result.schedule]);

  const chartDataLine = useMemo(
    () => yearlyData.map((row) => ({ year: row.year, balance: row.balance })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () =>
      yearlyData
        .slice(0, 15)
        .map((row) => ({
          year: row.year,
          principal: row.principal,
          interest: row.interest,
        })),
    [yearlyData],
  );

  const tableHeaders = ["Month", "Payment", "Interest", "Principal", "Balance"];
  const tableRows = result.schedule.map(
    (row) =>
      [
        row.period,
        Number(row.payment.toFixed(2)),
        Number(row.interest.toFixed(2)),
        Number(row.principal.toFixed(2)),
        Number(row.balance.toFixed(2)),
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Months to Payoff": result.monthsToPayoff,
      "Total Interest": usd.format(result.totalInterest),
      "Total Paid": usd.format(result.totalPaid),
      "Payoff Date": result.payoffDate
        ? dateFmt.format(result.payoffDate)
        : "—",
    }),
    [result],
  );

  const hasResults = !result.willNeverPayoff && result.schedule.length > 0;

  const handleCopyResults = () => {
    if (!hasResults) return;
    const text = Object.entries(summaryData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
    });
  };

  const handleExportPDF = () => {
    if (!hasResults) return;
    exportToPDF("Credit Card Payoff", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Credit Card Payoff Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    exportToCSV("Credit-Card-Payoff-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setBalance("5000");
    setApr("18");
    setMonthlyPayment("150");
    setAdditionalPayment("0");
    setMonthlyFees("0");
    toast.info("Calculator reset");
  };

  const previewRows = result.schedule.slice(0, 12);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Balance and payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="balance"
                    type="number"
                    min={0}
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apr">APR (%)</Label>
                <Input
                  id="apr"
                  type="number"
                  min={0}
                  step="0.01"
                  value={apr}
                  onChange={(e) => setApr(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyPayment">Monthly Payment ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    min={0}
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalPayment">
                  Additional Payment ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="additionalPayment"
                    type="number"
                    min={0}
                    value={additionalPayment}
                    onChange={(e) => setAdditionalPayment(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyFees">Monthly Fees ($)</Label>
                <Input
                  id="monthlyFees"
                  type="number"
                  min={0}
                  value={monthlyFees}
                  onChange={(e) => setMonthlyFees(e.target.value)}
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
          {result.willNeverPayoff && (
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <Info className="size-4" />
              <AlertDescription>
                Payment is too low to reduce balance. Increase your monthly
                payment or add extra payments to pay down the balance.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Payoff timeline</CardDescription>
            </CardHeader>
            <CardContent>
              {!result.willNeverPayoff && (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Months to Payoff
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {result.monthsToPayoff}
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
                      <p className="text-sm text-muted-foreground">
                        Total Paid
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {usd.format(result.totalPaid)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payoff Date
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {result.payoffDate
                          ? dateFmt.format(result.payoffDate)
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
                </>
              )}
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Paying more than the minimum, or adding extra payments, shortens
              the payoff period and reduces total interest.
            </AlertDescription>
          </Alert>

          {hasResults && chartDataLine.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Balance Over Time</CardTitle>
                  <CardDescription>Remaining balance by year</CardDescription>
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
              {chartDataBar.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Principal vs Interest by Year</CardTitle>
                    <CardDescription>First 15 years</CardDescription>
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
                            dataKey="principal"
                            fill="var(--chart-1)"
                            name="Principal"
                          />
                          <Bar
                            dataKey="interest"
                            fill="var(--chart-3)"
                            name="Interest"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
              {yearlyData.length > 0 && (
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
                              Principal
                            </TableHead>
                            <TableHead className="text-right">
                              Interest
                            </TableHead>
                            <TableHead className="text-right">
                              Balance
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {yearlyData.slice(0, 10).map((row) => (
                            <TableRow key={row.year}>
                              <TableCell className="font-medium">
                                {row.year}
                              </TableCell>
                              <TableCell className="text-right">
                                {usd.format(row.principal)}
                              </TableCell>
                              <TableCell className="text-right">
                                {usd.format(row.interest)}
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
            </>
          )}

          {hasResults && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>First 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Month</TableHead>
                        <TableHead className="text-right">Payment</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
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
                            {usd.format(row.interest)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.principal)}
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
                    disabled={!hasResults}
                  >
                    <Download className="mr-2 size-4" /> Download Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimates only. Actual interest may vary with statement dates and
          compounding.
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
