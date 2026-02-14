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
import { calculateStartupCosts } from "@/lib/helpers/financial/calculateStartupCosts";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function StartupCostCalculator() {
  const [oneTime, setOneTime] = useState("25000");
  const [recurring, setRecurring] = useState("5000");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    return calculateStartupCosts({
      oneTimeCosts: parseFloat(oneTime) || 0,
      recurringMonthly: parseFloat(recurring) || 0,
      years: parseInt(years, 10) || 5,
    });
  }, [oneTime, recurring, years]);

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: row.year,
        balance: row.cumulative,
      })),
    [result.yearlyBreakdown],
  );

  const chartDataBar = useMemo(
    () =>
      result.yearlyBreakdown.slice(0, 15).map((row) => ({
        year: row.year,
        oneTime: row.oneTime,
        recurring: row.recurring,
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = ["Year", "One-time", "Recurring", "Total", "Cumulative"];
  const tableRows = result.yearlyBreakdown.map((row) => [
    row.year,
    usd.format(row.oneTime),
    usd.format(row.recurring),
    usd.format(row.total),
    usd.format(row.cumulative),
  ]);

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "One-time costs": usd.format(result.oneTimeCosts),
      "Recurring (monthly)": usd.format(result.recurringMonthly),
      "First year total": usd.format(result.totalFirstYear),
    }),
    [result],
  );

  const hasResults = result.yearlyBreakdown.length > 0;

  const handleCopyResults = () => {
    if (!hasResults) return;
    void navigator.clipboard
      .writeText(
        Object.entries(summaryData)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
      )
      .then(() => toast.success("Results copied!"));
  };

  const handleExportPDF = () => {
    if (!hasResults) return;
    exportToPDF(
      "Startup Cost Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Startup Costs", tableHeaders, tableRows);
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setOneTime("25000");
    setRecurring("5000");
    setYears("5");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>One-time and recurring costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>One-time costs ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={oneTime}
                    onChange={(e) => setOneTime(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Recurring monthly ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years to project</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
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
              <CardDescription>First year and totals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">One-time</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.oneTimeCosts)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    First year total
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalFirstYear)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recurring (monthly)
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.recurringMonthly)}
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
                <CardTitle>Cumulative Cost Over Time</CardTitle>
                <CardDescription>Total costs by year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={`line-${oneTime}-${recurring}-${years}`}
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
                        name="Cumulative"
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
                <CardTitle>One-time vs Recurring by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`bar-${oneTime}-${recurring}-${years}`}
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
                        dataKey="oneTime"
                        fill="var(--chart-1)"
                        name="One-time"
                      />
                      <Bar
                        dataKey="recurring"
                        fill="var(--chart-3)"
                        name="Recurring"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {result.yearlyBreakdown.length > 0 && (
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
                        <TableHead className="text-right">One-time</TableHead>
                        <TableHead className="text-right">Recurring</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Cumulative</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.yearlyBreakdown.slice(0, 10).map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.oneTime)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.recurring)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.cumulative)}
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
              One-time costs are applied in year 1 only. Recurring is monthly ×
              12 per year.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimates only. Actual startup costs vary by business.
        </AlertDescription>
      </Alert>
    </>
  );
}
