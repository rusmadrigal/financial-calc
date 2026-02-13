"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  CreditCard,
  DollarSign,
  Building2,
  Receipt,
  Car,
  SlidersHorizontal,
  X,
  RefreshCw,
  Snowflake,
  TrendingDown,
  GraduationCap,
  PiggyBank,
  TrendingUp,
  Landmark,
  CircleDollarSign,
  Percent,
} from "lucide-react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  getCalculatorsList,
  CALCULATOR_CATEGORIES,
  COMPLEXITY_LEVELS,
  type CalculatorEntry,
} from "@/lib/calculators/calculatorDataset";

/** Map iconKey from dataset to Lucide icon component */
const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  CreditCard,
  DollarSign,
  Building2,
  Receipt,
  Car,
  RefreshCw,
  Snowflake,
  TrendingDown,
  GraduationCap,
  PiggyBank,
  TrendingUp,
  Landmark,
  CircleDollarSign,
  Percent,
};

const categories = ["All", ...CALCULATOR_CATEGORIES];
const complexityLevels = ["All", ...COMPLEXITY_LEVELS];

interface CalculatorsPageProps {
  initialCategory?: string;
}

export function CalculatorsPage({ initialCategory }: CalculatorsPageProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedComplexity, setSelectedComplexity] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "name">("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allCalculators = useMemo(() => getCalculatorsList(), []);

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category],
      );
    }
  };

  const toggleComplexity = (complexity: string) => {
    if (complexity === "All") {
      setSelectedComplexity([]);
    } else {
      setSelectedComplexity((prev) =>
        prev.includes(complexity)
          ? prev.filter((c) => c !== complexity)
          : [...prev, complexity],
      );
    }
  };

  const filteredCalculators = useMemo(
    () =>
      allCalculators.filter((calc) => {
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(calc.category);
        const complexityMatch =
          selectedComplexity.length === 0 ||
          selectedComplexity.includes(calc.complexity);
        return categoryMatch && complexityMatch;
      }),
    [allCalculators, selectedCategories, selectedComplexity],
  );

  const sortedCalculators = useMemo(() => {
    const list = [...filteredCalculators];
    if (sortBy === "popular") {
      list.sort(
        (a, b) => b.popularity - a.popularity || a.title.localeCompare(b.title),
      );
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filteredCalculators, sortBy]);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <Label className="mb-4 block text-base">Category</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={`cat-${category}`}
                checked={
                  category === "All"
                    ? selectedCategories.length === 0
                    : selectedCategories.includes(category)
                }
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label
                htmlFor={`cat-${category}`}
                className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-4 block text-base">Complexity</Label>
        <div className="space-y-3">
          {complexityLevels.map((complexity) => (
            <div key={complexity} className="flex items-center space-x-3">
              <Checkbox
                id={`comp-${complexity}`}
                checked={
                  complexity === "All"
                    ? selectedComplexity.length === 0
                    : selectedComplexity.includes(complexity)
                }
                onCheckedChange={() => toggleComplexity(complexity)}
              />
              <Label
                htmlFor={`comp-${complexity}`}
                className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {complexity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {(selectedCategories.length > 0 || selectedComplexity.length > 0) && (
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCategories([]);
            setSelectedComplexity([]);
          }}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-foreground">All Calculators</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of financial calculators
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-64 shrink-0 lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="size-5 text-muted-foreground" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 size-4" />
                    Filters
                    {(selectedCategories.length > 0 ||
                      selectedComplexity.length > 0) && (
                      <Badge className="ml-2 size-5 rounded-full p-0 text-xs">
                        {selectedCategories.length + selectedComplexity.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex flex-1 items-center justify-end gap-2">
                <Label className="text-sm text-muted-foreground">
                  Sort by:
                </Label>
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as "popular" | "name")}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(selectedCategories.length > 0 ||
              selectedComplexity.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="gap-1.5">
                    {cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
                {selectedComplexity.map((comp) => (
                  <Badge key={comp} variant="secondary" className="gap-1.5">
                    {comp}
                    <button
                      onClick={() => toggleComplexity(comp)}
                      className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {sortedCalculators.length} of {allCalculators.length}{" "}
                calculators
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedCalculators.map((calc: CalculatorEntry) => (
                <CalculatorCard
                  key={calc.slug}
                  title={calc.title}
                  description={calc.description}
                  icon={ICON_MAP[calc.iconKey] ?? Building2}
                  badges={calc.features}
                  onOpen={() => router.push(`/calculators/${calc.slug}`)}
                />
              ))}
            </div>

            {sortedCalculators.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="py-16 text-center">
                  <p className="text-lg text-muted-foreground">
                    No calculators match your filters
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedComplexity([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
