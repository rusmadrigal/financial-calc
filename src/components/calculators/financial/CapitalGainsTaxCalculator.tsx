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
import { calculateCapitalGainsTax } from "@/lib/helpers/financial/calculateCapitalGainsTax";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function CapitalGainsTaxCalculator() {
  const [costBasis, setCostBasis] = useState("10000");
  const [salePrice, setSalePrice] = useState("15000");
  const [holdingPeriod, setHoldingPeriod] = useState<"short" | "long">("long");
  const [otherIncome, setOtherIncome] = useState("50000");

  const result = useMemo(
    () =>
      calculateCapitalGainsTax({
        costBasis: parseFloat(costBasis) || 0,
        salePrice: parseFloat(salePrice) || 0,
        holdingPeriod,
        otherTaxableIncome: parseFloat(otherIncome) || 0,
      }),
    [costBasis, salePrice, holdingPeriod, otherIncome],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Cost Basis": usd.format(result.costBasis),
      "Sale Price": usd.format(result.salePrice),
      Gain: usd.format(result.gain),
      Tax: usd.format(result.tax),
      "Net Proceeds": usd.format(result.netProceeds),
      Rate: `${result.ratePercent}%`,
    }),
    [result],
  );

  const barData = useMemo(
    () => [
      {
        year: 1,
        Gain: result.gain,
        Tax: result.tax,
        "Net Proceeds": result.netProceeds,
      },
    ],
    [result.gain, result.tax, result.netProceeds],
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
      "Capital Gains Tax Calculator",
      summaryData,
      ["Metric", "Value"],
      Object.entries(summaryData).map(([k, v]) => [k, String(v)]),
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel(
      "Capital Gains Tax",
      ["Metric", "Value"],
      Object.entries(summaryData).map(([k, v]) => [k, String(v)]),
    );
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setCostBasis("10000");
    setSalePrice("15000");
    setHoldingPeriod("long");
    setOtherIncome("50000");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Sale and holding period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Cost basis ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={costBasis}
                    onChange={(e) => setCostBasis(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sale price ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Holding period</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={holdingPeriod}
                  onChange={(e) =>
                    setHoldingPeriod(e.target.value as "short" | "long")
                  }
                >
                  <option value="short">Short-term (1 year or less)</option>
                  <option value="long">Long-term (over 1 year)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Other taxable income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(e.target.value)}
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
              <CardDescription>Gain, tax, net proceeds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Gain</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.gain)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.tax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net proceeds</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.netProceeds)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Rate: {result.ratePercent}%
              </p>
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
              <CardTitle>Breakdown (Year 1)</CardTitle>
              <CardDescription>
                Gain, tax, and net proceeds by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    key={`${costBasis}-${salePrice}-${holdingPeriod}`}
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
                    <Bar dataKey="Gain" fill="var(--chart-1)" name="Gain" />
                    <Bar dataKey="Tax" fill="var(--chart-3)" name="Tax" />
                    <Bar
                      dataKey="Net Proceeds"
                      fill="var(--chart-2)"
                      name="Net Proceeds"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Long-term rates depend on income. State tax not included.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimate only. Consult a tax professional.
        </AlertDescription>
      </Alert>
    </>
  );
}
