"use client";

import { useState, useMemo } from "react";
import { Copy, Download, FileSpreadsheet, Info, AlertCircle } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { calculateHomeAffordability } from "@/lib/helpers/financial/calculateHomeAffordability";
import { calculateMortgage } from "@/lib/helpers/financial/calculateMortgage";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function HomeAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState("120000");
  const [monthlyDebts, setMonthlyDebts] = useState("500");
  const [maxDTI, setMaxDTI] = useState("36");
  const [apr, setApr] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [downPct, setDownPct] = useState("20");

  const result = useMemo(() => {
    return calculateHomeAffordability({
      annualIncome: parseFloat(annualIncome) || 0,
      monthlyDebts: parseFloat(monthlyDebts) || 0,
      maxDTIPercent: parseFloat(maxDTI) || 36,
      aprPercent: parseFloat(apr) || 0,
      termYears: parseFloat(termYears) || 30,
      downPaymentPercent: parseFloat(downPct) || 20,
    });
  }, [annualIncome, monthlyDebts, maxDTI, apr, termYears, downPct]);

  const tableHeaders = ["Metric", "Value"];
  const tableRows: (string | number)[][] = [
    ["Max P&I (monthly)", usd.format(result.maxMonthlyPandI)],
    ["Max loan amount", usd.format(result.maxLoanAmount)],
    ["Max home price", usd.format(result.maxHomePrice)],
    ["Down payment", usd.format(result.downPaymentAmount)],
    ["Monthly payment", usd.format(result.monthlyPayment)],
  ];

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Max Home Price": usd.format(result.maxHomePrice),
      "Down Payment": usd.format(result.downPaymentAmount),
      "Max Loan": usd.format(result.maxLoanAmount),
      "Monthly P&I": usd.format(result.monthlyPayment),
    }),
    [result],
  );

  const hasResults = result.maxHomePrice > 0;

  const mortgageSchedule = useMemo(() => {
    if (!hasResults) return null;
    return calculateMortgage({
      homePrice: result.maxHomePrice,
      downPayment: result.downPaymentAmount,
      aprPercent: parseFloat(apr) || 0,
      termYears: parseFloat(termYears) || 30,
    });
  }, [hasResults, result.maxHomePrice, result.downPaymentAmount, apr, termYears]);

  const yearlyData = useMemo(() => {
    if (!mortgageSchedule?.schedule.length) return [];
    const byYear: { year: number; balance: number; principal: number; interest: number }[] = [];
    const schedule = mortgageSchedule.schedule;
    for (let y = 1; y <= Math.ceil(schedule.length / 12); y++) {
      const start = (y - 1) * 12;
      const end = Math.min(y * 12, schedule.length);
      let principalSum = 0;
      let interestSum = 0;
      let endBalance = 0;
      for (let i = start; i < end; i++) {
        const row = schedule[i];
        if (row) {
          principalSum += row.principal;
          interestSum += row.interest;
          endBalance = row.balance;
        }
      }
      byYear.push({
        year: y,
        balance: Math.round(endBalance),
        principal: Math.round(principalSum * 100) / 100,
        interest: Math.round(interestSum * 100) / 100,
      });
    }
    return byYear;
  }, [mortgageSchedule]);

  const chartDataLine = useMemo(
    () => yearlyData.map((row) => ({ year: row.year, balance: row.balance })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () => yearlyData.slice(0, 15).map((row) => ({ year: row.year, principal: row.principal, interest: row.interest })),
    [yearlyData],
  );

  const yearlyPreviewRows = yearlyData.slice(0, 10);

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
    exportToPDF("Home Affordability Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Home Affordability", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleReset = () => {
    setAnnualIncome("120000");
    setMonthlyDebts("500");
    setMaxDTI("36");
    setApr("6.5");
    setTermYears("30");
    setDownPct("20");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Income and loan assumptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Annual income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" min={0} value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="pl-7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly debts ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" min={0} value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)} className="pl-7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Max DTI (%)</Label>
                <Input type="number" min={0} max={100} step="0.5" value={maxDTI} onChange={(e) => setMaxDTI(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Interest rate (APR %)</Label>
                <Input type="number" min={0} step="0.01" value={apr} onChange={(e) => setApr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Loan term (years)</Label>
                <Input type="number" min={1} value={termYears} onChange={(e) => setTermYears(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Down payment (%)</Label>
                <Input type="number" min={0} max={100} value={downPct} onChange={(e) => setDownPct(e.target.value)} />
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
              <CardDescription>Estimated affordability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Max home price</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.maxHomePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Down payment</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.downPaymentAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly P&I</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.monthlyPayment)}</p>
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

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance Over Time</CardTitle>
                <CardDescription>Loan balance by year (affordable loan)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataLine}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
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
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="principal" fill="var(--chart-1)" name="Principal" />
                      <Bar dataKey="interest" fill="var(--chart-3)" name="Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {yearlyPreviewRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Yearly Breakdown</CardTitle>
                <CardDescription>First 10 years (affordable loan)</CardDescription>
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
                      {yearlyPreviewRows.map((row) => (
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
          )}

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              DTI = debt-to-income. Lenders often use 36% back-end (P&I + debts vs income). Does not include taxes, insurance, or HOA.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>Estimates only. Lenders use their own criteria and may include taxes and insurance.</AlertDescription>
      </Alert>
    </>
  );
}
