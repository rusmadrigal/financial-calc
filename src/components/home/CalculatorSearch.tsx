"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { LucideIcon } from "lucide-react";

const MAX_RESULTS = 8;
const TOP_CALCULATORS = 6;

export interface SearchCalculatorItem {
  name: string;
  slug: string;
  category: string;
  icon: LucideIcon;
}

interface CalculatorSearchProps {
  /** From central dataset (getCalculatorsList); same source as /calculators. */
  calculators: SearchCalculatorItem[];
  onSelect?: (slug: string) => void;
}

/** Wraps matching substring in <span> for highlight. Case-insensitive. */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const lower = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(lower);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-foreground">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CalculatorSearch({ calculators, onSelect }: CalculatorSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return calculators.slice(0, TOP_CALCULATORS);
    return calculators
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      )
      .slice(0, MAX_RESULTS);
  }, [calculators, query]);

  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [filtered.length, query]);

  useEffect(() => {
    if (!open) setSelectedIndex(0);
  }, [open]);

  const handleSelect = useCallback(
    (slug: string) => {
      setQuery("");
      setOpen(false);
      router.push(`/calculators/${slug}`);
      onSelect?.(slug);
    },
    [onSelect, router],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
        e.preventDefault();
        return;
      }
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i < filtered.length - 1 ? i + 1 : i));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : 0));
        return;
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].slug);
      }
    },
    [open, filtered, selectedIndex, handleSelect],
  );

  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  // Click outside: close dropdown when pointer down happens outside container
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler, true);
    return () => document.removeEventListener("pointerdown", handler, true);
  }, []);

  // Escape: close dropdown and clear query
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input wrapper — glow/pulse only on focus */}
      <div
        className={cn(
          "relative rounded-xl border border-input bg-card shadow-sm transition-all duration-150",
          "focus-within:ring-2 focus-within:ring-primary/40 focus-within:shadow-[0_0_0_6px_rgba(56,189,248,0.08)]",
          "focus-within:animate-pulse",
        )}
      >
        <Search
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search calculators..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          className="h-14 rounded-xl border-0 bg-transparent pl-12 pr-4 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="calculator-search-list"
          aria-activedescendant={
            open && filtered[selectedIndex]
              ? `search-item-${selectedIndex}`
              : undefined
          }
          id="hero-search-input"
        />
      </div>

      {/* Dropdown — absolute, no Radix */}
      {open && (
        <div
          id="calculator-search-list"
          role="listbox"
          ref={listRef}
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-2",
            "max-h-[300px] overflow-auto p-2",
            "rounded-2xl border border-border/60 bg-background/70 shadow-2xl backdrop-blur-md",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-8 px-4 text-center">
              <p className="text-sm font-medium text-foreground">No results</p>
              <p className="text-xs text-muted-foreground">
                Try: mortgage, 401k, retirement, loan
              </p>
            </div>
          ) : (
            filtered.map((calc, index) => {
              const Icon = calc.icon;
              const selected = index === selectedIndex;
              return (
                <button
                  key={calc.slug}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  id={`search-item-${index}`}
                  role="option"
                  aria-selected={selected}
                  type="button"
                  onClick={() => handleSelect(calc.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-100",
                    "hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                    selected && "bg-muted ring-1 ring-border/60",
                  )}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/60 p-1">
                    <Icon className="size-4 text-foreground/80" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium leading-tight text-foreground">
                      <HighlightMatch text={calc.name} query={query} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {calc.category}
                    </p>
                  </div>
                </button>
              );
            })
          )}
          {filtered.length > 0 && (
            <div className="mt-2 border-t border-border/60 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-full justify-center text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  router.push("/calculators");
                }}
              >
                View all calculators
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Hint when closed */}
      {!open && calculators.length > 0 && (
        <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 sm:block">
          <p className="text-xs text-muted-foreground">
            Try: <span className="font-medium">mortgage</span>,{" "}
            <span className="font-medium">401k</span>,{" "}
            <span className="font-medium">retirement</span>
          </p>
        </div>
      )}
    </div>
  );
}
