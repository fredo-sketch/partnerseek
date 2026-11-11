import Link from "next/link";
import { BadgeCheck, GraduationCap } from "lucide-react";
import Avatar from "./Avatar";
import SkillBadge from "./SkillBadge";
import type { UserCard } from "@/lib/types";

export default function TalentCard({ u, highlightSkills = [] }: { u: UserCard; highlightSkills?: string[] }) {
  const shown = u.skills.slice(0, 4);
  return (
    <Link href={`/u/${u.username}`} className="card card-hover group flex h-full flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <Avatar name={u.name} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-lg font-semibold text-navy-800 group-hover:text-navy-600">{u.name}</h3>
            {u.is_verified && <BadgeCheck className="size-4 shrink-0 text-amber-500" aria-label="Terverifikasi" />}
          </div>
          <p className="line-clamp-2 text-sm text-muted">{u.headline}</p>
        </div>
        {u.match !== undefined && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-600">{u.match}% cocok</span>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <GraduationCap className="size-3.5" />
        <span className="truncate">{[u.prodi, u.university].filter(Boolean).join(" · ")}</span>
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {shown.map((s) => (
          <SkillBadge key={s.id} name={s.name} level={s.level} highlight={highlightSkills.includes(s.name)} />
        ))}
        {u.skills.length > shown.length && <span className="chip">+{u.skills.length - shown.length}</span>}
      </div>
      {u.open_to_collab && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <span className="size-2 rounded-full bg-emerald-500" /> Terbuka untuk kolaborasi
        </span>
      )}
    </Link>
  );
}
