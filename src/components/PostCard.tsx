import Link from "next/link";
import { BadgeCheck, CalendarClock, Users } from "lucide-react";
import Avatar from "./Avatar";
import SkillBadge from "./SkillBadge";
import { POST_TYPES } from "@/lib/types";
import type { PostRow } from "@/lib/data";
import { daysLeft, timeAgo } from "./time";

export default function PostCard({ p, mySkills = [] }: { p: PostRow; mySkills?: string[] }) {
  const typeLabel = POST_TYPES.find((t) => t.value === p.type)?.label ?? p.type;
  const dl = daysLeft(p.deadline);
  return (
    <article className="card card-hover p-5">
      <div className="flex items-start gap-3">
        <Link href={`/u/${p.author.username}`} aria-label={p.author.name}>
          <Avatar name={p.author.name} size={46} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-sm">
            <Link href={`/u/${p.author.username}`} className="font-semibold text-navy-800 hover:underline">
              {p.author.name}
            </Link>
            {p.author.is_verified && <BadgeCheck className="size-4 text-amber-500" aria-label="Terverifikasi" />}
            <span className="text-muted">· {timeAgo(p.created_at)}</span>
          </div>
          <p className="truncate text-xs text-muted">{[p.author.prodi, p.author.university].filter(Boolean).join(" · ")}</p>
        </div>
        <span className="chip chip-amber shrink-0">{typeLabel}</span>
      </div>

      <Link href={`/posts/${p.id}`} className="mt-3 block">
        <h3 className="font-display text-xl font-semibold leading-snug text-navy-800 hover:text-navy-600">{p.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{p.description}</p>
      </Link>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.skills.map((s) => (
          <SkillBadge key={s.id} name={s.name} highlight={mySkills.includes(s.name)} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" /> {p.slots} orang dicari</span>
          {dl !== null && (
            <span className={`inline-flex items-center gap-1.5 ${dl <= 7 ? "font-semibold text-amber-600" : ""}`}>
              <CalendarClock className="size-3.5" /> {dl > 0 ? `${dl} hari lagi` : "Berakhir"}
            </span>
          )}
        </div>
        <Link href={`/posts/${p.id}`} className="btn btn-ghost !px-4 !py-1.5 text-xs">Lihat detail</Link>
      </div>
    </article>
  );
}
