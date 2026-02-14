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
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateCarLease } from "@/lib/helpers/financial/calculateCarLease";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function CarLeaseCalculator() {
  const [msrp, setMsrp] = useState("40000");
  const [negotiatedPrice, setNegotiatedPrice] = useState("38000");
  const [downPayment, setDownPayment] = useState("2000");
  const [tradeIn, setTradeIn] = useState("0");
  const [moneyFactor, setMoneyFactor] = useState("0.0025");
  const [residualPercent, setResidualPercent] = useState("55");
  const [termMonths, setTermMonths] = useState("36");
  const [salesTaxPercent, setSalesTaxPercent] = useState("7");
  const [fees, setFees] = useState("650");
  const [rebates, setRebates] = useState("0");

  const result = useMemo(() => {
    return calculateCarLease({
      msrp: Math.max(0, parseFloat(msrp) || 0),
      negotiatedPrice: Math.max(0, parseFloat(negotiatedPrice) || 0),
      downPayment: Math.max(0, parseFloat(downPayment) || 0),
      tradeIn: Math.max(0, parseFloat(tradeIn) || 0),
      moneyFactor: Math.max(0, parseFloat(moneyFactor) || 0),
      residualPercent: Math.max(0, parseFloat(residualPercent) || 0),
      termMonths: Math.max(1, parseInt(termMonths, 10) || 36),
      salesTaxPercent: Math.max(0, parseFloat(salesTaxPercent) || 0),
      fees: Math.max(0, parseFloat(fees) || 0),
      rebates: Math.max(0, parseFloat(rebates) || 0),
    });
  }, [
    msrp,
    negotiatedPrice,
    downPayment,
    tradeIn,
    moneyFactor,
    residualPercent,
    termMonths,
    salesTaxPercent,
    fees,
    rebates,
  ]);

  const yearlyData = useMemo(() => {
    const years = Math.ceil(result.schedule.length / 12);
    return Array.from({ length: Math.min(years, 10) }, (_, i) => {
      const start = i * 12;
      let depreciation = 0;
      let finance = 0;
      let tax = 0;
      let payments = 0;
      for (let m = 0; m < 12 && start + m < result.schedule.length; m++) {
        const row = result.schedule[start + m];
        if (row) {
          depreciation += row.depreciation;
          finance += row.finance;
          tax += row.tax ?? 0;
          payments += row.payment;
        }
      }
      return {
        year: i + 1,
        depreciation: Math.round(depreciation),
        finance: Math.round(finance),
        tax: Math.round(tax),
        payments: Math.round(payments),
      };
    });
  }, [result.schedule]);

  const chartDataLine = useMemo(
    () => yearlyData.map((row) => ({ year: row.year, balance: row.payments })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () =>
      yearlyData.map((row) => ({
        year: row.year,
        depreciation: row.depreciation,
        finance: row.finance,
      })),
    [yearlyData],
  );

  const tableHeaders = [
    "Month",
    "Payment",
    "Depreciation",
    "Finance",
    "Tax",
    "Balance",
  ];
  const tableRows = result.schedule.map(
    (row) =>
      [
        row.period,
        Number(row.payment.toFixed(2)),
        Number(row.depreciation.toFixed(2)),
        Number(row.finance.toFixed(2)),
        Number((row.tax ?? 0).toFixed(2)),
        row.balance ?? 0,
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Residual Value": usd.format(result.residualValue),
      "Base Payment": usd.format(result.basePayment),
      "Monthly Tax": usd.format(result.monthlyTax),
      "Total Monthly": usd.format(result.totalMonthlyPayment),
      "Total Cost": usd.format(result.totalCost),
    }),
    [result],
  );

  const hasResults = result.schedule.length > 0;

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
    exportToPDF("Car Lease Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Car Lease Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    exportToCSV("Car-Lease-Full-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setMsrp("40000");
    setNegotiatedPrice("38000");
    setDownPayment("2000");
    setTradeIn("0");
    setMoneyFactor("0.0025");
    setResidualPercent("55");
    setTermMonths("36");
    setSalesTaxPercent("7");
    setFees("650");
    setRebates("0");
    toast.info("Calculator reset");
  };

  const previewRows = result.schedule.slice(0, 12);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Lease terms and costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>MSRP ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={msrp}
                  onChange={(e) => setMsrp(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Negotiated Price ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Down Payment ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Trade-in ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={tradeIn}
                  onChange={(e) => setTradeIn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Money Factor (e.g. 0.0025)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.0001"
                  value={moneyFactor}
                  onChange={(e) => setMoneyFactor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Residual (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={residualPercent}
                  onChange={(e) => setResidualPercent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Term (months)</Label>
                <Input
                  type="number"
                  min={1}
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sales Tax (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={salesTaxPercent}
                  onChange={(e) => setSalesTaxPercent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fees ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rebates ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={rebates}
                  onChange={(e) => setRebates(e.target.value)}
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
              <CardDescription>Monthly payment and total cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Monthly Payment
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalMonthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Residual Value
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.residualValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalCost)}
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
                  <Copy className="mr-2 size-4" />
                  Copy
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

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Money factor is often given by the dealer; multiply by 2400 to
              approximate APR. Residual is typically 50–60% for 36 months.
            </AlertDescription>
          </Alert>

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payments by Year</CardTitle>
                <CardDescription>Total payments per year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataLine}>
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
                        name="Payments"
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
                <CardTitle>Depreciation vs Finance by Year</CardTitle>
                <CardDescription>First 10 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataBar}>
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
                        dataKey="depreciation"
                        fill="var(--chart-1)"
                        name="Depreciation"
                      />
                      <Bar
                        dataKey="finance"
                        fill="var(--chart-3)"
                        name="Finance"
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
                        <TableHead className="text-right">Payments</TableHead>
                        <TableHead className="text-right">
                          Depreciation
                        </TableHead>
                        <TableHead className="text-right">Finance</TableHead>
                        <TableHead className="text-right">Tax</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.payments)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.depreciation)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.finance)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.tax)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Lease Schedule (preview)</CardTitle>
              <CardDescription>First 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Depreciation</TableHead>
                      <TableHead className="text-right">Finance</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">
                          {row.period}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.payment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.depreciation)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.finance)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.tax ?? 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.balance ?? 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadFullSchedule}
                  disabled={!hasResults}
                >
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
          Estimates only. Lease terms and taxes vary by state and dealer.
        </AlertDescription>
      </Alert>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur lg:hidden">
        <div className="flex gap-3">
          <Button className="flex-1">Calculate</Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </>
  );
}
