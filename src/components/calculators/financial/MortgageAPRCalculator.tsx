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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { calculateMortgageAPR } from "@/lib/helpers/financial/calculateMortgageAPR";
import { calculateMortgage } from "@/lib/helpers/financial/calculateMortgage";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function MortgageAPRCalculator() {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [statedRate, setStatedRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [closingCosts, setClosingCosts] = useState("6000");

  const result = useMemo(() => {
    return calculateMortgageAPR({
      loanAmount: parseFloat(loanAmount) || 0,
      statedRatePercent: parseFloat(statedRate) || 0,
      termYears: parseFloat(termYears) || 30,
      closingCosts: parseFloat(closingCosts) || 0,
    });
  }, [loanAmount, statedRate, termYears, closingCosts]);

  const tableHeaders = ["Metric", "Value"];
  const tableRows: (string | number)[][] = [
    ["Loan amount", usd.format(result.loanAmount)],
    ["Stated rate (%)", `${result.statedRatePercent}%`],
    ["APR (%)", `${result.aprPercent}%`],
    ["Closing costs", usd.format(result.closingCosts)],
    ["Net loan", usd.format(result.netLoanAmount)],
    ["Monthly payment", usd.format(result.monthlyPayment)],
    ["Total interest", usd.format(result.totalInterest)],
  ];

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "APR (%)": `${result.aprPercent}%`,
      "Monthly Payment": usd.format(result.monthlyPayment),
      "Total Interest": usd.format(result.totalInterest),
      "Closing Costs": usd.format(result.closingCosts),
    }),
    [result],
  );

  const hasResults = result.loanAmount > 0;

  const mortgageSchedule = useMemo(() => {
    if (!hasResults) return null;
    return calculateMortgage({
      homePrice: result.loanAmount,
      downPayment: 0,
      aprPercent: result.statedRatePercent,
      termYears: parseFloat(termYears) || 30,
    });
  }, [hasResults, result.loanAmount, result.statedRatePercent, termYears]);

  const yearlyData = useMemo(() => {
    if (!mortgageSchedule?.schedule.length) return [];
    const byYear: {
      year: number;
      balance: number;
      principal: number;
      interest: number;
    }[] = [];
    const schedule = mortgageSchedule.schedule;
    for (let y = 1; y <= Math.ceil(schedule.length / 12); y++) {
      const start = (y - 1) * 12;
      const end = Math.min(y * 12, schedule.length);
      let principalSum = 0;
      let interestSum = 0;
      let endBalance = 0;
      for (let i = start; i < end; i++) {
        const row = schedule[i];
        if (row) {
          principalSum += row.principal;
          interestSum += row.interest;
          endBalance = row.balance;
        }
      }
      byYear.push({
        year: y,
        balance: Math.round(endBalance),
        principal: Math.round(principalSum * 100) / 100,
        interest: Math.round(interestSum * 100) / 100,
      });
    }
    return byYear;
  }, [mortgageSchedule]);

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

  const yearlyPreviewRows = yearlyData.slice(0, 10);

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
    exportToPDF(
      "Mortgage APR Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Mortgage APR", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleReset = () => {
    setLoanAmount("300000");
    setStatedRate("6.5");
    setTermYears("30");
    setClosingCosts("6000");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Loan and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loan amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stated rate (APR %)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={statedRate}
                  onChange={(e) => setStatedRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Term (years)</Label>
                <Input
                  type="number"
                  min={1}
                  value={termYears}
                  onChange={(e) => setTermYears(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Closing costs ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
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
              <CardTitle>Results</CardTitle>
              <CardDescription>True cost (APR)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">APR (%)</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.aprPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly payment
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total interest
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalInterest)}
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
                  <Copy className="mr-2 size-4" /> Copy
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

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance Over Time</CardTitle>
                <CardDescription>Loan balance by year</CardDescription>
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

          {yearlyPreviewRows.length > 0 && (
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
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyPreviewRows.map((row) => (
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

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              APR reflects the true annual cost including closing costs. Higher
              than the stated rate when fees are included.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          APR is an estimate. Lenders must disclose APR on loan estimates.
        </AlertDescription>
      </Alert>
    </>
  );
}
