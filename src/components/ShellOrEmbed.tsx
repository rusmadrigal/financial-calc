"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";

/**
 * Renders AppShell (nav + footer) unless we're on the embed viewer
 * (/embed?calc=...), in which case only the page content is shown (no chrome).
 */
export function ShellOrEmbed({ children }: { children: React.ReactNode }) {
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
