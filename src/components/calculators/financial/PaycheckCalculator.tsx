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
import { calculatePaycheck } from "@/lib/helpers/financial/calculatePaycheck";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

type Freq = "weekly" | "biweekly" | "semimonthly" | "monthly" | "annual";
const FREQ_OPTIONS: { value: Freq; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "semimonthly", label: "Semi-monthly" },
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
];

export function PaycheckCalculator() {
  const [gross, setGross] = useState("2500");
  const [frequency, setFrequency] = useState<Freq>("biweekly");
  const [exemptions, setExemptions] = useState("1");
  const [statePct, setStatePct] = useState("5");

  const result = useMemo(
    () =>
      calculatePaycheck({
        grossAmount: parseFloat(gross) || 0,
        payFrequency: frequency,
        federalExemptions: parseInt(exemptions, 10) || 0,
        stateTaxPercent: parseFloat(statePct) || 0,
      }),
    [gross, frequency, exemptions, statePct],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Gross Pay": usd.format(result.grossPay),
      Federal: usd.format(result.federalWithholding),
      "Social Security": usd.format(result.socialSecurity),
      Medicare: usd.format(result.medicare),
      State: usd.format(result.stateTax),
      "Net Pay": usd.format(result.netPay),
    }),
    [result],
  );

  const barData = useMemo(
    () => [
      {
        year: 1,
        Gross: result.grossPay,
        Federal: result.federalWithholding,
        "Net Pay": result.netPay,
      },
    ],
    [result.grossPay, result.federalWithholding, result.netPay],
  );

  const hasResults = parseFloat(gross) >= 0;

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
      "Paycheck Calculator",
      summaryData,
      ["Item", "Amount"],
      [
        ["Gross", usd.format(result.grossPay)],
        ["Federal", usd.format(result.federalWithholding)],
        ["Social Security", usd.format(result.socialSecurity)],
        ["Medicare", usd.format(result.medicare)],
        ["State", usd.format(result.stateTax)],
        ["Net Pay", usd.format(result.netPay)],
      ],
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel(
      "Paycheck",
      ["Item", "Amount"],
      [
        ["Gross", usd.format(result.grossPay)],
        ["Federal", usd.format(result.federalWithholding)],
        ["Social Security", usd.format(result.socialSecurity)],
        ["Medicare", usd.format(result.medicare)],
        ["State", usd.format(result.stateTax)],
        ["Net Pay", usd.format(result.netPay)],
        ["Annual gross", usd.format(result.annualGross)],
      ],
    );
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setGross("2500");
    setFrequency("biweekly");
    setExemptions("1");
    setStatePct("5");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Gross pay and withholdings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Gross pay per period ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={gross}
                    onChange={(e) => setGross(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pay frequency</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Freq)}
                >
                  {FREQ_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Federal exemptions</Label>
                <Input
                  type="number"
                  min={0}
                  value={exemptions}
                  onChange={(e) => setExemptions(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>State tax (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={statePct}
                  onChange={(e) => setStatePct(e.target.value)}
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
              <CardDescription>Take-home per period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Gross</p>
                  <p className="mt-1 text-xl font-semibold">
                    {usd.format(result.grossPay)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Federal</p>
                  <p className="mt-1 text-xl font-semibold">
                    {usd.format(result.federalWithholding)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">FICA</p>
                  <p className="mt-1 text-xl font-semibold">
                    {usd.format(result.socialSecurity + result.medicare)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="mt-1 text-xl font-semibold">
                    {usd.format(result.stateTax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net pay</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.netPay)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual gross</p>
                  <p className="mt-1 text-xl font-semibold">
                    {usd.format(result.annualGross)}
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
          {hasResults && (
            <Card>
              <CardHeader>
                <CardTitle>Breakdown (per period)</CardTitle>
                <CardDescription>Deductions vs net</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart key={`${gross}-${frequency}`} data={barData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="year"
                        className="text-xs"
                        tickFormatter={() => "This period"}
                      />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="Gross" fill="var(--chart-1)" name="Gross" />
                      <Bar
                        dataKey="Federal"
                        fill="var(--chart-3)"
                        name="Federal"
                      />
                      <Bar
                        dataKey="Net Pay"
                        fill="var(--chart-2)"
                        name="Net Pay"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Simplified federal withholding. Actual withholdings depend on W-4
              and state.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimate only. Check with your employer or tax advisor.
        </AlertDescription>
      </Alert>
    </>
  );
}
