"use client";

import { useOptimistic, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleEndorseAction } from "@/lib/actions";

export default function EndorseButton({ userId, skillId, username, count, mine, canEndorse }: { userId: number; skillId: number; username: string; count: number; mine: boolean; canEndorse: boolean }) {
  const [, start] = useTransition();
  const [opt, setOpt] = useOptimistic({ count, mine }, (s: { count: number; mine: boolean }, next: boolean) => ({ count: s.count + (next ? 1 : -1), mine: next }));

  if (!canEndorse)
    return <span className="inline-flex items-center gap-1 text-xs text-muted"><ThumbsUp className="size-3.5" /> {count}</span>;

  return (
    <button
      type="button"
      onClick={() => start(async () => { setOpt(!opt.mine); await toggleEndorseAction(userId, skillId, username); })}
      aria-pressed={opt.mine}
      aria-label={opt.mine ? "Batalkan endorse" : "Endorse skill ini"}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${opt.mine ? "bg-amber-500 text-navy-900" : "bg-white text-navy-800 ring-1 ring-line hover:bg-amber-100"}`}
    >
      <ThumbsUp className="size-3.5" /> {opt.count}
    </button>
  );
}
