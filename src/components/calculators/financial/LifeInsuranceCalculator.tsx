"use client";

import { useState, useMemo } from "react";
import { Copy, Download, Info, AlertCircle } from "lucide-react";
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

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function LifeInsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState("75000");
  const [yearsOfCoverage, setYearsOfCoverage] = useState("10");
  const [existingCoverage, setExistingCoverage] = useState("0");
  const [debts, setDebts] = useState("200000");

  const income = parseFloat(annualIncome) || 0;
  const years = Math.max(1, Math.min(30, parseInt(yearsOfCoverage, 10) || 10));
  const existing = parseFloat(existingCoverage) || 0;
  const debt = parseFloat(debts) || 0;
  const incomeReplacement = Math.round(income * years * 100) / 100;
  const totalNeed = incomeReplacement + debt;
  const recommended = Math.max(
    0,
    Math.round((totalNeed - existing) * 100) / 100,
  );

  const yearlyData = useMemo(() => {
    return Array.from({ length: years }, (_, i) => {
      const year = i + 1;
      const annualNeed = Math.round(income * 100) / 100;
      const cumulativeNeed = Math.round(income * year * 100) / 100;
      return { year, annualNeed, cumulativeNeed };
    });
  }, [income, years]);

  const chartDataLine = useMemo(
    () => yearlyData.map((row) => ({ year: row.year, balance: row.cumulativeNeed })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () => yearlyData.slice(0, 15).map((row) => ({
      year: row.year,
      annualNeed: row.annualNeed,
      cumulativeNeed: row.cumulativeNeed,
    })),
    [yearlyData],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Income replacement need": usd.format(incomeReplacement),
      "Debts to cover": usd.format(debt),
      "Total need": usd.format(totalNeed),
      "Existing coverage": usd.format(existing),
      "Recommended additional": usd.format(recommended),
    }),
    [incomeReplacement, debt, totalNeed, existing, recommended],
  );

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
    exportToPDF(
      "Life Insurance Calculator",
      summaryData,
      ["Metric", "Value"],
      Object.entries(summaryData).map(([k, v]) => [k, String(v)]),
    );
    toast.success("PDF downloaded");
  };
  const handleReset = () => {
    setAnnualIncome("75000");
    setYearsOfCoverage("10");
    setExistingCoverage("0");
    setDebts("200000");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Income and coverage needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Annual income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years of income to replace</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={yearsOfCoverage}
                  onChange={(e) => setYearsOfCoverage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Existing life insurance ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={existingCoverage}
                    onChange={(e) => setExistingCoverage(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Debts to cover ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={debts}
                    onChange={(e) => setDebts(e.target.value)}
                    className="pl-7"
                  />
                </div>
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
              <CardDescription>Recommended coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Income replacement need
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(incomeReplacement)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total need</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(totalNeed)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recommended coverage
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(recommended)}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 size-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="mr-2 size-4" /> Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Need Over Time</CardTitle>
                <CardDescription>Income replacement need by year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={`line-${annualIncome}-${yearsOfCoverage}`}
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
                        name="Cumulative need"
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
                <CardTitle>Annual vs Cumulative Need by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`bar-${annualIncome}-${yearsOfCoverage}`}
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
                        dataKey="annualNeed"
                        fill="var(--chart-1)"
                        name="Annual need"
                      />
                      <Bar
                        dataKey="cumulativeNeed"
                        fill="var(--chart-3)"
                        name="Cumulative need"
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
                        <TableHead className="text-right">Annual need</TableHead>
                        <TableHead className="text-right">Cumulative need</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyData.slice(0, 10).map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.annualNeed)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.cumulativeNeed)}
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
              Simple income replacement method. DIME and other methods may yield
              different results.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimate only. Consult an insurance professional.
        </AlertDescription>
      </Alert>
    </>
  );
}
