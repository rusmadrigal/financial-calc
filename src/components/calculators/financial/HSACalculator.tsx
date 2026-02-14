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
import { calculateHSA } from "@/lib/helpers/financial/calculateHSA";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function HSACalculator() {
  const [currentBalance, setCurrentBalance] = useState("5000");
  const [annualContribution, setAnnualContribution] = useState("4000");
  const [growthPct, setGrowthPct] = useState("7");
  const [years, setYears] = useState("15");

  const result = useMemo(
    () =>
      calculateHSA({
        currentBalance: parseFloat(currentBalance) || 0,
        annualContribution: parseFloat(annualContribution) || 0,
        growthPercent: parseFloat(growthPct) || 0,
        years: parseInt(years, 10) || 15,
      }),
    [currentBalance, annualContribution, growthPct, years],
  );

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((r) => ({ year: r.year, balance: r.balance })),
    [result.yearlyBreakdown],
  );
  const chartDataBar = useMemo(
    () =>
      result.yearlyBreakdown.slice(0, 15).map((r) => ({
        year: r.year,
        contributions: r.contributions,
        interest: r.interest,
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = ["Year", "Balance", "Contributions", "Interest"];
  const tableRows = result.yearlyBreakdown
    .slice(0, 10)
    .map((r) => [
      r.year,
      usd.format(r.balance),
      usd.format(r.contributions),
      usd.format(r.interest),
    ]);

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Final balance": usd.format(result.finalBalance),
      "Total contributions": usd.format(result.totalContributions),
      "Total interest": usd.format(result.totalInterest),
    }),
    [result],
  );

  const hasResults = result.yearlyBreakdown.length > 0;

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(
        Object.entries(summaryData)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
      )
      .then(() => toast.success("Copied!"));
  };
  const handleExportPDF = () => {
    exportToPDF("HSA Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };
  const handleExportExcel = () => {
    exportToExcel("HSA", tableHeaders, tableRows);
    toast.success("Excel downloaded");
  };
  const handleReset = () => {
    setCurrentBalance("5000");
    setAnnualContribution("4000");
    setGrowthPct("7");
    setYears("15");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>HSA balance and contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Current HSA balance ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Annual contribution ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={annualContribution}
                    onChange={(e) => setAnnualContribution(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expected growth (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={growthPct}
                  onChange={(e) => setGrowthPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input
                  type="number"
                  min={1}
                  max={40}
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Calculate</Button>
                <Button variant="outline" onClick={handleReset}>
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
              <CardDescription>Projected HSA balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Final balance</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.finalBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total contributions
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalContributions)}
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
              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
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
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Balance Over Time</CardTitle>
                  <CardDescription>HSA balance by year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        key={`line-${currentBalance}-${annualContribution}-${growthPct}-${years}`}
                        data={chartDataLine}
                      >
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
              <Card>
                <CardHeader>
                  <CardTitle>Contributions vs Interest by Year</CardTitle>
                  <CardDescription>First 15 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        key={`bar-${currentBalance}-${annualContribution}-${years}`}
                        data={chartDataBar}
                      >
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
            </>
          )}
          {result.yearlyBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Yearly Breakdown</CardTitle>
                <CardDescription>First 10 years</CardDescription>
              </CardHeader>
              <CardContent>
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
                    {result.yearlyBreakdown.slice(0, 10).map((r) => (
                      <TableRow key={r.year}>
                        <TableCell className="font-medium">{r.year}</TableCell>
                        <TableCell className="text-right">
                          {usd.format(r.balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(r.contributions)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(r.interest)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              HSA contributions are tax-deductible. Qualified withdrawals are
              tax-free. Contribution limits apply.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimate only. Consult your plan and a tax advisor.
        </AlertDescription>
      </Alert>
    </>
  );
}
