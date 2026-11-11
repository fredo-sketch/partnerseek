import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarClock, Gift } from "lucide-react";
import Avatar from "@/components/Avatar";
import SkillBadge from "@/components/SkillBadge";
import ChallengeJoin from "@/components/ChallengeJoin";
import { getChallenge } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { formatDate, daysLeft } from "@/components/time";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = await getChallenge(Number((await params).id));
  return { title: c?.title ?? "Tantangan tidak ditemukan" };
}

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const me = await getSession();
  const c = await getChallenge(id, me?.id);
  if (!c) notFound();
  const dl = daysLeft(c.deadline);
  const canJoin = me ? me.role === "mahasiswa" : true;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/challenges" className="text-sm font-semibold text-navy-600 hover:underline">← Semua tantangan</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <article className="card p-6 sm:p-8">
          <span className="chip chip-amber">{c.category}</span>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy-800">{c.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {c.reward && <span className="inline-flex items-center gap-1.5"><Gift className="size-4" /> {c.reward}</span>}
            <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" /> {formatDate(c.deadline)}{dl !== null && dl > 0 ? ` (${dl} hari lagi)` : ""}</span>
          </div>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/90">{c.description}</p>
          <h2 className="mt-8 font-display text-lg font-semibold text-navy-800">Skill yang relevan</h2>
          <div className="mt-3 flex flex-wrap gap-2">{c.skills.map((s: { id: number; name: string }) => <SkillBadge key={s.id} name={s.name} />)}</div>

          <h2 className="mt-8 font-display text-lg font-semibold text-navy-800">Peserta ({c.entries.length})</h2>
          {c.entries.length === 0 ? <p className="mt-2 text-sm text-muted">Jadilah peserta pertama.</p> : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {c.entries.map((e: { id: number; name: string; username: string; prodi: string | null }) => (
                <li key={e.id}><Link href={`/u/${e.username}`} className="flex items-center gap-3 rounded-xl p-2 ring-1 ring-line transition hover:bg-navy-50"><Avatar name={e.name} size={36} /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-navy-800">{e.name}</span><span className="block truncate text-xs text-muted">{e.prodi}</span></span></Link></li>
              ))}
            </ul>
          )}
        </article>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Penyelenggara</p>
            <Link href={`/u/${c.organizer_username}`} className="mt-3 flex items-center gap-3">
              <Avatar name={c.organizer_name} size={48} />
              <p className="flex items-center gap-1 font-display text-lg font-semibold text-navy-800">{c.organizer_name}{c.organizer_verified ? <BadgeCheck className="size-4 text-amber-500" /> : null}</p>
            </Link>
          </div>
          <div className="card p-5">
            {c.status !== "open" ? <p className="text-sm text-muted">Tantangan ini sudah ditutup.</p> : canJoin ? <ChallengeJoin challengeId={c.id} joined={c.joined} loggedIn={!!me} /> : <p className="text-sm text-muted">Tantangan terbuka untuk akun mahasiswa.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
