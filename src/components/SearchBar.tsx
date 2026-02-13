import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import type { LucideIcon } from "lucide-react";

export interface SearchCalculatorItem {
  name: string;
  slug: string;
  category: string;
  icon: LucideIcon;
}

interface SearchBarProps {
  /** Only calculators that exist (from central dataset). When empty, search shows no results. */
  calculators: SearchCalculatorItem[];
  /** Called with slug when user selects a calculator */
  onSelect?: (slug: string) => void;
}

export function SearchBar({ calculators, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredResults, setFilteredResults] = useState(calculators);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredResults(calculators);
  }, [calculators]);

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
      setFilteredResults(calculators);
    } else {
      const filtered = calculators.filter(
        (calc) =>
          calc.name.toLowerCase().includes(query.toLowerCase()) ||
          calc.category.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredResults(filtered);
    }
  }, [query, calculators]);

  const handleSelect = (slug: string) => {
    setQuery("");
    setIsFocused(false);
    onSelect?.(slug);
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
        {!isFocused && !query && calculators.length > 0 && (
          <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 sm:block">
            <p className="text-xs text-muted-foreground">
              Try: <span className="font-medium">mortgage</span>,{" "}
              <span className="font-medium">debt</span>,{" "}
              <span className="font-medium">loan</span>
            </p>
          </div>
        )}
      </div>

      {/* Helper text for mobile */}
      {!isFocused && !query && calculators.length > 0 && (
        <p className="mt-2 text-center text-xs text-muted-foreground sm:hidden">
          Try: <span className="font-medium">mortgage</span>,{" "}
          <span className="font-medium">debt</span>,{" "}
          <span className="font-medium">loan</span>
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
                      CALCULATORS
                    </p>
                  </div>
                )}
                {filteredResults.map((calc, index) => {
                  const Icon = calc.icon;
                  return (
                    <button
                      key={calc.slug}
                      onClick={() => handleSelect(calc.slug)}
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
                  No calculators found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
