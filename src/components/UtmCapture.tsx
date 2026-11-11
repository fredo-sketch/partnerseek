"use client";

import { useEffect } from "react";

/** Menyimpan parameter UTM dari URL ke cookie 30 hari, agar ikut tercatat saat daftar/waitlist. */
export default function UtmCapture() {
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const source = p.get("utm_source");
      if (!source) return;
      const data = {
        utm_source: source,
        utm_medium: p.get("utm_medium") ?? "",
        utm_campaign: p.get("utm_campaign") ?? "",
      };
      document.cookie = `ps_utm=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    } catch {
      /* abaikan */
    }
  }, []);
  return null;
}
