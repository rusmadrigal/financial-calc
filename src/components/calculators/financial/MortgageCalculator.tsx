"use client";

import { useState, useMemo } from "react";
import {
  Download,
  Copy,
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
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateMortgage } from "@/lib/helpers/financial/calculateMortgage";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("350000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [downPayment, setDownPayment] = useState("70000");

  const result = useMemo(() => {
    const homePrice = Math.max(0, parseFloat(loanAmount) || 0);
    const down = Math.max(0, parseFloat(downPayment) || 0);
    const apr = Math.max(0, parseFloat(interestRate) || 0);
    const years = Math.max(0.5, Math.min(50, parseFloat(loanTerm) || 30));
    return calculateMortgage({
      homePrice,
      downPayment: down,
      aprPercent: apr,
      termYears: years,
    });
  }, [loanAmount, downPayment, interestRate, loanTerm]);

  const chartData = useMemo(() => {
    const years = Math.ceil(result.schedule.length / 12);
    const data: {
      year: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    for (let year = 1; year <= years; year++) {
      const start = (year - 1) * 12;
      const end = Math.min(year * 12, result.schedule.length);
      let principalSum = 0;
      let interestSum = 0;
      let endBalance = 0;
      for (let i = start; i < end; i++) {
        const row = result.schedule[i];
        if (row) {
          principalSum += row.principal;
          interestSum += row.interest;
          endBalance = row.balance;
        }
      }
      data.push({
        year,
        principal: principalSum,
        interest: interestSum,
        balance: endBalance,
      });
    }
    return data;
  }, [result.schedule]);

  const amortizationPreview = useMemo(
    () => result.schedule.slice(0, 12),
    [result.schedule],
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
      "Loan Amount": usd.format(result.principal),
      "Interest Rate": `${Math.max(0, parseFloat(interestRate) || 0)}%`,
      "Loan Term": `${Math.max(0.5, parseFloat(loanTerm) || 30)} years`,
      "Monthly Payment": usd.format(result.monthlyPayment),
      "Total Interest": usd.format(result.totalInterest),
      "Total Payment": usd.format(result.totalPayment),
    }),
    [result, interestRate, loanTerm],
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
    exportToPDF("Mortgage Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel("Amortization Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    exportToCSV("Full-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleCalculate = () => {
    toast.success("Calculation updated!");
  };

  const handleReset = () => {
    setLoanAmount("350000");
    setInterestRate("6.5");
    setLoanTerm("30");
    setDownPayment("70000");
    toast.info("Calculator reset to default values");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Enter your loan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Home Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="loanAmount"
                    type="number"
                    min={0}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The total purchase price of the home
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment</Label>
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
                <p className="text-xs text-muted-foreground">
                  Typically 20% to avoid PMI
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (APR)</Label>
                <div className="relative">
                  <Input
                    id="interestRate"
                    type="number"
                    min={0}
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="pr-7"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Annual percentage rate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term</Label>
                <div className="relative">
                  <Input
                    id="loanTerm"
                    type="number"
                    min={1}
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    years
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Common terms: 15, 20, or 30 years
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCalculate} className="flex-1">
                  Calculate
                </Button>
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
              <CardTitle>Your Results</CardTitle>
              <CardDescription>Based on your inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Payment
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-foreground">
                    {usd.format(result.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Interest
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-foreground">
                    {usd.format(result.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="mt-1 text-3xl font-semibold text-foreground">
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
              These calculations are estimates. Your actual monthly payment may
              include property taxes, homeowners insurance, HOA fees, and PMI if
              down payment is less than 20%.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Balance Over Time</CardTitle>
              <CardDescription>Remaining balance by year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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

          <Card>
            <CardHeader>
              <CardTitle>Principal vs Interest by Year</CardTitle>
              <CardDescription>First 15 years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(0, 15)}>
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
                    {chartData.slice(0, 10).map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">{row.year}</TableCell>
                        <TableCell className="text-right">{usd.format(row.principal)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.interest)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
              <CardDescription>
                First year payment breakdown (month by month)
              </CardDescription>
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
                    {amortizationPreview.map((row) => (
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
          <strong>Important Disclaimer:</strong> This calculator is provided for
          educational and informational purposes only. The results are estimates
          based on the information you provide and should not be considered
          financial, legal, or tax advice. Actual loan terms, payments, and
          costs may vary. Always consult with qualified mortgage professionals,
          financial advisors, and legal counsel before making any financial
          decisions. SmartCalcLab is not responsible for any decisions made
          based on these calculations.
        </AlertDescription>
      </Alert>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="flex gap-3">
          <Button onClick={handleCalculate} className="flex-1">
            Calculate
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </>
  );
}
