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
  const years = parseInt(yearsOfCoverage, 10) || 10;
  const existing = parseFloat(existingCoverage) || 0;
  const debt = parseFloat(debts) || 0;
  const incomeReplacement = Math.round(income * years * 100) / 100;
  const totalNeed = incomeReplacement + debt;
  const recommended = Math.max(
    0,
    Math.round((totalNeed - existing) * 100) / 100,
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

  const barData = useMemo(
    () => [
      {
        year: 1,
        "Income need": incomeReplacement,
        Debts: debt,
        Existing: existing,
        Recommended: recommended,
      },
    ],
    [incomeReplacement, debt, existing, recommended],
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
          <Card>
            <CardHeader>
              <CardTitle>Coverage Breakdown</CardTitle>
              <CardDescription>Year 1</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    key={`${annualIncome}-${yearsOfCoverage}-${existingCoverage}-${debts}`}
                    data={barData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="year"
                      className="text-xs"
                      tickFormatter={() => "Year 1"}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="Income need"
                      fill="var(--chart-1)"
                      name="Income need"
                    />
                    <Bar dataKey="Debts" fill="var(--chart-3)" name="Debts" />
                    <Bar
                      dataKey="Recommended"
                      fill="var(--chart-2)"
                      name="Recommended"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
