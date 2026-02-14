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
import { calculateFederalIncomeTax } from "@/lib/helpers/financial/calculateFederalIncomeTax";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function FederalIncomeTaxCalculator() {
  const [income, setIncome] = useState("75000");
  const [filingStatus, setFilingStatus] = useState<"single" | "married">(
    "single",
  );

  const result = useMemo(
    () =>
      calculateFederalIncomeTax({
        taxableIncome: parseFloat(income) || 0,
        filingStatus,
      }),
    [income, filingStatus],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Taxable Income": usd.format(result.taxableIncome),
      "Federal Tax": usd.format(result.tax),
      "Effective Rate": `${result.effectiveRatePercent}%`,
      "Marginal Rate": `${result.marginalRatePercent}%`,
    }),
    [result],
  );

  const barData = useMemo(
    () => [
      {
        year: 1,
        "Federal Tax": result.tax,
        "Taxable Income": result.taxableIncome,
      },
    ],
    [result.tax, result.taxableIncome],
  );

  const hasResults = parseFloat(income) >= 0;

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
      "Federal Income Tax Calculator",
      summaryData,
      ["Bracket", "Rate", "Amount"],
      result.bracketBreakdown.map((b) => [
        b.bracket,
        `${b.rate}%`,
        usd.format(b.amount),
      ]),
    );
    toast.success("PDF downloaded");
  };

  const handleReset = () => {
    setIncome("75000");
    setFilingStatus("single");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Taxable income and filing status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Taxable income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Filing status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filingStatus}
                  onChange={(e) =>
                    setFilingStatus(e.target.value as "single" | "married")
                  }
                >
                  <option value="single">Single</option>
                  <option value="married">Married (joint)</option>
                </select>
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
              <CardDescription>Estimated federal tax</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Taxable income
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.taxableIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Federal tax</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.tax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Effective rate
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.effectiveRatePercent}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Marginal rate</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.marginalRatePercent}%
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
              </div>
            </CardContent>
          </Card>

          {hasResults && result.tax > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tax by bracket (Year 1)</CardTitle>
                <CardDescription>Simplified brackets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart key={`${income}-${filingStatus}`} data={barData}>
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
                        dataKey="Federal Tax"
                        fill="var(--chart-1)"
                        name="Federal Tax"
                      />
                      <Bar
                        dataKey="Taxable Income"
                        fill="var(--chart-3)"
                        name="Taxable Income"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {result.bracketBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Bracket breakdown</CardTitle>
                <CardDescription>Tax per bracket</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bracket</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.bracketBreakdown.map((b, i) => (
                      <TableRow key={i}>
                        <TableCell>{b.bracket}</TableCell>
                        <TableCell className="text-right">{b.rate}%</TableCell>
                        <TableCell className="text-right">
                          {usd.format(b.amount)}
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
              Uses simplified 2024-style brackets. Credits and deductions not
              included. Consult a tax professional.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Estimate only. Actual tax depends on deductions, credits, and current
          law.
        </AlertDescription>
      </Alert>
    </>
  );
}
