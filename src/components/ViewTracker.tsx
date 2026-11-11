"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export default function ViewTracker({ event, params }: { event: string; params?: Record<string, string> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
