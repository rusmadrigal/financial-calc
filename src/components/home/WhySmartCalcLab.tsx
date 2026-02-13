"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { BenefitItem } from "./homeData";

export interface WhySmartCalcLabProps {
  title: string;
  subtitle: string;
  benefits: BenefitItem[];
}

export function WhySmartCalcLab({
  title,
  subtitle,
  benefits,
}: WhySmartCalcLabProps) {
  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="border-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/10">
                    <Icon className="size-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
