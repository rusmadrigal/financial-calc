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
import { calculateInflation } from "@/lib/helpers/financial/calculateInflation";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function InflationCalculator() {
  const [amount, setAmount] = useState("10000");
  const [inflationPct, setInflationPct] = useState("3");
  const [years, setYears] = useState("10");

  const result = useMemo(
    () =>
      calculateInflation({
        amount: parseFloat(amount) || 0,
        inflationPercentPerYear: parseFloat(inflationPct) || 0,
        years: parseInt(years, 10) || 10,
      }),
    [amount, inflationPct, years],
  );

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((r) => ({
        year: r.year,
        balance: r.purchasingPower,
      })),
    [result.yearlyBreakdown],
  );
  const chartDataBar = useMemo(
    () =>
      result.yearlyBreakdown.slice(0, 15).map((r) => ({
        year: r.year,
        nominal: r.nominalValue,
        purchasingPower: r.purchasingPower,
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = ["Year", "Nominal value", "Purchasing power"];
  const tableRows = result.yearlyBreakdown
    .slice(0, 10)
    .map((r) => [
      r.year,
      usd.format(r.nominalValue),
      usd.format(r.purchasingPower),
    ]);

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Initial amount": usd.format(result.initialAmount),
      "Inflation %": `${result.inflationPercent}%`,
      [`After ${years} years (nominal)`]: usd.format(result.finalNominalValue),
      "Purchasing power (today's $)": usd.format(result.finalPurchasingPower),
    }),
    [result, years],
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
    exportToPDF("Inflation Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };
  const handleExportExcel = () => {
    exportToExcel("Inflation", tableHeaders, tableRows);
    toast.success("Excel downloaded");
  };
  const handleReset = () => {
    setAmount("10000");
    setInflationPct("3");
    setYears("10");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Amount and inflation rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Amount today ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Annual inflation (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={inflationPct}
                  onChange={(e) => setInflationPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
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
              <CardDescription>Purchasing power over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Initial</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.initialAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nominal in {years} yrs
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.finalNominalValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Purchasing power
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.finalPurchasingPower)}
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
            <Card>
              <CardHeader>
                <CardTitle>Purchasing Power Over Time</CardTitle>
                <CardDescription>Value in today&apos;s dollars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={`${amount}-${inflationPct}-${years}`}
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
                        name="Purchasing power"
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
                <CardTitle>Nominal vs Purchasing Power by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`bar-${amount}-${inflationPct}-${years}`}
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
                        dataKey="nominal"
                        fill="var(--chart-1)"
                        name="Nominal value"
                      />
                      <Bar
                        dataKey="purchasingPower"
                        fill="var(--chart-3)"
                        name="Purchasing power"
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">
                        Nominal value
                      </TableHead>
                      <TableHead className="text-right">
                        Purchasing power
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyBreakdown.slice(0, 10).map((r) => (
                      <TableRow key={r.year}>
                        <TableCell className="font-medium">{r.year}</TableCell>
                        <TableCell className="text-right">
                          {usd.format(r.nominalValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(r.purchasingPower)}
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
              Purchasing power = equivalent value in today&apos;s dollars.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimate only. Actual inflation varies.
        </AlertDescription>
      </Alert>
    </>
  );
}
