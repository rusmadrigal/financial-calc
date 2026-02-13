"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calculator, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface NavigationProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const navItems = [
  { label: "Calculators", href: "/calculators" },
  { label: "About", href: "/about" },
];

/**
 * Determines if a nav link is active for the current pathname.
 * - Calculators: active on /calculators and /calculators/[slug]
 * - Others: exact match (e.g. /about, /overview, /design-system)
 */
function isActiveLink(pathname: string, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href === "/calculators")
    return pathname === "/calculators" || pathname.startsWith("/calculators/");
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navigation({ isDarkMode, toggleDarkMode }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label="SmartCalcLab home"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Calculator className="size-5 text-primary-foreground" aria-hidden />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              SmartCalcLab
            </span>
          </Link>

          {/* Desktop: Nav links + hover/active underline */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActiveLink(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative inline-flex items-center px-3 py-2 text-sm transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md ${
                    active
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {/* Underline: hover (subtle) or active (strong) */}
                  <span
                    aria-hidden
                    className={`absolute left-0 -bottom-1 h-[2px] w-full rounded-full transition-all duration-200 ease-out origin-left ${
                      active
                        ? "scale-x-100 opacity-100 bg-primary"
                        : "scale-x-0 opacity-0 bg-primary/70 group-hover:scale-x-100 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop: Theme + CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="size-9 shrink-0"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="size-4" aria-hidden />
              ) : (
                <Moon className="size-4" aria-hidden />
              )}
            </Button>
            <Link href="/embed">
              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0"
              >
                Embed a Calculator
              </Button>
            </Link>
            <Link href="/calculators">
              <Button size="sm" className="h-9 shrink-0">
                Open Calculators
              </Button>
            </Link>
          </div>

          {/* Mobile: Hamburger only; rest inside Sheet */}
          <div className="flex items-center gap-1 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  aria-label="Open menu"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-nav-sheet"
                >
                  {mobileMenuOpen ? (
                    <X className="size-5" aria-hidden />
                  ) : (
                    <Menu className="size-5" aria-hidden />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                id="mobile-nav-sheet"
                side="right"
                className="flex w-[300px] flex-col gap-0 border-l border-border bg-background sm:max-w-[320px]"
                aria-label="Mobile menu"
              >
                <div className="flex flex-col gap-1 pt-12">
                  {navItems.map((item) => {
                    const active = isActiveLink(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-lg px-4 py-3 text-left text-base font-medium transition-colors duration-150 ${
                          active
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toggleDarkMode();
                    }}
                    className="justify-start gap-2 px-4 py-3 h-auto text-base font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDarkMode ? (
                      <Sun className="size-4 shrink-0" aria-hidden />
                    ) : (
                      <Moon className="size-4 shrink-0" aria-hidden />
                    )}
                    {isDarkMode ? "Light mode" : "Dark mode"}
                  </Button>
                  <Link href="/embed" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 px-4 py-3 h-auto text-base font-medium"
                    >
                      Embed a Calculator
                    </Button>
                  </Link>
                  <Link href="/calculators" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start gap-2 px-4 py-3 h-auto text-base font-medium">
                      Open Calculators
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
