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

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function BudgetCalculator() {
  const [income, setIncome] = useState("6000");
  const [housing, setHousing] = useState("1800");
  const [transport, setTransport] = useState("400");
  const [food, setFood] = useState("600");
  const [utilities, setUtilities] = useState("200");
  const [other, setOther] = useState("500");

  const incomeNum = parseFloat(income) || 0;
  const housingNum = parseFloat(housing) || 0;
  const transportNum = parseFloat(transport) || 0;
  const foodNum = parseFloat(food) || 0;
  const utilitiesNum = parseFloat(utilities) || 0;
  const otherNum = parseFloat(other) || 0;
  const totalExpenses =
    housingNum + transportNum + foodNum + utilitiesNum + otherNum;
  const surplus = Math.round((incomeNum - totalExpenses) * 100) / 100;

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Monthly income": usd.format(incomeNum),
      "Total expenses": usd.format(totalExpenses),
      "Surplus / Deficit": usd.format(surplus),
    }),
    [incomeNum, totalExpenses, surplus],
  );

  const barData = useMemo(
    () => [
      {
        year: 1,
        Income: incomeNum,
        Housing: housingNum,
        Transport: transportNum,
        Food: foodNum,
        Utilities: utilitiesNum,
        Other: otherNum,
        Expenses: totalExpenses,
      },
    ],
    [
      incomeNum,
      housingNum,
      transportNum,
      foodNum,
      utilitiesNum,
      otherNum,
      totalExpenses,
    ],
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
      "Budget Calculator",
      summaryData,
      ["Category", "Amount"],
      [
        ["Income", usd.format(incomeNum)],
        ["Housing", usd.format(housingNum)],
        ["Transport", usd.format(transportNum)],
        ["Food", usd.format(foodNum)],
        ["Utilities", usd.format(utilitiesNum)],
        ["Other", usd.format(otherNum)],
        ["Total expenses", usd.format(totalExpenses)],
        ["Surplus", usd.format(surplus)],
      ],
    );
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel("Budget", ["Category", "Amount"], [
      ["Income", usd.format(incomeNum)],
      ["Housing", usd.format(housingNum)],
      ["Transport", usd.format(transportNum)],
      ["Food", usd.format(foodNum)],
      ["Utilities", usd.format(utilitiesNum)],
      ["Other", usd.format(otherNum)],
      ["Total expenses", usd.format(totalExpenses)],
      ["Surplus", usd.format(surplus)],
    ]);
    toast.success("Excel downloaded");
  };

  const handleReset = () => {
    setIncome("6000");
    setHousing("1800");
    setTransport("400");
    setFood("600");
    setUtilities("200");
    setOther("500");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Monthly income and expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Monthly income ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Housing ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={housing}
                    onChange={(e) => setHousing(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Transport ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Food ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Utilities ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Other ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
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
              <CardDescription>Income vs expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Income</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(incomeNum)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(totalExpenses)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Surplus</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(surplus)}
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
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 size-4" /> Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses (Year 1)</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={`${income}-${totalExpenses}`} data={barData}>
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
                    <Bar dataKey="Income" fill="var(--chart-1)" name="Income" />
                    <Bar
                      dataKey="Expenses"
                      fill="var(--chart-3)"
                      name="Expenses"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Surplus = Income minus total expenses. Add or remove categories as
              needed.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>For personal planning only.</AlertDescription>
      </Alert>
    </>
  );
}
