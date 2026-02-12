/**
 * Rent vs Buy calculator (MVP): compare total cost of renting vs buying
 * over a given period. All amounts USD; rates as percent.
 */

export interface RentVsBuyInput {
  /** Home price (USD) */
  homePrice: number;
  /** Down payment (USD) */
  downPayment: number;
  /** Mortgage APR percent */
  mortgageRatePercent: number;
  /** Loan term in years */
  termYears: number;
  /** Property tax as percent of home value per year */
  propertyTaxPercent: number;
  /** Homeowners insurance per year (USD) */
  insuranceYearly: number;
  /** Maintenance as percent of home value per year */
  maintenancePercent: number;
  /** HOA per month (USD) */
  hoaMonthly: number;
  /** Closing costs when buying (USD) */
  closingCostsBuy: number;
  /** Monthly rent (USD) */
  rentMonthly: number;
  /** Rent growth percent per year */
  rentGrowthPercent: number;
  /** Home appreciation percent per year */
  homeAppreciationPercent: number;
  /** Investment return percent (opportunity cost for down payment) */
  investmentReturnPercent: number;
  /** Years to compare */
  yearsToStay: number;
}

export interface RentVsBuyYearRow {
  year: number;
  rentCost: number;
  buyCost: number;
  rentCumulative: number;
  buyCumulative: number;
  homeValue?: number;
  equity?: number;
}

export interface RentVsBuyOutput {
  totalCostRent: number;
  totalCostBuy: number;
  netDifference: number;
  /** e.g. "Rent" or "Buy" */
  recommendation: string;
  yearlyBreakdown: RentVsBuyYearRow[];
}

function monthlyPayment(
  principal: number,
  monthlyRate: number,
  numMonths: number,
): number {
  if (principal <= 0 || numMonths < 1) return 0;
  if (monthlyRate <= 0) return principal / numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyOutput {
  const homePrice = Math.max(0, input.homePrice);
  const downPayment = Math.max(0, Math.min(homePrice, input.downPayment));
  const principal = Math.max(0, homePrice - downPayment);
  const termYears = Math.max(1, Math.min(50, input.termYears));
  const numMonths = termYears * 12;
  const monthlyRate = Math.max(0, input.mortgageRatePercent) / 100 / 12;

  const mortgagePayment = monthlyPayment(principal, monthlyRate, numMonths);

  const propertyTaxPercent = Math.max(0, input.propertyTaxPercent) / 100;
  const insuranceYearly = Math.max(0, input.insuranceYearly);
  const maintenancePercent = Math.max(0, input.maintenancePercent) / 100;
  const hoaMonthly = Math.max(0, input.hoaMonthly);
  const closingCosts = Math.max(0, input.closingCostsBuy);
  const rentMonthly = Math.max(0, input.rentMonthly);
  const rentGrowth = Math.max(0, input.rentGrowthPercent) / 100;
  const appreciation = (Math.max(0, input.homeAppreciationPercent) / 100);
  const investmentReturn = Math.max(0, input.investmentReturnPercent) / 100;
  const years = Math.max(1, Math.min(50, Math.round(input.yearsToStay)));

  const yearlyBreakdown: RentVsBuyYearRow[] = [];
  let totalCostRent = 0;
  let totalCostBuy = closingCosts;
  let currentRent = rentMonthly * 12;
  let homeValue = homePrice;
  let balance = principal;
  const monthlyRateForSchedule = monthlyRate;

  for (let y = 1; y <= years; y++) {
    const yearRentCost = currentRent;
    totalCostRent += yearRentCost;
    currentRent *= 1 + rentGrowth;

    let yearBuyCost = 0;
    const monthsThisYear = Math.min(12, Math.max(0, numMonths - (y - 1) * 12));
    for (let m = 0; m < monthsThisYear && balance > 0; m++) {
      const interest = balance * monthlyRateForSchedule;
      const principalPaid = Math.min(mortgagePayment - interest, balance);
      balance = Math.max(0, balance - principalPaid);
      yearBuyCost += mortgagePayment;
    }
    yearBuyCost += homeValue * propertyTaxPercent;
    yearBuyCost += insuranceYearly;
    yearBuyCost += homeValue * maintenancePercent;
    yearBuyCost += hoaMonthly * 12;
    totalCostBuy += yearBuyCost;

    homeValue *= 1 + appreciation;
    const equity = homeValue - balance;

    yearlyBreakdown.push({
      year: y,
      rentCost: yearRentCost,
      buyCost: yearBuyCost,
      rentCumulative: totalCostRent,
      buyCumulative: totalCostBuy,
      homeValue,
      equity,
    });
  }

  const netDifference = totalCostRent - totalCostBuy;
  const recommendation = netDifference > 0 ? "Buy" : "Rent";

  return {
    totalCostRent,
    totalCostBuy,
    netDifference: Math.abs(netDifference),
    recommendation,
    yearlyBreakdown,
  };
}
