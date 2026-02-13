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
} from "recharts";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/exports/exportToPDF";
import { exportToExcel } from "@/lib/exports/exportToExcel";
import { exportToCSV } from "@/lib/exports/exportToCSV";
import { calculateRentVsBuy } from "@/lib/helpers/financial/calculateRentVsBuy";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState("400000");
  const [downPayment, setDownPayment] = useState("80000");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [propertyTaxPct, setPropertyTaxPct] = useState("1.2");
  const [insuranceYearly, setInsuranceYearly] = useState("2000");
  const [maintenancePct, setMaintenancePct] = useState("1");
  const [hoaMonthly, setHoaMonthly] = useState("0");
  const [closingCosts, setClosingCosts] = useState("8000");
  const [rentMonthly, setRentMonthly] = useState("2200");
  const [rentGrowth, setRentGrowth] = useState("3");
  const [appreciation, setAppreciation] = useState("3");
  const [investmentReturn, setInvestmentReturn] = useState("6");
  const [yearsToStay, setYearsToStay] = useState("5");

  const result = useMemo(() => {
    return calculateRentVsBuy({
      homePrice: Math.max(0, parseFloat(homePrice) || 0),
      downPayment: Math.max(0, parseFloat(downPayment) || 0),
      mortgageRatePercent: Math.max(0, parseFloat(mortgageRate) || 0),
      termYears: Math.max(1, parseFloat(termYears) || 30),
      propertyTaxPercent: Math.max(0, parseFloat(propertyTaxPct) || 0),
      insuranceYearly: Math.max(0, parseFloat(insuranceYearly) || 0),
      maintenancePercent: Math.max(0, parseFloat(maintenancePct) || 0),
      hoaMonthly: Math.max(0, parseFloat(hoaMonthly) || 0),
      closingCostsBuy: Math.max(0, parseFloat(closingCosts) || 0),
      rentMonthly: Math.max(0, parseFloat(rentMonthly) || 0),
      rentGrowthPercent: Math.max(0, parseFloat(rentGrowth) || 0),
      homeAppreciationPercent: Math.max(0, parseFloat(appreciation) || 0),
      investmentReturnPercent: Math.max(0, parseFloat(investmentReturn) || 0),
      yearsToStay: Math.max(1, parseFloat(yearsToStay) || 5),
    });
  }, [
    homePrice,
    downPayment,
    mortgageRate,
    termYears,
    propertyTaxPct,
    insuranceYearly,
    maintenancePct,
    hoaMonthly,
    closingCosts,
    rentMonthly,
    rentGrowth,
    appreciation,
    investmentReturn,
    yearsToStay,
  ]);

  const chartData = useMemo(
    () =>
      result.yearlyBreakdown.map((row) => ({
        year: row.year,
        Rent: row.rentCumulative,
        Buy: row.buyCumulative,
      })),
    [result.yearlyBreakdown],
  );

  const tableHeaders = [
    "Year",
    "Rent Cost",
    "Buy Cost",
    "Rent Cumulative",
    "Buy Cumulative",
  ];
  const tableRows = result.yearlyBreakdown.map(
    (row) =>
      [
        row.year,
        Number(row.rentCost.toFixed(0)),
        Number(row.buyCost.toFixed(0)),
        Number(row.rentCumulative.toFixed(0)),
        Number(row.buyCumulative.toFixed(0)),
      ] as (string | number)[],
  );

  const summaryData: Record<string, string | number> = useMemo(
    () => ({
      "Total Cost (Rent)": usd.format(result.totalCostRent),
      "Total Cost (Buy)": usd.format(result.totalCostBuy),
      "Net Difference": usd.format(result.netDifference),
      Recommendation: result.recommendation,
    }),
    [result],
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
    exportToPDF("Rent vs Buy", summaryData, tableHeaders, tableRows);
    toast.success("PDF downloaded");
  };

  const handleExportExcel = () => {
    exportToExcel("Rent vs Buy", tableHeaders, tableRows);
    toast.success("Excel file downloaded");
  };

  const handleDownloadFullSchedule = () => {
    exportToCSV("Rent-Vs-Buy-Yearly", tableHeaders, tableRows);
    toast.success("Yearly breakdown downloaded");
  };

  const handleReset = () => {
    setHomePrice("400000");
    setDownPayment("80000");
    setMortgageRate("6.5");
    setTermYears("30");
    setPropertyTaxPct("1.2");
    setInsuranceYearly("2000");
    setMaintenancePct("1");
    setHoaMonthly("0");
    setClosingCosts("8000");
    setRentMonthly("2200");
    setRentGrowth("3");
    setAppreciation("3");
    setInvestmentReturn("6");
    setYearsToStay("5");
    toast.info("Calculator reset");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Rent vs buy assumptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Home Price ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Down Payment ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mortgage Rate (APR %)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Term (years)</Label>
                <Input
                  type="number"
                  min={1}
                  value={termYears}
                  onChange={(e) => setTermYears(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Property Tax (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={propertyTaxPct}
                  onChange={(e) => setPropertyTaxPct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Insurance ($/year)</Label>
                <Input
                  type="number"
                  min={0}
                  value={insuranceYearly}
                  onChange={(e) => setInsuranceYearly(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Maintenance (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={maintenancePct}
                  onChange={(e) => setMaintenancePct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>HOA ($/month)</Label>
                <Input
                  type="number"
                  min={0}
                  value={hoaMonthly}
                  onChange={(e) => setHoaMonthly(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Closing Costs ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rent ($/month)</Label>
                <Input
                  type="number"
                  min={0}
                  value={rentMonthly}
                  onChange={(e) => setRentMonthly(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rent Growth (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={rentGrowth}
                  onChange={(e) => setRentGrowth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Home Appreciation (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={appreciation}
                  onChange={(e) => setAppreciation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Investment Return (%/year)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={investmentReturn}
                  onChange={(e) => setInvestmentReturn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Years to Compare</Label>
                <Input
                  type="number"
                  min={1}
                  value={yearsToStay}
                  onChange={(e) => setYearsToStay(e.target.value)}
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
              <CardDescription>Over {yearsToStay} years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Cost (Rent)
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalCostRent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Cost (Buy)
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.totalCostBuy)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recommendation
                  </p>
                  <p className="mt-1 text-2xl font-semibold capitalize">
                    {result.recommendation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Net Difference
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {usd.format(result.netDifference)}
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
              MVP comparison. Does not include opportunity cost of down payment
              invested elsewhere in the rent scenario.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Cumulative Cost Over Time</CardTitle>
              <CardDescription>Rent vs buy cumulative</CardDescription>
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
                      dataKey="Rent"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Buy"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yearly Breakdown</CardTitle>
              <CardDescription>Cost by year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Rent Cost</TableHead>
                      <TableHead className="text-right">Buy Cost</TableHead>
                      <TableHead className="text-right">
                        Rent Cumulative
                      </TableHead>
                      <TableHead className="text-right">
                        Buy Cumulative
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.yearlyBreakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">
                          {row.year}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.rentCost)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.buyCost)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.rentCumulative)}
                        </TableCell>
                        <TableCell className="text-right">
                          {usd.format(row.buyCumulative)}
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
          <strong>Disclaimer:</strong> For illustration only. Actual rent vs buy
          depends on many factors. Consult a financial advisor.
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
