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
import { calculateSocialSecurity } from "@/lib/helpers/financial/calculateSocialSecurity";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function SocialSecurityCalculator() {
  const [estimatedBenefitAtFRA, setEstimatedBenefitAtFRA] = useState("2000");
  const [ageToClaim, setAgeToClaim] = useState("67");
  const [yearsOfBenefits, setYearsOfBenefits] = useState("25");

  const result = useMemo(() => {
    return calculateSocialSecurity({
      estimatedBenefitAtFRA: Math.max(
        0,
        parseFloat(estimatedBenefitAtFRA) || 0,
      ),
      ageToClaim: Math.max(62, Math.min(70, parseInt(ageToClaim, 10) || 67)),
      yearsOfBenefits: Math.max(1, parseInt(yearsOfBenefits, 10) || 25),
    });
  }, [estimatedBenefitAtFRA, ageToClaim, yearsOfBenefits]);

  const chartDataLine = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: row.year,
        yearlyBenefit: Math.round(row.yearlyBenefit),
      })),
    [result.yearlyBreakdown],
  );

  const chartDataBar = useMemo(
    () =>
      result.yearlyBreakdown.slice(0, 20).map((row) => ({
        year: row.year,
        age: row.age,
        yearlyBenefit: Math.round(row.yearlyBenefit),
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = ["Year", "Age", "Monthly Benefit", "Yearly Benefit"];
  const tableRows = result.yearlyBreakdown.map(
    (row) =>
      [
        row.year,
        row.age,
        Number(row.monthlyBenefit.toFixed(2)),
        Number(row.yearlyBenefit.toFixed(2)),
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Monthly Benefit": usd.format(result.monthlyBenefit),
      "Yearly Benefit": usd.format(result.yearlyBenefit),
      "Total Projected (period)": usd.format(result.totalProjectedBenefits),
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
    exportToPDF(
      "Social Security Calculator",
      summaryData,
      tableHeaders,
      tableRows,
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("Social Security Schedule", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    if (!hasResults) return;
    exportToCSV("Social-Security-Schedule", tableHeaders, tableRows);
    toast.success("Full schedule downloaded");
  };

  const handleReset = () => {
    setEstimatedBenefitAtFRA("2000");
    setAgeToClaim("67");
    setYearsOfBenefits("25");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Social Security estimates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Estimated benefit at FRA ($/month)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={estimatedBenefitAtFRA}
                    onChange={(e) => setEstimatedBenefitAtFRA(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Age to start claiming (62–70)</Label>
                <Input
                  type="number"
                  min={62}
                  max={70}
                  value={ageToClaim}
                  onChange={(e) => setAgeToClaim(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Years to project</Label>
                <Input
                  type="number"
                  min={1}
                  value={yearsOfBenefits}
                  onChange={(e) => setYearsOfBenefits(e.target.value)}
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
              <CardDescription>Estimated benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Benefit
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.monthlyBenefit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Yearly Benefit
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.yearlyBenefit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Projected
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalProjectedBenefits)}
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

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Estimates only. Actual benefits depend on earnings history. FRA
              assumed 67.
            </AlertDescription>
          </Alert>

          {chartDataLine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Yearly Benefit Over Time</CardTitle>
                <CardDescription>Projected benefit per year</CardDescription>
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
                        dataKey="yearlyBenefit"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        name="Yearly Benefit"
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
                <CardTitle>Yearly Benefit by Year (first 20)</CardTitle>
                <CardDescription>Benefit amount per year</CardDescription>
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
                        dataKey="yearlyBenefit"
                        fill="var(--chart-1)"
                        name="Yearly Benefit"
                      />
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
                      <TableHead>Age</TableHead>
                      <TableHead className="text-right">Monthly</TableHead>
                      <TableHead className="text-right">Yearly</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">
                          {row.year}
                        </TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.monthlyBenefit)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.yearlyBenefit)}
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
          Estimates only. Use SSA.gov for official estimates.
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
