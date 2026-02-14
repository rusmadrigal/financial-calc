import type { ComponentType } from "react";
import { MortgageCalculator } from "../financial/MortgageCalculator";
import { RefinanceCalculator } from "../financial/RefinanceCalculator";
import { RentVsBuyCalculator } from "../financial/RentVsBuyCalculator";
import { AmortizationCalculator } from "../financial/AmortizationCalculator";
import { AutoLoanCalculator } from "../financial/AutoLoanCalculator";
import { CarLeaseCalculator } from "../financial/CarLeaseCalculator";
import { PersonalLoanCalculator } from "../financial/PersonalLoanCalculator";
import { CreditCardPayoffCalculator } from "../financial/CreditCardPayoffCalculator";
import { DebtSnowballCalculator } from "../financial/DebtSnowballCalculator";
import { DebtAvalancheCalculator } from "../financial/DebtAvalancheCalculator";
import { StudentLoanCalculator } from "../financial/StudentLoanCalculator";
import { Calculator401k } from "../financial/Calculator401k";
import { IRACalculator } from "../financial/IRACalculator";
import { RothIRACalculator } from "../financial/RothIRACalculator";
import { RetirementCalculator } from "../financial/RetirementCalculator";
import { SocialSecurityCalculator } from "../financial/SocialSecurityCalculator";
import { AnnuityPayoutCalculator } from "../financial/AnnuityPayoutCalculator";
import { CompoundInterestCalculator } from "../financial/CompoundInterestCalculator";
import { InvestmentReturnCalculator } from "../financial/InvestmentReturnCalculator";
import { DividendCalculator } from "../financial/DividendCalculator";
import { StockProfitCalculator } from "../financial/StockProfitCalculator";
import { SavingsCalculator } from "../financial/SavingsCalculator";
import { CDCalculator } from "../financial/CDCalculator";
import { HighYieldSavingsCalculator } from "../financial/HighYieldSavingsCalculator";
import { HELOCCalculator } from "../financial/HELOCCalculator";
import { HomeAffordabilityCalculator } from "../financial/HomeAffordabilityCalculator";
import { DownPaymentCalculator } from "../financial/DownPaymentCalculator";
import { PropertyTaxCalculator } from "../financial/PropertyTaxCalculator";
import { ClosingCostCalculator } from "../financial/ClosingCostCalculator";
import { MortgageAPRCalculator } from "../financial/MortgageAPRCalculator";
import { BusinessLoanCalculator } from "../financial/BusinessLoanCalculator";
import { SBALoanCalculator } from "../financial/SBALoanCalculator";
import { StartupCostCalculator } from "../financial/StartupCostCalculator";
import { BreakEvenCalculator } from "../financial/BreakEvenCalculator";
import { ProfitMarginCalculator } from "../financial/ProfitMarginCalculator";
import { SalesTaxCalculator } from "../financial/SalesTaxCalculator";
import { FederalIncomeTaxCalculator } from "../financial/FederalIncomeTaxCalculator";
import { CapitalGainsTaxCalculator } from "../financial/CapitalGainsTaxCalculator";
import { PaycheckCalculator } from "../financial/PaycheckCalculator";
import { HourlyToSalaryCalculator } from "../financial/HourlyToSalaryCalculator";
import { SalaryToHourlyCalculator } from "../financial/SalaryToHourlyCalculator";
import { InflationCalculator } from "../financial/InflationCalculator";
import { NetWorthCalculator } from "../financial/NetWorthCalculator";
import { EmergencyFundCalculator } from "../financial/EmergencyFundCalculator";
import { BudgetCalculator } from "../financial/BudgetCalculator";
import { CollegeSavingsCalculator } from "../financial/CollegeSavingsCalculator";
import { Plan529Calculator } from "../financial/Plan529Calculator";
import { HSACalculator } from "../financial/HSACalculator";
import { LifeInsuranceCalculator } from "../financial/LifeInsuranceCalculator";
import { DisabilityInsuranceCalculator } from "../financial/DisabilityInsuranceCalculator";

