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
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { calculateCD } from "@/lib/helpers/financial/calculateCD";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function CDCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [apy, setApy] = useState("5");
  const [termMonths, setTermMonths] = useState("12");

  const result = useMemo(() => {
    return calculateCD({
      principal: Math.max(0, parseFloat(principal) || 0),
      apyPercent: Math.max(0, parseFloat(apy) || 0),
      termMonths: Math.max(1, parseInt(termMonths, 10) || 12),
    });
  }, [principal, apy, termMonths]);

  const tableHeaders = ["Metric", "Value"];
  const tableRows: (string | number)[][] = [
    ["Principal", usd.format(result.principal)],
    ["Maturity Value", usd.format(result.maturityValue)],
    ["Interest Earned", usd.format(result.interestEarned)],
    ["Effective Rate %", `${result.effectiveRate}%`],
  ];

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Maturity Value": usd.format(result.maturityValue),
      "Interest Earned": usd.format(result.interestEarned),
      "Effective Rate %": `${result.effectiveRate}%`,
    }),
    [result],
  );

  const hasResults = result.principal > 0;

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
    exportToPDF("CD Calculator", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    if (!hasResults) return;
    exportToExcel("CD Calculator", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleReset = () => {
    setPrincipal("10000");
    setApy("5");
    setTermMonths("12");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
              <CardDescription>Certificate of deposit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Principal ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>APY (%)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={apy}
                  onChange={(e) => setApy(e.target.value)}
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
              <CardDescription>At maturity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Maturity Value
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.maturityValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Interest Earned
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.interestEarned)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Effective Rate
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.effectiveRate}%
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
              APY assumes interest compounded to maturity. Early withdrawal may
              incur penalties.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
