"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/track";

type Props = ComponentProps<typeof Link> & { event: string; eventParams?: Record<string, string> };

/** Link biasa yang juga mengirim event tracking saat diklik. */
export default function TrackedLink({ event, eventParams, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
