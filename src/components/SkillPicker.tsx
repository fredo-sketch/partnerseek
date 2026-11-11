import type { SkillChip } from "@/lib/types";

/** Daftar checkbox skill dikelompokkan per kategori (bekerja tanpa JS, untuk form GET/POST). */
export default function SkillPicker({ skills, selected = [], name = "skill", open = false }: { skills: SkillChip[]; selected?: number[]; name?: string; open?: boolean }) {
  const groups = new Map<string, SkillChip[]>();
  for (const s of skills) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);
  return (
    <div className="space-y-2">
      {[...groups].map(([cat, list], i) => (
        <details key={cat} open={open || list.some((s) => selected.includes(s.id)) || i === 0} className="rounded-xl bg-navy-50/60 p-3">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-navy-800">{cat}</summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {list.map((s) => (
              <label key={s.id} className="cursor-pointer">
                <input type="checkbox" name={name} value={s.id} defaultChecked={selected.includes(s.id)} className="peer sr-only" />
                <span className="chip cursor-pointer bg-white transition peer-checked:bg-navy-800 peer-checked:text-white peer-checked:ring-navy-800 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500">{s.name}</span>
              </label>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
