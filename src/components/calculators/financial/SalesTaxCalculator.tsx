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
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function SalesTaxCalculator() {
  const [amount, setAmount] = useState("100");
  const [ratePercent, setRatePercent] = useState("8.25");

  const subtotal = parseFloat(amount) || 0;
  const rate = (parseFloat(ratePercent) || 0) / 100;
  const tax = Math.round(subtotal * rate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      Subtotal: usd.format(subtotal),
      "Sales Tax": usd.format(tax),
      Total: usd.format(total),
    }),
    [subtotal, tax, total],
  );

  const barData = useMemo(
    () => [{ year: 1, Subtotal: subtotal, Tax: tax, Total: total }],
    [subtotal, tax, total],
  );

  const hasResults = amount !== "";

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
      "Sales Tax Calculator",
      summaryData,
      ["Metric", "Value"],
      [
        ["Subtotal", usd.format(subtotal)],
        ["Sales Tax", usd.format(tax)],
        ["Total", usd.format(total)],
      ],
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel(
      "Sales Tax",
      ["Metric", "Value"],
      [
        ["Subtotal", usd.format(subtotal)],
        ["Sales Tax", usd.format(tax)],
        ["Total", usd.format(total)],
      ],
    );
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setAmount("100");
    setRatePercent("8.25");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Amount and tax rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Amount before tax ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sales tax rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={ratePercent}
                  onChange={(e) => setRatePercent(e.target.value)}
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
              <CardDescription>Tax and total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(subtotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sales tax</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(tax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(total)}
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
                <CardTitle>Breakdown (Year 1)</CardTitle>
                <CardDescription>Subtotal, tax, and total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart key={`${amount}-${ratePercent}`} data={barData}>
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
                        dataKey="Subtotal"
                        fill="var(--chart-1)"
                        name="Subtotal"
                      />
                      <Bar dataKey="Tax" fill="var(--chart-3)" name="Tax" />
                      <Bar dataKey="Total" fill="var(--chart-2)" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Rates vary by state and locality. This is an estimate only.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          For illustration only. Verify with your state tax authority.
        </AlertDescription>
      </Alert>
    </>
  );
}
