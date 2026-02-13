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
import { calculate401k } from "@/lib/helpers/financial/calculate401k";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function Calculator401k() {
  const [currentBalance, setCurrentBalance] = useState("50000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [employerMatchPercent, setEmployerMatchPercent] = useState("50");
  const [years, setYears] = useState("25");
  const [expectedReturn, setExpectedReturn] = useState("7");

  const result = useMemo(() => {
    return calculate401k({
      currentBalance: Math.max(0, parseFloat(currentBalance) || 0),
      monthlyContribution: Math.max(0, parseFloat(monthlyContribution) || 0),
      employerMatchPercent: Math.max(0, parseFloat(employerMatchPercent) || 0),
      years: Math.max(1, parseInt(years, 10) || 25),
      expectedReturnPercent: Math.max(0, parseFloat(expectedReturn) || 0),
    });
  }, [currentBalance, monthlyContribution, employerMatchPercent, years, expectedReturn]);

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: row.year,
        balance: Math.round(row.balance),
      })),
    [result.yearlyBreakdown],
  );

  const chartDataBar = useMemo(
    () =>
      result.yearlyBreakdown.slice(0, 15).map((row) => ({
        year: row.year,
        contributions: Math.round(row.contributions),
        employerMatch: Math.round(row.employerMatch),
        earnings: Math.round(row.earnings),
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = ["Year", "Balance", "Contributions", "Employer Match", "Earnings"];
  const tableRows = result.yearlyBreakdown.map((row) => [
    row.year,
    Number(row.balance.toFixed(2)),
    Number(row.contributions.toFixed(2)),
    Number(row.employerMatch.toFixed(2)),
    Number(row.earnings.toFixed(2)),
  ] as (string | number)[]);

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Final Balance": usd.format(result.finalBalance),
      "Total Contributions": usd.format(result.totalContributions),
      "Total Employer Match": usd.format(result.totalEmployerMatch),
      "Total Earnings": usd.format(result.totalEarnings),
    }),
    [result],
  );

  const hasResults = result.yearlyBreakdown.length > 0;
  const previewRows = result.yearlyBreakdown.slice(0, 10);

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
    exportToPDF("401(k) Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("401k Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    exportToCSV("401k-Full-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setCurrentBalance("50000");
    setMonthlyContribution("500");
    setEmployerMatchPercent("50");
    setYears("25");
    setExpectedReturn("7");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>401(k) assumptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Current Balance ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" min={0} value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="pl-7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly Contribution ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" min={0} value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="pl-7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Employer Match (%)</Label>
                <Input type="number" min={0} max={100} value={employerMatchPercent} onChange={(e) => setEmployerMatchPercent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" min={1} value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Expected Return (%/year)</Label>
                <Input type="number" min={0} step="0.1" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
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
              <CardDescription>Projected growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Final Balance</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.finalBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.totalContributions)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employer Match</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.totalEmployerMatch)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="mt-1 text-2xl font-semibold">{usd.format(result.totalEarnings)}</p>
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
              Growth is hypothetical. Employer match is applied to your contribution.
            </AlertDescription>
          </Alert>

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Balance Growth Over Time</CardTitle>
                <CardDescription>Projected balance by year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataLine}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
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
                <CardTitle>Contributions vs Earnings by Year</CardTitle>
                <CardDescription>First 15 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataBar}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                      <Bar dataKey="contributions" fill="var(--chart-1)" name="Contributions" stackId="a" />
                      <Bar dataKey="employerMatch" fill="var(--chart-2)" name="Employer Match" stackId="a" />
                      <Bar dataKey="earnings" fill="var(--chart-3)" name="Earnings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

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
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Contributions</TableHead>
                      <TableHead className="text-right">Employer Match</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">{row.year}</TableCell>
                        <TableCell className="text-right">{usd.format(row.balance)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.contributions)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.employerMatch)}</TableCell>
                        <TableCell className="text-right">{usd.format(row.earnings)}</TableCell>
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
        <AlertDescription>Estimates only. Actual returns and limits vary.</AlertDescription>
      </Alert>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur lg:hidden">
        <div className="flex gap-3">
          <Button className="flex-1">Calculate</Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </>
  );
}
