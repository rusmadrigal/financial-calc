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

export function HourlyToSalaryCalculator() {
  const [hourly, setHourly] = useState("25");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");

  const hourlyNum = parseFloat(hourly) || 0;
  const hoursNum = parseFloat(hoursPerWeek) || 0;
  const annual = Math.round(hourlyNum * hoursNum * 52 * 100) / 100;

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Hourly rate": usd.format(hourlyNum),
      "Hours/week": hoursNum,
      "Annual salary": usd.format(annual),
    }),
    [hourlyNum, hoursNum, annual],
  );

  const monthly = Math.round((annual / 12) * 100) / 100;
  const barData = useMemo(
    () => [{ year: 1, Annual: annual, Monthly: monthly }],
    [annual, monthly],
  );

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(
        `Hourly: ${usd.format(hourlyNum)} | Annual: ${usd.format(annual)}`,
      )
      .then(() => toast.success("Copied!"));
  };

  const handleExportPDF = () => {
    exportToPDF(
      "Hourly to Salary",
      summaryData,
      ["Metric", "Value"],
      [
        ["Hourly rate", usd.format(hourlyNum)],
        ["Hours per week", hoursNum],
        ["Annual salary", usd.format(annual)],
      ],
    );
    toast.success("PDF downloaded");
  };

  const handleReset = () => {
    setHourly("25");
    setHoursPerWeek("40");
    toast.info("Reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Hourly wage and hours per week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Hourly rate ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={hourly}
                    onChange={(e) => setHourly(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hours per week</Label>
                <Input
                  type="number"
                  min={0.1}
                  max={168}
                  step="0.5"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                />
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
              <CardDescription>Annual salary (52 weeks)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly rate</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(hourlyNum)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual salary</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(annual)}
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
              <CardTitle>Breakdown (Year 1)</CardTitle>
              <CardDescription>Annual vs monthly equivalent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={`${hourly}-${hoursPerWeek}`} data={barData}>
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
                    <Bar
                      dataKey="Annual"
                      fill="var(--chart-1)"
                      name="Annual salary"
                    />
                    <Bar
                      dataKey="Monthly"
                      fill="var(--chart-3)"
                      name="Monthly (annual ÷ 12)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Assumes 52 weeks per year. No overtime or unpaid leave.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Alert className="mt-8 border-2 border-destructive/50 bg-destructive/5">
        <AlertCircle className="size-4" />
        <AlertDescription>
          For comparison only. Actual pay may vary.
        </AlertDescription>
      </Alert>
    </>
  );
}
