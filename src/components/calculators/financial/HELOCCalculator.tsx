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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateHELOC } from "@/lib/helpers/financial/calculateHELOC";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function HELOCCalculator() {
  const [drawAmount, setDrawAmount] = useState("100000");
  const [annualRate, setAnnualRate] = useState("8");
  const [drawPeriodYears, setDrawPeriodYears] = useState("10");
  const [repaymentYears, setRepaymentYears] = useState("20");

  const result = useMemo(() => {
    return calculateHELOC({
      drawAmount: Math.max(0, parseFloat(drawAmount) || 0),
      annualRatePercent: Math.max(0, parseFloat(annualRate) || 0),
      drawPeriodYears: Math.max(0, parseFloat(drawPeriodYears) || 0),
      repaymentYears: Math.max(1, parseFloat(repaymentYears) || 20),
    });
  }, [drawAmount, annualRate, drawPeriodYears, repaymentYears]);

  const chartDataBalance = useMemo(
    () =>
      result.schedule.map((row) => ({
        period: row.period,
        balance: Math.round(row.balance),
      })),
    [result.schedule],
  );

  const tableHeaders = ["Period", "Payment", "Principal", "Interest", "Balance"];
  const tableRows = result.schedule.map(
    (row) =>
      [
        row.period,
        Number(row.payment.toFixed(2)),
        Number(row.principal.toFixed(2)),
        Number(row.interest.toFixed(2)),
        Number(row.balance.toFixed(2)),
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Draw Amount": usd.format(result.drawAmount),
      "Interest-Only (Draw)": usd.format(result.drawPeriodInterestOnlyPayment),
      "Repayment Payment": usd.format(result.repaymentMonthlyPayment),
      "Total Interest": usd.format(result.totalInterest),
    }),
    [result],
  );

  const hasResults = result.schedule.length > 0;
  const previewRows = result.schedule.slice(0, 12);

  const handleCopyResults = () => {
    if (!hasResults) return;
    const text = Object.entries(summaryData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
    });
  };

  const handleExportPDF = () => {
    if (!hasResults) return;
    exportToPDF("HELOC Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("HELOC Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    exportToCSV("HELOC-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setDrawAmount("100000");
    setAnnualRate("8");
    setDrawPeriodYears("10");
    setRepaymentYears("20");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>HELOC terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Draw amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min={0}
                    value={drawAmount}
                    onChange={(e) => setDrawAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Annual rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Draw period (years)</Label>
                <Input
                  type="number"
                  min={0}
                  value={drawPeriodYears}
                  onChange={(e) => setDrawPeriodYears(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Repayment period (years)</Label>
                <Input
                  type="number"
                  min={1}
                  value={repaymentYears}
                  onChange={(e) => setRepaymentYears(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Calculate</Button>
                <Button onClick={handleReset} variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Payments and interest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Interest-only (draw)</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.drawPeriodInterestOnlyPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Repayment payment</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.repaymentMonthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.totalInterest)}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyResults} disabled={!hasResults}>
                  <Copy className="mr-2 size-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={!hasResults}>
                  <Download className="mr-2 size-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={!hasResults}>
                  <FileSpreadsheet className="mr-2 size-4" /> Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Draw period: interest-only payments. Repayment period: principal + interest. Rates may be variable.
            </AlertDescription>
          </Alert>

          {chartDataBalance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance Over Time</CardTitle>
                <CardDescription>Outstanding balance by period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataBalance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="period" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="balance" stroke="var(--chart-1)" strokeWidth={2} name="Balance" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription>First 12 periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">{row.period}</TableCell>
                        <TableCell className="text-right">{usd.format(row.payment)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.principal)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.interest)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" onClick={handleDownloadFullSchedule} disabled={!hasResults}>
                  <Download className="mr-2 size-4" /> Download Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          HELOC rates are often variable. This uses a fixed rate for illustration.
        </AlertDescription>
      </Alert>
    </>
  );
}
