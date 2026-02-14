"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsentValue,
} from "@/lib/helpers/storage/cookieConsent";

const DELAY_MS = 700;

export function CookiePrivacyNotice() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pathname === "/embed") return;
    const consent = getCookieConsent();
    if (consent !== null) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [mounted, pathname]);

  const handleChoice = (value: CookieConsentValue) => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      role="dialog"
      aria-labelledby="cookie-notice-title"
      aria-describedby="cookie-notice-desc"
      className="cookie-privacy-notice fixed z-[100] md:left-4 md:bottom-8 md:top-auto md:w-[320px] md:max-w-[calc(100vw-2rem)] left-0 right-0 bottom-0 md:rounded-xl rounded-t-xl border border-border bg-card text-card-foreground shadow-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h2
          id="cookie-notice-title"
          className="text-sm font-semibold text-foreground"
        >
          Privacy &amp; Cookies
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 -mr-2 -mt-1 h-8 w-8 rounded-md"
          onClick={() => handleChoice("rejected")}
          aria-label="Dismiss and reject cookies"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      <p
        id="cookie-notice-desc"
        className="text-sm text-muted-foreground leading-snug"
      >
        We use cookies to improve site experience and analyze traffic. By using
        this site, you agree to our use of cookies.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="order-1"
          onClick={() => handleChoice("accepted")}
        >
          Accept
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="order-2"
          onClick={() => handleChoice("rejected")}
        >
          Reject
        </Button>
        <Link
          href="/privacy"
          className="order-3 text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1.5 -ml-2"
        >
          Privacy Policy
        </Link>
      </div>
    </section>
  );
}
