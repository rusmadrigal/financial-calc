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
import { calculatePropertyTax } from "@/lib/helpers/financial/calculatePropertyTax";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function PropertyTaxCalculator() {
  const [assessedValue, setAssessedValue] = useState("350000");
  const [ratePercent, setRatePercent] = useState("1.2");
  const [exemption, setExemption] = useState("0");

  const result = useMemo(() => {
    return calculatePropertyTax({
      assessedValue: parseFloat(assessedValue) || 0,
      annualRatePercent: parseFloat(ratePercent) || 0,
      annualExemption: parseFloat(exemption) || 0,
    });
  }, [assessedValue, ratePercent, exemption]);

  const tableHeaders = ["Metric", "Value"];
  const tableRows: (string | number)[][] = [
    ["Assessed value", usd.format(result.assessedValue)],
    ["Taxable value", usd.format(result.taxableValue)],
    ["Annual rate (%)", `${result.annualRatePercent}%`],
    ["Annual tax", usd.format(result.annualTax)],
    ["Monthly equivalent", usd.format(result.monthlyEquivalent)],
  ];

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Annual Tax": usd.format(result.annualTax),
      Monthly: usd.format(result.monthlyEquivalent),
      "Taxable Value": usd.format(result.taxableValue),
    }),
    [result],
  );

  const hasResults = result.assessedValue > 0;

  const yearlyData = useMemo(() => {
    const years = 10;
    return Array.from({ length: years }, (_, i) => {
      const year = i + 1;
      const annualTax = result.annualTax;
      const cumulative = Math.round(annualTax * year * 100) / 100;
      return { year, annualTax, cumulative };
    });
  }, [result.annualTax]);

  const chartDataLine = useMemo(
    () =>
      yearlyData.map((row) => ({ year: row.year, balance: row.cumulative })),
    [yearlyData],
  );

  const chartDataBar = useMemo(
    () =>
      yearlyData.slice(0, 15).map((row) => ({
        year: row.year,
        annualTax: row.annualTax,
        cumulative: row.cumulative,
      })),
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
    exportToPDF(
      "Property Tax Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Property Tax", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleReset = () => {
    setAssessedValue("350000");
    setRatePercent("1.2");
    setExemption("0");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Property and rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Assessed value ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={assessedValue}
                    onChange={(e) => setAssessedValue(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Annual tax rate (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={ratePercent}
                  onChange={(e) => setRatePercent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Exemption ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={exemption}
                    onChange={(e) => setExemption(e.target.value)}
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
              <CardDescription>Property tax estimate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Annual tax</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.annualTax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly equivalent
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.monthlyEquivalent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxable value</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.taxableValue)}
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
              </div>
            </CardContent>
          </Card>

          {hasResults && chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Tax Over Time</CardTitle>
                <CardDescription>Total tax paid by year</CardDescription>
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
                        name="Cumulative"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {hasResults && chartDataBar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Annual Tax vs Cumulative by Year</CardTitle>
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
                        dataKey="annualTax"
                        fill="var(--chart-1)"
                        name="Annual Tax"
                      />
                      <Bar
                        dataKey="cumulative"
                        fill="var(--chart-3)"
                        name="Cumulative"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {hasResults && yearlyPreviewRows.length > 0 && (
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
                        <TableHead className="text-right">Annual Tax</TableHead>
                        <TableHead className="text-right">Cumulative</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyPreviewRows.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.annualTax)}
                          </TableCell>
                          <TableCell className="text-right">
                            {usd.format(row.cumulative)}
                          </TableCell>
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
              Rates vary by location. Some areas use mill rates; convert to
              percent (e.g. 12 mills = 1.2%).
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
