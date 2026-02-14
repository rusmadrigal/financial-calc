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
import { calculateAutoLoan } from "@/lib/helpers/financial/calculateAutoLoan";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("35000");
  const [downPayment, setDownPayment] = useState("5000");
  const [tradeIn, setTradeIn] = useState("0");
  const [salesTaxPct, setSalesTaxPct] = useState("7");
  const [fees, setFees] = useState("500");
  const [apr, setApr] = useState("7.5");
  const [termMonths, setTermMonths] = useState("60");

  const result = useMemo(() => {
    return calculateAutoLoan({
      vehiclePrice: Math.max(0, parseFloat(vehiclePrice) || 0),
      downPayment: Math.max(0, parseFloat(downPayment) || 0),
      tradeIn: Math.max(0, parseFloat(tradeIn) || 0),
      salesTaxPercent: Math.max(0, parseFloat(salesTaxPct) || 0),
      fees: Math.max(0, parseFloat(fees) || 0),
      aprPercent: Math.max(0, parseFloat(apr) || 0),
      termMonths: Math.max(1, parseInt(termMonths, 10) || 60),
    });
  }, [vehiclePrice, downPayment, tradeIn, salesTaxPct, fees, apr, termMonths]);

  const yearlyData = useMemo(() => {
    const years = Math.ceil(result.schedule.length / 12);
    return Array.from({ length: Math.min(years, 15) }, (_, i) => {
      const start = i * 12;
      let principalSum = 0;
      let interestSum = 0;
      let endBalance = 0;
      for (let m = 0; m < 12 && start + m < result.schedule.length; m++) {
        const row = result.schedule[start + m];
        if (row) {
          principalSum += row.principal;
          interestSum += row.interest;
          endBalance = row.balance;
        }
      }
      return {
        year: i + 1,
        balance: Math.round(endBalance),
        principal: Math.round(principalSum),
        interest: Math.round(interestSum),
      };
    });
  }, [result.schedule]);

  const chartDataLine = useMemo(
    () => yearlyData.map((row) => ({ year: row.year, balance: row.balance })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () =>
      yearlyData.map((row) => ({
        year: row.year,
        principal: row.principal,
        interest: row.interest,
      })),
    [yearlyData],
  );

  const tableHeaders = ["Month", "Payment", "Principal", "Interest", "Balance"];
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
      "Amount Financed": usd.format(result.amountFinanced),
      "Monthly Payment": usd.format(result.payment),
      "Total Payment": usd.format(result.totalPayment),
      "Total Interest": usd.format(result.totalInterest),
    }),
    [result],
  );

  const handleCopyResults = () => {
    const text = Object.entries(summaryData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
    });
  };

  const handleExportPDF = () => {
    exportToPDF("Auto Loan Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel("Auto Loan Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    exportToCSV("Auto-Loan-Full-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setVehiclePrice("35000");
    setDownPayment("5000");
    setTradeIn("0");
    setSalesTaxPct("7");
    setFees("500");
    setApr("7.5");
    setTermMonths("60");
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
              <CardDescription>Vehicle and loan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vehiclePrice">Vehicle Price ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="vehiclePrice"
                    type="number"
                    min={0}
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="downPayment"
                    type="number"
                    min={0}
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeIn">Trade-in Value ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="tradeIn"
                    type="number"
                    min={0}
                    value={tradeIn}
                    onChange={(e) => setTradeIn(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesTaxPct">Sales Tax (%)</Label>
                <Input
                  id="salesTaxPct"
                  type="number"
                  min={0}
                  step="0.1"
                  value={salesTaxPct}
                  onChange={(e) => setSalesTaxPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fees">Fees ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="fees"
                    type="number"
                    min={0}
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apr">APR (%)</Label>
                <Input
                  id="apr"
                  type="number"
                  min={0}
                  step="0.01"
                  value={apr}
                  onChange={(e) => setApr(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termMonths">Term (months)</Label>
                <Input
                  id="termMonths"
                  type="number"
                  min={1}
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
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
              <CardDescription>Payment and totals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Amount Financed
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.amountFinanced)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Payment
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.payment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Interest
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalPayment)}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyResults}>
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="mr-2 size-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 size-4" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Amount financed = vehicle price minus down payment and trade-in,
              plus sales tax and fees.
            </AlertDescription>
          </Alert>

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance Over Time</CardTitle>
                <CardDescription>Remaining balance by year</CardDescription>
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
                        name="Balance"
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
                <CardTitle>Principal vs Interest by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
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
                        dataKey="principal"
                        fill="var(--chart-1)"
                        name="Principal"
                      />
                      <Bar
                        dataKey="interest"
                        fill="var(--chart-3)"
                        name="Interest"
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
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyData.slice(0, 10).map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.principal)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.interest)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.balance)}
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
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription>First 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Month</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
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
                          {usd.format(row.principal)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.interest)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {usd.format(row.balance)}
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
                >
                  <Download className="mr-2 size-4" />
                  Download Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> Estimates only. Dealer and lender terms
          may vary.
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
