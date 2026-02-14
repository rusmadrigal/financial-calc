"use client";

import { useState, useMemo } from "react";
import { Copy, Download, Info, AlertCircle } from "lucide-react";
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

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function NetWorthCalculator() {
  const [assets, setAssets] = useState("250000");
  const [liabilities, setLiabilities] = useState("150000");

  const assetsNum = parseFloat(assets) || 0;
  const liabilitiesNum = parseFloat(liabilities) || 0;
  const netWorth = Math.round((assetsNum - liabilitiesNum) * 100) / 100;

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      Assets: usd.format(assetsNum),
      Liabilities: usd.format(liabilitiesNum),
      "Net Worth": usd.format(netWorth),
    }),
    [assetsNum, liabilitiesNum, netWorth],
  );

  const barData = useMemo(
    () => [
      {
        year: 1,
        Assets: assetsNum,
        Liabilities: liabilitiesNum,
        "Net Worth": netWorth,
      },
    ],
    [assetsNum, liabilitiesNum, netWorth],
  );

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(
        Object.entries(summaryData)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
      )
      .then(() => toast.success("Copied!"));
  };
  const handleExportPDF = () => {
    exportToPDF(
      "Net Worth Calculator",
      summaryData,
      ["Metric", "Value"],
      [
        ["Assets", usd.format(assetsNum)],
        ["Liabilities", usd.format(liabilitiesNum)],
        ["Net Worth", usd.format(netWorth)],
      ],
    );
    toast.success("PDF downloaded");
  };
  const handleReset = () => {
    setAssets("250000");
    setLiabilities("150000");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Total assets and liabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Total assets ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={assets}
                    onChange={(e) => setAssets(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total liabilities ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={liabilities}
                    onChange={(e) => setLiabilities(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Calculate</Button>
                <Button variant="outline" onClick={handleReset}>
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
              <CardDescription>Net worth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Assets</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(assetsNum)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Liabilities</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(liabilitiesNum)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net worth</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(netWorth)}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 size-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="mr-2 size-4" /> Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assets vs Liabilities</CardTitle>
              <CardDescription>Snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={`${assets}-${liabilities}`} data={barData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="year"
                      className="text-xs"
                      tickFormatter={() => "Year 1"}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="Assets" fill="var(--chart-1)" name="Assets" />
                    <Bar
                      dataKey="Liabilities"
                      fill="var(--chart-3)"
                      name="Liabilities"
                    />
                    <Bar
                      dataKey="Net Worth"
                      fill="var(--chart-2)"
                      name="Net Worth"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Net worth = Assets minus Liabilities. Update values as your
              situation changes.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          For personal use only. Not financial advice.
        </AlertDescription>
      </Alert>
    </>
  );
}
