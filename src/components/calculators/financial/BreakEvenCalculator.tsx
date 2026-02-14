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
import { calculateBreakEven } from "@/lib/helpers/financial/calculateBreakEven";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("50000");
  const [variableCost, setVariableCost] = useState("15");
  const [pricePerUnit, setPricePerUnit] = useState("30");
  const [unitsPerYear, setUnitsPerYear] = useState("5000");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    return calculateBreakEven({
      fixedCostsAnnual: parseFloat(fixedCosts) || 0,
      variableCostPerUnit: parseFloat(variableCost) || 0,
      pricePerUnit: parseFloat(pricePerUnit) || 0,
      unitsSoldPerYear: parseFloat(unitsPerYear) || 0,
      years: parseInt(years, 10) || 10,
    });
  }, [fixedCosts, variableCost, pricePerUnit, unitsPerYear, years]);

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: row.year,
        balance: row.profit * row.year,
      })),
    [result.yearlyBreakdown],
  );

  const chartDataBar = useMemo(
    () =>
      result.yearlyBreakdown.slice(0, 15).map((row) => ({
        year: row.year,
        annual: row.profit,
        cumulative: row.profit * row.year,
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = ["Year", "Revenue", "Cost", "Profit", "Cumulative"];
  const tableRows = result.yearlyBreakdown.map((row) => [
    row.year,
    usd.format(row.revenue),
    usd.format(row.cost),
    usd.format(row.profit),
    usd.format(row.profit * row.year),
  ]);

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Break-even units": result.breakEvenUnits.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      }),
      "Contribution margin/unit": usd.format(result.contributionMarginPerUnit),
      "Fixed costs (annual)": usd.format(parseFloat(fixedCosts) || 0),
    }),
    [result, fixedCosts],
  );

  const hasResults = true;
  const hasYearlyData = result.yearlyBreakdown.length > 0;

  const handleCopyResults = () => {
    const text = Object.entries(summaryData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    void navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Results copied!"));
  };

  const handleExportPDF = () => {
    exportToPDF("Break Even Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel("Break Even", tableHeaders, tableRows);
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setFixedCosts("50000");
    setVariableCost("15");
    setPricePerUnit("30");
    setUnitsPerYear("5000");
    setYears("10");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Costs and price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Fixed costs (annual) ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Variable cost per unit ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={variableCost}
                    onChange={(e) => setVariableCost(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Price per unit ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Units sold per year (for chart)</Label>
                <Input
                  type="number"
                  min={0}
                  value={unitsPerYear}
                  onChange={(e) => setUnitsPerYear(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Years to project</Label>
                <Input
                  type="number"
                  min={1}
                  max={15}
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
              <CardDescription>Break-even quantity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Break-even units
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.breakEvenUnits.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contribution margin/unit
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.contributionMarginPerUnit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    At {unitsPerYear} units/year
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.yearlyBreakdown[0]
                      ? usd.format(result.yearlyBreakdown[0].profit)
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyResults}>
                  <Copy className="mr-2 size-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="mr-2 size-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 size-4" /> Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {hasYearlyData && chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Profit Over Time</CardTitle>
                <CardDescription>
                  Total profit accumulated by year at given volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={`line-${fixedCosts}-${variableCost}-${pricePerUnit}-${unitsPerYear}-${years}`}
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
                        name="Cumulative profit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {hasYearlyData && chartDataBar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Annual vs Cumulative Profit by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`bar-${fixedCosts}-${variableCost}-${pricePerUnit}-${unitsPerYear}-${years}`}
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
                        dataKey="annual"
                        fill="var(--chart-1)"
                        name="Annual profit"
                      />
                      <Bar
                        dataKey="cumulative"
                        fill="var(--chart-3)"
                        name="Cumulative profit"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {hasYearlyData && result.yearlyBreakdown.length > 0 && (
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
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
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
                            {usd.format(row.revenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.cost)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.profit)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.profit * row.year)}
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
              Break-even = fixed costs ÷ (price − variable cost per unit). Line
              chart shows cumulative profit; bar chart shows annual vs
              cumulative per year.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimates only. Actual results depend on volume and costs.
        </AlertDescription>
      </Alert>
    </>
  );
}
