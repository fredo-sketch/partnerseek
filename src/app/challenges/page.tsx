import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CalendarClock, Gift, Users } from "lucide-react";
import SkillBadge from "@/components/SkillBadge";
import { getChallenges } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { daysLeft } from "@/components/time";

export const metadata: Metadata = { title: "Tantangan UMKM & Organisasi" };
export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const [list, me] = await Promise.all([getChallenges(), getSession()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-navy-800 p-8 text-white sm:p-12">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-amber-500/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <h1 className="font-display text-4xl font-semibold">Tantangan nyata, peluang nyata</h1>
          <p className="mt-3 text-white/75">UMKM, startup, dan organisasi kampus membuka tantangan. Kirim karyamu, tunjukkan skill, dan raih hadiah, kontrak, atau magang.</p>
          {me && me.role !== "mahasiswa" && <Link href="/challenges/new" className="btn btn-primary mt-5">Buka tantangan baru</Link>}
        </div>
      </header>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {list.map((c) => {
          const dl = daysLeft(c.deadline);
          return (
            <Link key={c.id} href={`/challenges/${c.id}`} className="card card-hover flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="chip chip-amber">{c.category}</span>
                {dl !== null && <span className={`text-xs font-semibold ${dl <= 7 ? "text-amber-600" : "text-muted"}`}>{dl > 0 ? `${dl} hari lagi` : "Berakhir"}</span>}
              </div>
              <h2 className="font-display text-xl font-semibold leading-snug text-navy-800">{c.title}</h2>
              <p className="line-clamp-2 text-sm text-muted">{c.description}</p>
              <div className="flex flex-wrap gap-1.5">{c.skills.map((s) => <SkillBadge key={s.id} name={s.name} />)}</div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5 font-semibold text-navy-800">{c.organizer_name}{c.organizer_verified ? <BadgeCheck className="size-4 text-amber-500" /> : null}</span>
                <span className="inline-flex items-center gap-3">
                  {c.reward && <span className="inline-flex items-center gap-1"><Gift className="size-3.5" /> {c.reward}</span>}
                  <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {c.entries}</span>
                </span>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && <p className="card col-span-full p-14 text-center text-muted">Belum ada tantangan terbuka.</p>}
      </div>
      <p className="mt-8 flex items-center gap-2 text-sm text-muted"><CalendarClock className="size-4" /> Ingin membuka tantangan untuk bisnismu? <Link href="/register" className="font-semibold text-navy-800 underline">Daftar sebagai mitra</Link></p>
    </div>
  );
}
