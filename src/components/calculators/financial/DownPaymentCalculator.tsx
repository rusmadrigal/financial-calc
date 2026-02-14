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
import { calculateDownPayment } from "@/lib/helpers/financial/calculateDownPayment";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function DownPaymentCalculator() {
  const [homePrice, setHomePrice] = useState("400000");
  const [downPct, setDownPct] = useState("20");
  const [currentSavings, setCurrentSavings] = useState("25000");
  const [monthlySavings, setMonthlySavings] = useState("1500");
  const [savingsRate, setSavingsRate] = useState("4");

  const result = useMemo(() => {
    return calculateDownPayment({
      homePrice: parseFloat(homePrice) || 0,
      downPaymentPercent: parseFloat(downPct) || 0,
      currentSavings: parseFloat(currentSavings) || 0,
      monthlySavings: parseFloat(monthlySavings) || 0,
      savingsRatePercent: parseFloat(savingsRate) || 0,
    });
  }, [homePrice, downPct, currentSavings, monthlySavings, savingsRate]);

  const tableHeaders = ["Metric", "Value"];
  const tableRows: (string | number)[][] = [
    ["Home price", usd.format(result.homePrice)],
    ["Down payment %", `${result.downPaymentPercent}%`],
    ["Down payment amount", usd.format(result.downPaymentAmount)],
    ["Loan amount", usd.format(result.loanAmount)],
    ...(result.monthsToGoal !== null
      ? [["Months to goal", result.monthsToGoal]]
      : []),
  ];

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Down Payment": usd.format(result.downPaymentAmount),
      "Loan Amount": usd.format(result.loanAmount),
      ...(result.monthsToGoal !== null
        ? { "Months to goal": result.monthsToGoal }
        : {}),
    }),
    [result],
  );

  const hasResults = result.homePrice > 0;

  const yearlyData = useMemo(() => {
    const goal = result.downPaymentAmount;
    const current = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlySavings) || 0;
    const monthlyRate = (parseFloat(savingsRate) || 0) / 100 / 12;
    const byYear: {
      year: number;
      balance: number;
      contributions: number;
      interest: number;
    }[] = [];
    let balance = current;
    const maxYears = 15;
    for (let y = 1; y <= maxYears; y++) {
      const startBalance = balance;
      let contributions = 0;
      for (let m = 0; m < 12; m++) {
        balance += monthly;
        contributions += monthly;
        balance *= 1 + monthlyRate;
      }
      const interest =
        Math.round((balance - startBalance - contributions) * 100) / 100;
      byYear.push({
        year: y,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round(contributions * 100) / 100,
        interest,
      });
      if (balance >= goal) break;
    }
    return byYear;
  }, [result.downPaymentAmount, currentSavings, monthlySavings, savingsRate]);

  const chartDataLine = useMemo(
    () => yearlyData.map((row) => ({ year: row.year, balance: row.balance })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () =>
      yearlyData.slice(0, 15).map((row) => ({
        year: row.year,
        contributions: row.contributions,
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
      "Down Payment Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Down Payment", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleReset = () => {
    setHomePrice("400000");
    setDownPct("20");
    setCurrentSavings("25000");
    setMonthlySavings("1500");
    setSavingsRate("4");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Home price and savings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Home price ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Down payment (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={downPct}
                  onChange={(e) => setDownPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Current savings ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly savings ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Savings growth rate (% APY)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(e.target.value)}
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
              <CardDescription>Down payment and loan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Down payment</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.downPaymentAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan amount</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.loanAmount)}
                  </p>
                </div>
                {result.monthsToGoal !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Months to goal
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {result.monthsToGoal}
                    </p>
                  </div>
                )}
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
                <CardTitle>Savings Balance Over Time</CardTitle>
                <CardDescription>
                  Projected balance by year toward down payment
                </CardDescription>
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
                <CardTitle>Contributions vs Interest by Year</CardTitle>
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
                        dataKey="contributions"
                        fill="var(--chart-1)"
                        name="Contributions"
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
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-right">
                          Contributions
                        </TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyPreviewRows.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.balance)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.contributions)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.interest)}
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
              Months to goal assumes you save the monthly amount and earn the
              given APY. 20% down often avoids PMI.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
