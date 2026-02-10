'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  TrendingUp,
  Home,
  CreditCard,
  PiggyBank,
  DollarSign,
  Calendar,
  Banknote,
  Building2,
  Target,
  LineChart,
  Receipt,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CalculatorCard } from '../components/CalculatorCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Badge } from '../components/ui/badge';
import { nameToSlug } from '../lib/slugs';

interface CalculatorsPageProps {
  initialCategory?: string;
}

const allCalculators = [
  {
    title: 'Mortgage Calculator',
    description: 'Calculate monthly payments, total interest, and amortization schedules for home loans with customizable terms.',
    icon: Home,
    category: 'Loans',
    complexity: 'Simple',
    badges: ['Amortization Table', 'Export PDF', 'Charts'],
  },
  {
    title: '401(k) Calculator',
    description: 'Estimate retirement savings growth with employer matching, contribution limits, and tax-deferred benefits.',
    icon: PiggyBank,
    category: 'Retirement',
    complexity: 'Advanced',
    badges: ['Tax Scenarios', 'Projections', 'Employer Match'],
  },
  {
    title: 'Investment Return Calculator',
    description: 'Calculate compound returns, ROI, and future value with monthly contributions and dividend reinvestment.',
    icon: TrendingUp,
    category: 'Investing',
    complexity: 'Simple',
    badges: ['Compound Interest', 'Charts', 'Export Excel'],
  },
  {
    title: 'Credit Card Payoff Calculator',
    description: 'Determine payoff timeline and total interest with minimum payments vs. accelerated strategies.',
    icon: CreditCard,
    category: 'Debt',
    complexity: 'Simple',
    badges: ['Payoff Strategy', 'Interest Savings'],
  },
  {
    title: 'Auto Loan Calculator',
    description: 'Compare auto financing options with trade-in values, down payments, and APR calculations.',
    icon: Building2,
    category: 'Loans',
    complexity: 'Simple',
    badges: ['Trade-in Value', 'APR Comparison'],
  },
  {
    title: 'Retirement Savings Calculator',
    description: 'Plan comprehensive retirement with Social Security, pensions, IRA, and investment income projections.',
    icon: Calendar,
    category: 'Retirement',
    complexity: 'Advanced',
    badges: ['Multiple Income', 'Inflation Adjusted', 'Longevity'],
  },
  {
    title: 'Loan Amortization Calculator',
    description: 'Generate detailed payment schedules showing principal and interest breakdown for any loan type.',
    icon: Receipt,
    category: 'Loans',
    complexity: 'Simple',
    badges: ['Payment Schedule', 'Extra Payments'],
  },
  {
    title: 'Compound Interest Calculator',
    description: 'Calculate compound growth with various compounding frequencies and additional contributions.',
    icon: LineChart,
    category: 'Investing',
    complexity: 'Simple',
    badges: ['Multiple Frequencies', 'Charts'],
  },
  {
    title: 'Debt Consolidation Calculator',
    description: 'Compare consolidating multiple debts into a single loan to analyze savings and payoff timeline.',
    icon: Banknote,
    category: 'Debt',
    complexity: 'Advanced',
    badges: ['Multiple Debts', 'Comparison', 'Savings Analysis'],
  },
  {
    title: 'Roth IRA Calculator',
    description: 'Project Roth IRA growth with contribution limits, tax-free withdrawals, and income phase-outs.',
    icon: Target,
    category: 'Retirement',
    complexity: 'Advanced',
    badges: ['Tax-Free Growth', 'Contribution Limits'],
  },
  {
    title: 'Personal Loan Calculator',
    description: 'Calculate monthly payments and total interest for personal loans with fixed or variable rates.',
    icon: DollarSign,
    category: 'Loans',
    complexity: 'Simple',
    badges: ['Fixed/Variable Rates', 'APR'],
  },
  {
    title: 'Student Loan Calculator',
    description: 'Estimate payments for federal and private student loans with various repayment plans and forgiveness options.',
    icon: Calculator,
    category: 'Debt',
    complexity: 'Advanced',
    badges: ['Repayment Plans', 'Forgiveness Options'],
  },
];

const categories = ['All', 'Investing', 'Debt', 'Loans', 'Retirement', 'Taxes'];
const complexityLevels = ['All', 'Simple', 'Advanced'];

export function CalculatorsPage({ initialCategory }: CalculatorsPageProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedComplexity, setSelectedComplexity] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
      );
    }
  };

  const toggleComplexity = (complexity: string) => {
    if (complexity === 'All') {
      setSelectedComplexity([]);
    } else {
      setSelectedComplexity((prev) =>
        prev.includes(complexity) ? prev.filter((c) => c !== complexity) : [...prev, complexity]
      );
    }
  };

  const filteredCalculators = allCalculators.filter((calc) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(calc.category);
    const complexityMatch =
      selectedComplexity.length === 0 || selectedComplexity.includes(calc.complexity);
    return categoryMatch && complexityMatch;
  });

  const sortedCalculators = [...filteredCalculators].sort((a, b) => {
    if (sortBy === 'popular') return 0; // Keep original order
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <Label className="mb-4 block text-base">Category</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={`cat-${category}`}
                checked={
                  category === 'All'
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

      {/* Complexity Filter */}
      <div>
        <Label className="mb-4 block text-base">Complexity</Label>
        <div className="space-y-3">
          {complexityLevels.map((complexity) => (
            <div key={complexity} className="flex items-center space-x-3">
              <Checkbox
                id={`comp-${complexity}`}
                checked={
                  complexity === 'All'
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

      {/* Clear Filters */}
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-foreground">All Calculators</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of financial calculators
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button & Sort */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 size-4" />
                    Filters
                    {(selectedCategories.length > 0 || selectedComplexity.length > 0) && (
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
                <Label className="text-sm text-muted-foreground">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
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

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedComplexity.length > 0) && (
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

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {sortedCalculators.length} of {allCalculators.length} calculators
              </p>
            </div>

            {/* Calculators Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedCalculators.map((calc) => (
                <CalculatorCard
                  key={calc.title}
                  title={calc.title}
                  description={calc.description}
                  icon={calc.icon}
                  badges={calc.badges}
                  onOpen={() => router.push(`/calculators/${nameToSlug(calc.title)}`)}
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
