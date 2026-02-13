"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { Toaster } from "./ui/sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a fixed value until mounted so server and initial client render the same (avoids hydration mismatch).
  const isDarkMode = mounted ? resolvedTheme === "dark" : false;
  const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
