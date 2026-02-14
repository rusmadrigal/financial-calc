"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";

function ShellOrEmbedInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEmbedViewer =
    pathname === "/embed" &&
    typeof searchParams?.get("calc") === "string" &&
    searchParams.get("calc")?.trim() !== "";

  if (isEmbedViewer) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}

/**
 * Renders AppShell (nav + footer) unless we're on the embed viewer
 * (/embed?calc=...), in which case only the page content is shown (no chrome).
 */
export function ShellOrEmbed({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AppShell>{children}</AppShell>}>
      <ShellOrEmbedInner>{children}</ShellOrEmbedInner>
    </Suspense>
  );
}
