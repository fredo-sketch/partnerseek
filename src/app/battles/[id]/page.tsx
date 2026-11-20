import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarClock, ExternalLink, Gift, ThumbsUp, Trophy } from "lucide-react";
import Avatar from "@/components/Avatar";
import SkillBadge from "@/components/SkillBadge";
import BattleEntryForm from "@/components/BattleEntryForm";
import { battleIsLive, getBattle, type BattleEntry } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { pickBattleWinnerAction, voteBattleEntryAction } from "@/lib/actions";
import { formatDate, daysLeft } from "@/components/time";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const b = await getBattle(Number((await params).id));
  return { title: b?.title ?? "Battle tidak ditemukan" };
}

export default async function BattlePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const me = await getSession();
  const b = await getBattle(id, me?.id);
  if (!b) notFound();
  const live = battleIsLive(b);
  const dl = Math.max(0, (daysLeft(b.ends_at) ?? 0) + 1);
  const isHost = me?.id === b.host_id;
  const isStudent = me?.role === "mahasiswa";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/battles" className="text-sm font-semibold text-navy-600 hover:underline">← Semua battle</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <article className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-amber">{b.category}</span>
              <span className="chip">{live ? `${dl} hari lagi` : "Selesai"}</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy-800">{b.title}</h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              {b.prize && <span className="inline-flex items-center gap-1.5"><Gift className="size-4" /> {b.prize}</span>}
              <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" /> {formatDate(b.starts_at)} – {formatDate(b.ends_at)}</span>
            </div>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/90">{b.brief}</p>
            <div className="mt-5 flex flex-wrap gap-2">{b.skills.map((s: { id: number; name: string }) => <SkillBadge key={s.id} name={s.name} />)}</div>
          </article>

          <section>
            <h2 className="font-display text-xl font-semibold text-navy-800">Karya peserta ({b.entries.length})</h2>
            <p className="mt-1 text-sm text-muted">{live ? "Dukung karya favoritmu. Mitra memilih juara di akhir pekan." : "Pekan ini sudah berakhir."}</p>
            <ul className="mt-4 space-y-3">
              {b.entries.map((e: BattleEntry, i: number) => {
                const winner = b.winner_entry_id === e.id;
                return (
                  <li key={e.id} className={`card p-5 ${winner ? "ring-2 ring-amber-500" : ""}`}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-5 text-center font-display font-semibold text-navy-800">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-navy-800">{e.title}</h3>
                          {winner && <span className="chip chip-amber"><Trophy className="size-3.5" /> Juara</span>}
                        </div>
                        <Link href={`/u/${e.username}`} className="mt-1 inline-flex items-center gap-2 text-sm text-muted hover:text-navy-800">
                          <Avatar name={e.name} size={24} /> <span className="font-semibold">{e.name}</span>{e.prodi ? ` · ${e.prodi}` : ""}
                        </Link>
                        <p className="mt-2 text-sm leading-relaxed text-ink/90">{e.description}</p>
                        {e.link_url && <a href={e.link_url} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-navy-600 hover:underline"><ExternalLink className="size-3.5" /> Lihat karya</a>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {!me && live ? (
                          <Link href={`/login?next=/battles/${b.id}`} className="btn btn-ghost !px-3 !py-1.5 text-sm"><ThumbsUp className="size-4" /> {e.votes}</Link>
                        ) : live && me && e.user_id !== me.id ? (
                          <form action={voteBattleEntryAction.bind(null, e.id)}>
                            <button aria-pressed={e.voted} className={`btn !px-3 !py-1.5 text-sm ${e.voted ? "btn-primary" : "btn-ghost"}`}><ThumbsUp className="size-4" /> {e.votes}</button>
                          </form>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-muted"><ThumbsUp className="size-4" /> {e.votes}</span>
                        )}
                        {isHost && live && (
                          <form action={pickBattleWinnerAction.bind(null, b.id, e.id)}>
                            <button className="btn btn-primary !px-3 !py-1.5 text-sm"><Trophy className="size-4" /> Pilih juara</button>
                          </form>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
              {b.entries.length === 0 && <li className="card p-8 text-center text-muted">Belum ada karya. Jadilah yang pertama.</li>}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Dibuka oleh</p>
            <Link href={`/u/${b.host_username}`} className="mt-3 flex items-center gap-3">
              <Avatar name={b.host_name} size={48} />
              <p className="flex items-center gap-1 font-display text-lg font-semibold text-navy-800">{b.host_name}{b.host_verified ? <BadgeCheck className="size-4 text-amber-500" /> : null}</p>
            </Link>
          </div>
          <div className="card p-5">
            {!live ? <p className="text-sm text-muted">Battle ini sudah ditutup.</p>
              : isHost ? <p className="text-sm text-muted">Kamu pembuka battle ini. Pilih juara dari daftar karya setelah masa penilaian.</p>
              : me && !isStudent ? <p className="text-sm text-muted">Battle terbuka untuk akun mahasiswa.</p>
              : <BattleEntryForm battleId={b.id} loggedIn={!!me} current={b.myEntry} />}
          </div>
        </aside>
      </div>
    </div>
  );
}
