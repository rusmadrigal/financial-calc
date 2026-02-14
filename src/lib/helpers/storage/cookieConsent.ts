/**
 * Cookie consent persistence. Only call from client (e.g. useEffect, event handlers).
 */

export const COOKIE_CONSENT_KEY = "scl_cookie_consent";

export type CookieConsentValue = "accepted" | "rejected";

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw === "accepted" || raw === "rejected") return raw;
    return null;
  } catch {
    return null;
  }
}

export function setCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // ignore
  }
}
