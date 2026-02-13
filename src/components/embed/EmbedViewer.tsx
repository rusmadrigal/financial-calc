"use client";

import { useMemo } from "react";
import { getCalculatorBySlug } from "@/lib/calculators/calculatorDataset";
import { CalculatorSlot } from "@/components/calculators/registry/calculatorRegistry";
import Link from "next/link";

export interface EmbedViewerProps {
  /** Calculator slug (e.g. mortgage-calculator). */
  slug: string;
  /** light | dark | auto */
  theme?: string;
  /** Show "Powered by SmartCalcLab" footer */
  branding?: boolean;
}

export function EmbedViewer({
  slug,
  theme = "light",
  branding = true,
}: EmbedViewerProps) {
  const entry = useMemo(() => getCalculatorBySlug(slug), [slug]);

  const isDark = theme === "dark";

  if (!entry) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/30 p-8 text-center">
        <p className="font-medium text-foreground">Calculator not found</p>
        <p className="text-sm text-muted-foreground">
          Slug &quot;{slug}&quot; is not available. Check the embed URL.
        </p>
      </div>
    );
  }

  return (
    <div
      className={isDark ? "dark min-h-screen bg-background" : "min-h-screen bg-background"}
    >
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            {entry.title}
          </h1>
          {entry.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.description}
            </p>
          )}
        </header>

        <section aria-label="Calculator">
          <CalculatorSlot calculatorType={entry.componentType} />
        </section>

        {branding && (
          <footer className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by{" "}
              <Link
                href="https://smartcalclab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                SmartCalcLab
              </Link>
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
