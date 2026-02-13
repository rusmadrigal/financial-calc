"use client";

import { CalculatorCard } from "@/components/CalculatorCard";
import { Button } from "@/components/ui/button";
import type { FeaturedCalculatorItem } from "./homeData";

export interface FeaturedCalculatorsProps {
  title: string;
  subtitle: string;
  calculators: FeaturedCalculatorItem[];
  /** Called with slug (e.g. mortgage-calculator) when user opens a calculator */
  onOpenCalculator: (slug: string) => void;
  onViewAll: () => void;
}

export function FeaturedCalculators({
  title,
  subtitle,
  calculators,
  onOpenCalculator,
  onViewAll,
}: FeaturedCalculatorsProps) {
  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <CalculatorCard
              key={calc.title}
              title={calc.title}
              description={calc.description}
              icon={calc.icon}
              badges={calc.badges}
              onOpen={() => onOpenCalculator(calc.slug ?? calc.title)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={onViewAll}>
            View All Calculators
          </Button>
        </div>
      </div>
    </section>
  );
}
