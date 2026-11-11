"use client";

import { useState } from "react";
import type { SkillChip, SkillLevel } from "@/lib/types";
import { LEVEL_LABEL } from "@/lib/types";

const LEVELS: SkillLevel[] = ["pemula", "menengah", "mahir"];

export default function SkillEditor({ all, initial }: { all: SkillChip[]; initial: Record<number, SkillLevel> }) {
  const [sel, setSel] = useState<Record<number, SkillLevel>>(initial);
  const groups = new Map<string, SkillChip[]>();
  for (const s of all) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);

  const toggle = (id: number) =>
    setSel((p) => {
      const n = { ...p };
      if (n[id]) delete n[id];
      else n[id] = "menengah";
      return n;
    });

  const chosen = all.filter((s) => sel[s.id]);

  return (
    <div className="space-y-4">
      {[...groups].map(([cat, list]) => (
        <div key={cat}>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{cat}</p>
          <div className="flex flex-wrap gap-1.5">
            {list.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => toggle(s.id)}
                aria-pressed={!!sel[s.id]}
                className={`chip cursor-pointer transition ${sel[s.id] ? "!bg-navy-800 !text-white !ring-navy-800" : "bg-white hover:bg-navy-50"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {chosen.length > 0 && (
        <div className="rounded-2xl bg-navy-50/70 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-800">Atur level ({chosen.length}/15)</p>
          <ul className="space-y-2">
            {chosen.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-navy-800">{s.name}</span>
                <span role="radiogroup" aria-label={`Level ${s.name}`} className="inline-flex rounded-full bg-white p-0.5 ring-1 ring-line">
                  {LEVELS.map((lv) => (
                    <button
                      type="button"
                      key={lv}
                      role="radio"
                      aria-checked={sel[s.id] === lv}
                      onClick={() => setSel((p) => ({ ...p, [s.id]: lv }))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${sel[s.id] === lv ? "bg-amber-500 text-navy-900" : "text-muted hover:text-navy-800"}`}
                    >
                      {LEVEL_LABEL[lv]}
                    </button>
                  ))}
                </span>
                <input type="hidden" name="skill" value={`${s.id}:${sel[s.id]}`} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
