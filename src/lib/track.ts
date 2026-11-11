"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_STANDARD: Record<string, string> = {
  sign_up: "CompleteRegistration",
  waitlist_signup: "Lead",
  klik_daftar: "InitiateCheckout",
  form_submitted: "SubmitApplication",
  view_talent: "ViewContent",
};

function utm(): Params {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith("ps_utm="));
    if (!raw) return {};
    return JSON.parse(decodeURIComponent(raw.split("=")[1]));
  } catch {
    return {};
  }
}

/** Kirim event ke GTM (dataLayer), GA4 (gtag), dan Meta Pixel sekaligus. Aman jika ID belum diisi. */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...utm(), ...params };
  try {
    window.dataLayer?.push({ event, ...payload });
    window.gtag?.("event", event, payload);
    if (window.fbq) {
      const std = META_STANDARD[event];
      if (std) window.fbq("track", std, payload);
      else window.fbq("trackCustom", event, payload);
    }
  } catch {
    /* tracking tidak boleh merusak UI */
  }
}
