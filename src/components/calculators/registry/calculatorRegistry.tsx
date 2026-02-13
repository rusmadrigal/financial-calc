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
  | "retirement";

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
