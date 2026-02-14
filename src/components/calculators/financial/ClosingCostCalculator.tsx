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
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateClosingCosts } from "@/lib/helpers/financial/calculateClosingCosts";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function ClosingCostCalculator() {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [originationPct, setOriginationPct] = useState("1");
  const [appraisalFee, setAppraisalFee] = useState("500");
  const [titleInsurance, setTitleInsurance] = useState("1500");
  const [pointsPct, setPointsPct] = useState("0");
  const [otherFees, setOtherFees] = useState("500");

  const result = useMemo(() => {
    return calculateClosingCosts({
      loanAmount: parseFloat(loanAmount) || 0,
      originationPercent: parseFloat(originationPct) || 0,
      appraisalFee: parseFloat(appraisalFee) || 0,
      titleInsurance: parseFloat(titleInsurance) || 0,
      pointsPercent: parseFloat(pointsPct) || 0,
      otherFees: parseFloat(otherFees) || 0,
    });
  }, [
    loanAmount,
    originationPct,
    appraisalFee,
    titleInsurance,
    pointsPct,
    otherFees,
  ]);

  const tableHeaders = ["Item", "Amount"];
  const tableRows: (string | number)[][] = result.items.map((i) => [
    i.label,
    usd.format(i.amount),
  ]);
  if (tableRows.length > 0) {
    tableRows.push(["Total", usd.format(result.totalClosingCosts)]);
  }

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Loan Amount": usd.format(result.loanAmount),
      "Total Closing Costs": usd.format(result.totalClosingCosts),
    }),
    [result],
  );

  const hasResults = result.loanAmount > 0;

  const chartDataBar = useMemo(() => {
    if (result.items.length === 0) return [];
    const row: Record<string, number | string> = { year: 1 };
    result.items.forEach((i) => {
      row[i.label] = i.amount;
    });
    return [row];
  }, [result.items]);

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
    exportToPDF(
      "Closing Cost Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Closing Costs", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleExportCSV = () => {
    if (!hasResults) return;
    exportToCSV("Closing-Costs", tableHeaders, tableRows);
    toast.success("CSV downloaded");
  };

  const handleReset = () => {
    setLoanAmount("300000");
    setOriginationPct("1");
    setAppraisalFee("500");
    setTitleInsurance("1500");
    setPointsPct("0");
    setOtherFees("500");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Loan and fee assumptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loan amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Origination (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={originationPct}
                  onChange={(e) => setOriginationPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Points (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.25"
                  value={pointsPct}
                  onChange={(e) => setPointsPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Appraisal ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={appraisalFee}
                    onChange={(e) => setAppraisalFee(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title insurance ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={titleInsurance}
                    onChange={(e) => setTitleInsurance(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Other fees ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={otherFees}
                    onChange={(e) => setOtherFees(e.target.value)}
                    className="pl-7"
                  />
                </div>
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
              <CardDescription>Closing cost breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total closing costs
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalClosingCosts)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan amount</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.loanAmount)}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={!hasResults}
                >
                  <Download className="mr-2 size-4" /> Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {chartDataBar.length > 0 && result.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Closing Costs by Category (Year 1)</CardTitle>
                <CardDescription>
                  One-time closing cost breakdown
                </CardDescription>
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
                      {result.items.map((item, idx) => (
                        <Bar
                          key={item.label}
                          dataKey={item.label}
                          fill={
                            idx % 2 === 0 ? "var(--chart-1)" : "var(--chart-3)"
                          }
                          name={item.label}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {result.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Breakdown</CardTitle>
                <CardDescription>Line items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.items.map((item) => (
                      <TableRow key={item.label}>
                        <TableCell className="font-medium">
                          {item.label}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-semibold">Total</TableCell>
                      <TableCell className="text-right font-semibold">
                        {usd.format(result.totalClosingCosts)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Closing costs vary by lender and location. Add or adjust line
              items as needed for your scenario.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
