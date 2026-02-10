"use client";

import {
  Calculator,
  TrendingUp,
  Home,
  CreditCard,
  PiggyBank,
  DollarSign,
  Shield,
  Eye,
  Lock,
  FileDown,
  CheckCircle2,
  Smartphone,
  Printer,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { nameToSlug } from "@/lib/slugs";

const featuredCalculators = [
  {
    title: "Mortgage Calculator",
    description:
      "Calculate monthly payments, total interest, and amortization schedules for home loans.",
    icon: Home,
    badges: ["Amortization Table", "Export PDF"],
  },
  {
    title: "401(k) Calculator",
    description:
      "Estimate your retirement savings growth with employer matching and tax benefits.",
    icon: PiggyBank,
    badges: ["Tax Scenarios", "Projections"],
  },
  {
    title: "Investment Return Calculator",
    description:
      "Calculate compound returns, ROI, and future value of your investments over time.",
    icon: TrendingUp,
    badges: ["Compound Interest", "Charts"],
  },
  {
    title: "Credit Card Payoff Calculator",
    description:
      "Find out how long it will take to pay off credit card debt and save on interest.",
    icon: CreditCard,
    badges: ["Payoff Strategy", "Interest Savings"],
  },
  {
    title: "Loan Calculator",
    description:
      "Compare loan options with detailed breakdowns of principal and interest payments.",
    icon: DollarSign,
    badges: ["APR Comparison", "Payment Schedule"],
  },
  {
    title: "Retirement Savings Calculator",
    description:
      "Plan for retirement with Social Security, pensions, and investment projections.",
    icon: Calculator,
    badges: ["Multiple Income", "Inflation Adjusted"],
  },
];

const categories = [
  { name: "Investing", icon: TrendingUp, count: 12, color: "text-chart-1" },
  { name: "Debt", icon: CreditCard, count: 8, color: "text-chart-2" },
  { name: "Loans", icon: Home, count: 15, color: "text-chart-3" },
  { name: "Retirement", icon: PiggyBank, count: 10, color: "text-chart-5" },
  { name: "Taxes", icon: DollarSign, count: 6, color: "text-chart-4" },
];

const benefits = [
  {
    title: "Built for Accuracy",
    description:
      "Every calculation is based on standard US financial formulas and regularly validated.",
    icon: CheckCircle2,
  },
  {
    title: "Complete Transparency",
    description:
      "See exactly how results are calculated with detailed breakdowns and assumptions.",
    icon: Eye,
  },
  {
    title: "Privacy First",
    description:
      "No tracking, no data collection. Your financial information stays on your device.",
    icon: Lock,
  },
  {
    title: "Export & Share",
    description:
      "Download results as PDF or Excel, or share calculations with your advisor.",
    icon: FileDown,
  },
];

const trustIndicators = [
  { label: "Free Forever", icon: DollarSign },
  { label: "No Signup Required", icon: Shield },
  { label: "Mobile Friendly", icon: Smartphone },
  { label: "Printable Results", icon: Printer },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "First-time Homebuyer",
    rating: 5,
    text: "The mortgage calculator helped me understand exactly what I could afford. Clear, detailed, and trustworthy.",
  },
  {
    name: "James T.",
    role: "Retirement Planning",
    rating: 5,
    text: "Finally, a 401(k) calculator that breaks down employer matching and tax advantages in plain English.",
  },
  {
    name: "Maria L.",
    role: "Debt Management",
    rating: 5,
    text: "Used the credit card payoff calculator to create a plan. Saved hundreds in interest!",
  },
];

export function HomePage() {
  const router = useRouter();
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

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Financial Calculators, Built for Clarity.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-foreground/80 sm:text-xl">
              Fast, accurate, and easy-to-understand tools for smarter money
              decisions in the US.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar
                onSelect={(calc) =>
                  router.push(`/calculators/${nameToSlug(calc)}`)
                }
              />
            </div>

            {/* Trust Row */}
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

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => router.push("/calculators")}
                className="w-full sm:w-auto"
              >
                Open Calculators
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/embed")}
                className="w-full sm:w-auto"
              >
                Embed a Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Calculators */}
      <section className="border-b border-border bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl text-foreground sm:text-4xl">
              Featured Calculators
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Most popular tools for personal finance decisions
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCalculators.map((calc) => (
              <CalculatorCard
                key={calc.title}
                title={calc.title}
                description={calc.description}
                icon={calc.icon}
                badges={calc.badges}
                onOpen={() =>
                  router.push(`/calculators/${nameToSlug(calc.title)}`)
                }
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/calculators")}
            >
              View All Calculators
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl text-foreground sm:text-4xl">
              Popular Categories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse calculators by topic
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="group cursor-pointer transition-all hover:border-accent/50 hover:shadow-md"
                  onClick={() =>
                    router.push(
                      `/calculators?category=${encodeURIComponent(category.name)}`,
                    )
                  }
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

      {/* Why SmartCalcLab */}
      <section className="border-b border-border bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl text-foreground sm:text-4xl">
              Why SmartCalcLab
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional tools you can trust
            </p>
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

      {/* Social Proof */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-6 fill-accent text-accent" />
              ))}
            </div>
            <h2 className="text-3xl text-foreground sm:text-4xl">
              Trusted by Thousands
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our users are saying
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-medium text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
