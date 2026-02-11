import type { ComponentType } from "react";
import { MortgageCalculator } from "../financial/MortgageCalculator";

export type CalculatorType = "mortgage";

const registry: Record<string, ComponentType<object>> = {
  mortgage: MortgageCalculator as ComponentType<object>,
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
