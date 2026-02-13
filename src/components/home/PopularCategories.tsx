"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CategoryItem } from "./homeData";

export interface PopularCategoriesProps {
  title: string;
  subtitle: string;
  categories: CategoryItem[];
  onSelectCategory: (name: string) => void;
}

export function PopularCategories({
  title,
  subtitle,
  categories,
  onSelectCategory,
}: PopularCategoriesProps) {
  return (
    <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.name}
                className="group cursor-pointer transition-all hover:border-accent/50 hover:shadow-md"
                onClick={() => onSelectCategory(category.name)}
              >
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className={`size-8 ${category.color}`} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.count} calculators
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
