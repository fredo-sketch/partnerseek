import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Crown, Flame, Gift, Swords, ThumbsUp, Trophy, Users } from "lucide-react";
import SkillBadge from "@/components/SkillBadge";
import Avatar from "@/components/Avatar";
import { battleIsLive, getBattleLeaderboard, getBattles, type BattleListItem } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { daysLeft, formatDate } from "@/components/time";

export const metadata: Metadata = { title: "Weekly Battle" };
export const dynamic = "force-dynamic";

function LiveCard({ b }: { b: BattleListItem }) {
  const dl = Math.max(0, (daysLeft(b.ends_at) ?? 0) + 1);
  return (
    <Link href={`/battles/${b.id}`} className="card card-hover flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="chip chip-amber">{b.category}</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600"><Flame className="size-3.5" /> {dl} hari lagi</span>
      </div>
      <h2 className="font-display text-xl font-semibold leading-snug text-navy-800">{b.title}</h2>
      <p className="line-clamp-2 text-sm text-muted">{b.brief}</p>
      <div className="flex flex-wrap gap-1.5">{b.skills.map((s) => <SkillBadge key={s.id} name={s.name} />)}</div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5 font-semibold text-navy-800">{b.host_name}{b.host_verified ? <BadgeCheck className="size-4 text-amber-500" /> : null}</span>
        <span className="inline-flex items-center gap-3">
          {b.prize && <span className="inline-flex items-center gap-1"><Gift className="size-3.5" /> {b.prize}</span>}
          <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {b.entries}</span>
          <span className="inline-flex items-center gap-1"><ThumbsUp className="size-3.5" /> {b.votes}</span>
        </span>
      </div>
    </Link>
  );
}

export default async function BattlesPage() {
  const [all, me, leaders] = await Promise.all([getBattles(), getSession(), getBattleLeaderboard(5)]);
  const live = all.filter(battleIsLive).sort((a, b) => +new Date(a.ends_at) - +new Date(b.ends_at));
  const past = all.filter((b) => !battleIsLive(b));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-navy-800 p-8 text-white sm:p-12">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-amber-500/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="chip chip-amber"><Swords className="size-3.5" /> Weekly Battle</span>
          <h1 className="mt-3 font-display text-4xl font-semibold">Satu brief, satu pekan, satu juara</h1>
          <p className="mt-3 text-white/75">Perusahaan mitra membuka battle mingguan. Kirim karya terbaikmu, kumpulkan dukungan komunitas, dan menangkan hadiah serta perhatian dari mitra.</p>
          {me && me.role !== "mahasiswa" && <Link href="/battles/new" className="btn btn-primary mt-5">Buka battle baru</Link>}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section>
          <h2 className="font-display text-2xl font-semibold text-navy-800">Sedang berlangsung</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {live.map((b) => <LiveCard key={b.id} b={b} />)}
            {live.length === 0 && <p className="card col-span-full p-12 text-center text-muted">Belum ada battle yang berlangsung pekan ini.</p>}
          </div>

          <h2 className="mt-10 font-display text-2xl font-semibold text-navy-800">Battle sebelumnya</h2>
          <ul className="mt-4 space-y-3">
            {past.map((b) => (
              <li key={b.id}>
                <Link href={`/battles/${b.id}`} className="card card-hover flex flex-wrap items-center justify-between gap-3 p-5">
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-semibold leading-snug text-navy-800">{b.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{b.host_name} · selesai {formatDate(b.ends_at)} · {b.entries} karya</span>
                  </span>
                  {b.winner_name ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600"><Trophy className="size-4" /> {b.winner_name}</span> : <span className="text-xs text-muted">Belum ada juara</span>}
                </Link>
              </li>
            ))}
            {past.length === 0 && <p className="card p-8 text-center text-muted">Belum ada battle yang selesai.</p>}
          </ul>
        </section>

        <aside>
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800"><Crown className="size-5 text-amber-500" /> Papan peringkat</h2>
            <p className="mt-1 text-xs text-muted">Urut juara terbanyak, lalu total dukungan.</p>
            <ol className="mt-4 space-y-2">
              {leaders.map((l, i) => (
                <li key={l.id}>
                  <Link href={`/u/${l.username}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-navy-50">
                    <span className="w-5 text-center font-display font-semibold text-navy-800">{i + 1}</span>
                    <Avatar name={l.name} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy-800">{l.name}</span>
                      <span className="block truncate text-xs text-muted">{l.wins} juara · {l.votes} dukungan</span>
                    </span>
                  </Link>
                </li>
              ))}
              {leaders.length === 0 && <li className="text-sm text-muted">Belum ada peserta.</li>}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
