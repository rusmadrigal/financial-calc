"use client";

import { CalculatorSearch } from "@/components/home/CalculatorSearch";
import type { SearchCalculatorItem } from "@/components/home/CalculatorSearch";
import { Button } from "@/components/ui/button";
import type { TrustIndicatorItem } from "./homeData";

export type { SearchCalculatorItem };

export interface HomeHeroProps {
  headline: string;
  subheadline: string;
  trustIndicators: TrustIndicatorItem[];
  /** List of calculators for search (from central dataset; same as /calculators). */
  searchCalculators: SearchCalculatorItem[];
  /** Called with slug when user selects a calculator from search */
  onSearchSelect: (slug: string) => void;
  onOpenCalculators: () => void;
  onEmbed: () => void;
}

export function HomeHero({
  headline,
  subheadline,
  trustIndicators,
  searchCalculators,
  onSearchSelect,
  onOpenCalculators,
  onEmbed,
}: HomeHeroProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          <h1 className="mx-auto max-w-4xl text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-foreground/80 sm:text-xl">
            {subheadline}
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <CalculatorSearch
              calculators={searchCalculators}
              onSelect={onSearchSelect}
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {trustIndicators.map((indicator) => {
              const Icon = indicator.icon;
              return (
                <div
                  key={indicator.label}
                  className="flex flex-col items-center gap-2 sm:gap-3"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12">
                    <Icon className="size-5 text-primary sm:size-6" />
                  </div>
                  <span className="text-xs font-medium text-foreground sm:text-sm">
                    {indicator.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={onOpenCalculators}
              className="w-full sm:w-auto"
            >
              Open Calculators
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onEmbed}
              className="w-full sm:w-auto"
            >
              Embed a Calculator
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
