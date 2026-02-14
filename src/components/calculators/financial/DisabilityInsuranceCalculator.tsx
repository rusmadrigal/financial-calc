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

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function DisabilityInsuranceCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("5000");
  const [benefitPercent, setBenefitPercent] = useState("60");

  const income = parseFloat(monthlyIncome) || 0;
  const pct = Math.max(0, Math.min(100, parseFloat(benefitPercent) || 0)) / 100;
  const monthlyBenefit = Math.round(income * pct * 100) / 100;
  const annualBenefit = Math.round(monthlyBenefit * 12 * 100) / 100;
  const replacementPct = income > 0 ? Math.round(pct * 10000) / 100 : 0;

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Monthly income": usd.format(income),
      "Benefit %": `${replacementPct}%`,
      "Monthly benefit": usd.format(monthlyBenefit),
      "Annual benefit": usd.format(annualBenefit),
    }),
    [income, replacementPct, monthlyBenefit, annualBenefit],
  );

  const barData = useMemo(
    () => [{ year: 1, Income: income, "Monthly benefit": monthlyBenefit }],
    [income, monthlyBenefit],
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
      "Disability Insurance Calculator",
      summaryData,
      ["Metric", "Value"],
      Object.entries(summaryData).map(([k, v]) => [k, String(v)]),
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel(
      "Disability Insurance",
      ["Metric", "Value"],
      Object.entries(summaryData).map(([k, v]) => [k, String(v)]),
    );
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setMonthlyIncome("5000");
    setBenefitPercent("60");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Income and benefit rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Monthly income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Benefit replacement (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={benefitPercent}
                  onChange={(e) => setBenefitPercent(e.target.value)}
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
              <CardDescription>Disability benefit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly income
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(income)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Replacement %</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {replacementPct}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly benefit
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(monthlyBenefit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Annual benefit
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(annualBenefit)}
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
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 size-4" /> Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income vs Benefit</CardTitle>
              <CardDescription>Monthly comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    key={`${monthlyIncome}-${benefitPercent}`}
                    data={barData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="year"
                      className="text-xs"
                      tickFormatter={() => "Month 1"}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="Income" fill="var(--chart-1)" name="Income" />
                    <Bar
                      dataKey="Monthly benefit"
                      fill="var(--chart-3)"
                      name="Monthly benefit"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Typical policies replace 50–70% of income. Elimination period and
              definition of disability vary.
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