export type CalculatorType =
  | "mortgage"
  | "refinance"
  | "rentVsBuy"
  | "amortization"
  | "autoLoan"
  | "carLease"
  | "personalLoan"
  | "creditCardPayoff"
  | "debtSnowball"
  | "debtAvalanche"
  | "studentLoan"
  | "calculator401k"
  | "ira"
  | "rothIra"
  | "retirement"
  | "socialSecurity"
  | "annuityPayout"
  | "compoundInterest"
  | "investmentReturn"
  | "dividend"
  | "stockProfit"
  | "savings"
  | "cd"
  | "highYieldSavings"
  | "heloc"
  | "homeAffordability"
  | "downPayment"
  | "propertyTax"
  | "closingCosts"
  | "mortgageAPR"
  | "businessLoan"
  | "sbaLoan"
  | "startupCost"
  | "breakEven"
  | "profitMargin"
  | "salesTax"
  | "federalIncomeTax"
  | "capitalGainsTax"
  | "paycheck"
  | "hourlyToSalary"
  | "salaryToHourly"
  | "inflation"
  | "netWorth"
  | "emergencyFund"
  | "budget"
  | "collegeSavings"
  | "plan529"
  | "hsa"
  | "lifeInsurance"
  | "disabilityInsurance";

const registry: Record<string, ComponentType<object>> = {
  mortgage: MortgageCalculator as ComponentType<object>,
  refinance: RefinanceCalculator as ComponentType<object>,
  rentVsBuy: RentVsBuyCalculator as ComponentType<object>,
  amortization: AmortizationCalculator as ComponentType<object>,
  autoLoan: AutoLoanCalculator as ComponentType<object>,
  carLease: CarLeaseCalculator as ComponentType<object>,
  personalLoan: PersonalLoanCalculator as ComponentType<object>,
  creditCardPayoff: CreditCardPayoffCalculator as ComponentType<object>,
  debtSnowball: DebtSnowballCalculator as ComponentType<object>,
  debtAvalanche: DebtAvalancheCalculator as ComponentType<object>,
  studentLoan: StudentLoanCalculator as ComponentType<object>,
  calculator401k: Calculator401k as ComponentType<object>,
  ira: IRACalculator as ComponentType<object>,
  rothIra: RothIRACalculator as ComponentType<object>,
  retirement: RetirementCalculator as ComponentType<object>,
  socialSecurity: SocialSecurityCalculator as ComponentType<object>,
  annuityPayout: AnnuityPayoutCalculator as ComponentType<object>,
  compoundInterest: CompoundInterestCalculator as ComponentType<object>,
  investmentReturn: InvestmentReturnCalculator as ComponentType<object>,
  dividend: DividendCalculator as ComponentType<object>,
  stockProfit: StockProfitCalculator as ComponentType<object>,
  savings: SavingsCalculator as ComponentType<object>,
  cd: CDCalculator as ComponentType<object>,
  highYieldSavings: HighYieldSavingsCalculator as ComponentType<object>,
  heloc: HELOCCalculator as ComponentType<object>,
  homeAffordability: HomeAffordabilityCalculator as ComponentType<object>,
  downPayment: DownPaymentCalculator as ComponentType<object>,
  propertyTax: PropertyTaxCalculator as ComponentType<object>,
  closingCosts: ClosingCostCalculator as ComponentType<object>,
  mortgageAPR: MortgageAPRCalculator as ComponentType<object>,
  businessLoan: BusinessLoanCalculator as ComponentType<object>,
  sbaLoan: SBALoanCalculator as ComponentType<object>,
  startupCost: StartupCostCalculator as ComponentType<object>,
  breakEven: BreakEvenCalculator as ComponentType<object>,
  profitMargin: ProfitMarginCalculator as ComponentType<object>,
  salesTax: SalesTaxCalculator as ComponentType<object>,
  federalIncomeTax: FederalIncomeTaxCalculator as ComponentType<object>,
  capitalGainsTax: CapitalGainsTaxCalculator as ComponentType<object>,
  paycheck: PaycheckCalculator as ComponentType<object>,
  hourlyToSalary: HourlyToSalaryCalculator as ComponentType<object>,
  salaryToHourly: SalaryToHourlyCalculator as ComponentType<object>,
  inflation: InflationCalculator as ComponentType<object>,
  netWorth: NetWorthCalculator as ComponentType<object>,
  emergencyFund: EmergencyFundCalculator as ComponentType<object>,
  budget: BudgetCalculator as ComponentType<object>,
  collegeSavings: CollegeSavingsCalculator as ComponentType<object>,
  plan529: Plan529Calculator as ComponentType<object>,
  hsa: HSACalculator as ComponentType<object>,
  lifeInsurance: LifeInsuranceCalculator as ComponentType<object>,
  disabilityInsurance: DisabilityInsuranceCalculator as ComponentType<object>,
};

export function getCalculatorComponent(
  calculatorType: string,
): ComponentType<object> | null {
  return registry[calculatorType] ?? null;
}

export function CalculatorSlot({ calculatorType }: { calculatorType: string }) {
  const Component = getCalculatorComponent(calculatorType);
  if (!Component) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
        Calculator &quot;{calculatorType}&quot; is not available.
      </div>
    );
  }
  return <Component />;
}
