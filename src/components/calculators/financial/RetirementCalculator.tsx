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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateRetirement } from "@/lib/helpers/financial/calculateRetirement";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function RetirementCalculator() {
  const [currentSavings, setCurrentSavings] = useState("100000");
  const [monthlyContribution, setMonthlyContribution] = useState("1000");
  const [yearsToRetirement, setYearsToRetirement] = useState("25");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [annualIncomeNeeded, setAnnualIncomeNeeded] = useState("60000");
  const [yearsInRetirement, setYearsInRetirement] = useState("30");
  const [retirementReturn, setRetirementReturn] = useState("4");

  const result = useMemo(() => {
    return calculateRetirement({
      currentSavings: Math.max(0, parseFloat(currentSavings) || 0),
      monthlyContribution: Math.max(0, parseFloat(monthlyContribution) || 0),
      yearsToRetirement: Math.max(1, parseInt(yearsToRetirement, 10) || 25),
      expectedReturnPercent: Math.max(0, parseFloat(expectedReturn) || 0),
      annualIncomeNeeded: Math.max(0, parseFloat(annualIncomeNeeded) || 0),
      yearsInRetirement: Math.max(1, parseInt(yearsInRetirement, 10) || 30),
      retirementReturnPercent: Math.max(0, parseFloat(retirementReturn) || 0),
    });
  }, [
    currentSavings,
    monthlyContribution,
    yearsToRetirement,
    expectedReturn,
    annualIncomeNeeded,
    yearsInRetirement,
    retirementReturn,
  ]);

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: row.year,
        balance: Math.round(row.balance),
        phase: row.phase,
      })),
    [result.yearlyBreakdown],
  );

  const chartDataRetirement = useMemo(
    () =>
      result.yearlyBreakdown
        .filter((r) => r.phase === "retirement")
        .map((r) => ({
          year: r.year,
          balance: Math.round(r.balance),
          withdrawal: Math.round(r.withdrawal ?? 0),
        })),
    [result.yearlyBreakdown],
  );

  const retirementStartYear =
    result.yearlyBreakdown.find((r) => r.phase === "retirement")?.year ?? 0;

  const tableHeaders = ["Year", "Balance", "Phase", "Withdrawal"];
  const tableRows = result.yearlyBreakdown.map(
    (row) =>
      [
        row.year,
        Number(row.balance.toFixed(2)),
        row.phase,
        row.withdrawal != null ? Number(row.withdrawal.toFixed(2)) : "",
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Balance at Retirement": usd.format(result.balanceAtRetirement),
      "Total Contributions": usd.format(result.totalContributions),
      "Can Meet Income": result.canMeetIncome ? "Yes" : "No",
    }),
    [result],
  );

  const hasResults = result.yearlyBreakdown.length > 0;
  const previewRows = result.yearlyBreakdown.slice(0, 15);

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
    exportToPDF("Retirement Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Retirement Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    exportToCSV("Retirement-Full-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setCurrentSavings("100000");
    setMonthlyContribution("1000");
    setYearsToRetirement("25");
    setExpectedReturn("7");
    setAnnualIncomeNeeded("60000");
    setYearsInRetirement("30");
    setRetirementReturn("4");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Retirement projection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Current Savings ($)</Label>
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
                <Label>Monthly Contribution ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years to Retirement</Label>
                <Input
                  type="number"
                  min={1}
                  value={yearsToRetirement}
                  onChange={(e) => setYearsToRetirement(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Return (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Annual Income Needed ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={annualIncomeNeeded}
                    onChange={(e) => setAnnualIncomeNeeded(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years in Retirement</Label>
                <Input
                  type="number"
                  min={1}
                  value={yearsInRetirement}
                  onChange={(e) => setYearsInRetirement(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Retirement Return (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={retirementReturn}
                  onChange={(e) => setRetirementReturn(e.target.value)}
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
              <CardDescription>Projection summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Balance at Retirement
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.balanceAtRetirement)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Contributions
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalContributions)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Annual Income Target
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(parseFloat(annualIncomeNeeded) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Can Meet Income
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.canMeetIncome ? "Yes" : "No"}
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

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Accumulation phase: contributions and growth. Retirement phase:
              fixed annual withdrawal; balance may deplete.
            </AlertDescription>
          </Alert>

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Balance Over Time</CardTitle>
                <CardDescription>Accumulation then drawdown</CardDescription>
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
                      {retirementStartYear > 0 && (
                        <ReferenceLine
                          x={retirementStartYear - 0.5}
                          stroke="var(--muted-foreground)"
                          strokeDasharray="4 4"
                        />
                      )}
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

          {chartDataRetirement.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance & Withdrawal in Retirement</CardTitle>
                <CardDescription>
                  Remaining balance and annual withdrawal by year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataRetirement}>
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
                        dataKey="balance"
                        fill="var(--chart-1)"
                        name="Balance"
                      />
                      <Bar
                        dataKey="withdrawal"
                        fill="var(--chart-2)"
                        name="Withdrawal"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Yearly Breakdown</CardTitle>
              <CardDescription>First 15 years shown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead className="text-right">Withdrawal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">
                          {row.year}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.balance)}
                        </TableCell>
                        <TableCell>{row.phase}</TableCell>
                        <TableCell className="text-right">
                          {row.withdrawal != null
                            ? usd.format(row.withdrawal)
                            : "—"}
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
          Estimates only. Inflation and tax effects not included.
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
