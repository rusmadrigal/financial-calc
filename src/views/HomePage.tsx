"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCalculatorsList } from "@/lib/calculators/calculatorDataset";
import {
  HomeHero,
  FeaturedCalculators,
  PopularCategories,
  WhySmartCalcLab,
  Testimonials,
  categories,
  benefits,
  trustIndicators,
  testimonials,
} from "@/components/home";
import type { FeaturedCalculatorItem } from "@/components/home";

/** Map iconKey from calculator dataset to Lucide icon (only tools that exist). */
const CALCULATOR_ICON_MAP: Record<string, LucideIcon> = {
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

export function HomePage() {
  const router = useRouter();

  const { featuredCalculators, searchCalculators } = useMemo(() => {
    const list = getCalculatorsList();
    const byPopularity = [...list].sort((a, b) => b.popularity - a.popularity);
    const featured: FeaturedCalculatorItem[] = byPopularity
      .slice(0, 6)
      .map((c) => ({
        title: c.title,
        description: c.description,
        icon: CALCULATOR_ICON_MAP[c.iconKey] ?? Building2,
        badges: c.features.slice(0, 2),
        slug: c.slug,
      }));
    const search = list.map((c) => ({
      name: c.title,
      slug: c.slug,
      category: c.category,
      icon: CALCULATOR_ICON_MAP[c.iconKey] ?? Building2,
    }));
    return { featuredCalculators: featured, searchCalculators: search };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Demo Notice Banner */}
      <div className="border-b border-border bg-accent/10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
            <p className="text-sm font-medium text-foreground">
              🎨 Complete SmartCalcLab Design System Demo
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/overview")}
              className="shrink-0"
            >
              View All Pages →
            </Button>
          </div>
        </div>
      </div>

      <HomeHero
        headline="Financial Calculators, Built for Clarity."
        subheadline="Fast, accurate, and easy-to-understand tools for smarter money decisions in the US."
        trustIndicators={trustIndicators}
        searchCalculators={searchCalculators}
        onSearchSelect={(slug) => router.push(`/calculators/${slug}`)}
        onOpenCalculators={() => router.push("/calculators")}
        onEmbed={() => router.push("/embed")}
      />

      <FeaturedCalculators
        title="Featured Calculators"
        subtitle="Most popular tools for personal finance decisions"
        calculators={featuredCalculators}
        onOpenCalculator={(slug) => router.push(`/calculators/${slug}`)}
        onViewAll={() => router.push("/calculators")}
      />

      <PopularCategories
        title="Popular Categories"
        subtitle="Browse calculators by topic"
        categories={categories}
        onSelectCategory={(name) =>
          router.push(`/calculators?category=${encodeURIComponent(name)}`)
        }
      />

      <WhySmartCalcLab
        title="Why SmartCalcLab"
        subtitle="Professional tools you can trust"
        benefits={benefits}
      />

      <Testimonials
        title="Trusted by Thousands"
        subtitle="See what our users are saying"
        testimonials={testimonials}
      />
    </div>
  );
}
