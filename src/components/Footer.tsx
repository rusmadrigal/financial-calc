"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";
import { nameToSlug } from "@/lib/slugs";

const popularCalculators = [
  "Mortgage Calculator",
  "401(k) Calculator",
  "Credit Card Payoff",
  "Investment Return",
  "Loan Calculator",
  "Retirement Savings",
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Calculator className="size-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-foreground">
                SmartCalcLab
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Professional financial calculators for smarter money decisions.
              Free, transparent, and built for the US market.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Popular Calculators
            </h3>
            <ul className="space-y-3">
              {popularCalculators.map((calc) => (
                <li key={calc}>
                  <Link
                    href={`/calculators/${nameToSlug(calc)}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {calc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6">
          <h4 className="mb-2 text-sm font-semibold text-foreground">
            Important Disclaimer
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            All calculators and information provided on SmartCalcLab are for{" "}
            <strong>educational purposes only</strong> and should not be
            considered financial, investment, tax, or legal advice. Results are
            estimates based on the information you provide and may not reflect
            actual outcomes. Always consult with qualified professionals before
            making financial decisions. SmartCalcLab is not responsible for any
            decisions made based on calculator results.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} SmartCalcLab. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/overview"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Overview
            </Link>
            <Link
              href="/design-system"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Design System
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
