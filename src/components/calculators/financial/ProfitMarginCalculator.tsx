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
import { calculateProfitMargin } from "@/lib/helpers/financial/calculateProfitMargin";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState("100000");
  const [cost, setCost] = useState("65000");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    return calculateProfitMargin({
      revenue: parseFloat(revenue) || 0,
      cost: parseFloat(cost) || 0,
      years: parseInt(years, 10) || 10,
    });
  }, [revenue, cost, years]);

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

  const tableHeaders = [
    "Year",
    "Revenue",
    "Cost",
    "Profit",
    "Cumulative",
    "Margin %",
  ];
  const tableRows = result.yearlyBreakdown.map((row) => [
    row.year,
    usd.format(row.revenue),
    usd.format(row.cost),
    usd.format(row.profit),
    usd.format(row.profit * row.year),
    `${row.marginPercent}%`,
  ]);

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      Revenue: usd.format(result.revenue),
      Cost: usd.format(result.cost),
      Profit: usd.format(result.profit),
      "Margin %": `${result.marginPercent}%`,
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
      "Profit Margin Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Profit Margin", tableHeaders, tableRows);
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setRevenue("100000");
    setCost("65000");
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
              <CardDescription>Revenue and cost</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Revenue ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cost ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years (for chart)</Label>
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
              <CardDescription>Profit and margin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.cost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.profit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.marginPercent}%
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
                <CardTitle>Cumulative Profit Over Time</CardTitle>
                <CardDescription>
                  Total profit accumulated by year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={`profit-${revenue}-${cost}-${years}`}
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

          {chartDataBar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Annual vs Cumulative Profit by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`bar-${revenue}-${cost}-${years}`}
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
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead className="text-right">Cumulative</TableHead>
                        <TableHead className="text-right">Margin %</TableHead>
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
                          <TableCell className="text-right">
                            {row.marginPercent}%
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
              Margin % = (Revenue − Cost) ÷ Revenue × 100. Line chart shows
              cumulative profit; bar chart shows annual vs cumulative per year.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimates only. Actual margins vary by industry and business.
        </AlertDescription>
      </Alert>
    </>
  );
}
