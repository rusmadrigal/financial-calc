import { useState, useRef, useEffect } from "react";
import {
  Search,
  Calculator,
  TrendingUp,
  Home,
  CreditCard,
  PiggyBank,
  Clock,
} from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface SearchBarProps {
  onSelect?: (calculator: string) => void;
}

const popularCalculators = [
  { name: "Mortgage Calculator", icon: Home, category: "Loans" },
  { name: "401(k) Calculator", icon: PiggyBank, category: "Retirement" },
  {
    name: "Investment Return Calculator",
    icon: TrendingUp,
    category: "Investing",
  },
  { name: "Credit Card Payoff Calculator", icon: CreditCard, category: "Debt" },
  { name: "Loan Amortization Calculator", icon: Calculator, category: "Loans" },
  {
    name: "Retirement Savings Calculator",
    icon: Clock,
    category: "Retirement",
  },
  {
    name: "Compound Interest Calculator",
    icon: TrendingUp,
    category: "Investing",
  },
  { name: "Debt Consolidation Calculator", icon: CreditCard, category: "Debt" },
];

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredResults, setFilteredResults] = useState(popularCalculators);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredResults(popularCalculators);
    } else {
      const filtered = popularCalculators.filter(
        (calc) =>
          calc.name.toLowerCase().includes(query.toLowerCase()) ||
          calc.category.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredResults(filtered);
    }
  }, [query]);

  const handleSelect = (calculatorName: string) => {
    setQuery("");
    setIsFocused(false);
    onSelect?.(calculatorName);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search calculators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="h-14 rounded-xl border-2 bg-card pl-12 pr-4 text-base shadow-sm transition-all focus:border-accent focus:shadow-md"
        />
        {!isFocused && !query && (
          <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 sm:block">
            <p className="text-xs text-muted-foreground">
              Try: <span className="font-medium">mortgage</span>,{" "}
              <span className="font-medium">401k</span>,{" "}
              <span className="font-medium">debt payoff</span>
            </p>
          </div>
        )}
      </div>

      {/* Helper text for mobile */}
      {!isFocused && !query && (
        <p className="mt-2 text-center text-xs text-muted-foreground sm:hidden">
          Try: <span className="font-medium">mortgage</span>,{" "}
          <span className="font-medium">401k</span>,{" "}
          <span className="font-medium">debt payoff</span>
        </p>
      )}

      {/* Dropdown Results */}
      {isFocused && (
        <Card className="absolute z-50 mt-2 w-full overflow-hidden border-2 shadow-lg">
          <div className="max-h-[400px] overflow-y-auto">
            {filteredResults.length > 0 ? (
              <div className="p-2">
                {query.trim() === "" && (
                  <div className="px-4 pb-2 pt-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      POPULAR CALCULATORS
                    </p>
                  </div>
                )}
                {filteredResults.map((calc, index) => {
                  const Icon = calc.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(calc.name)}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent/10 focus:bg-accent/10 focus:outline-none"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">
                          {calc.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {calc.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No calculators found for "{query}"
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
