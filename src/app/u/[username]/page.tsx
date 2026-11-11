import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, Briefcase, ExternalLink, GraduationCap, MapPin, MessageCircle, Pencil, Phone } from "lucide-react";
import Avatar from "@/components/Avatar";
import EndorseButton from "@/components/EndorseButton";
import ViewTracker from "@/components/ViewTracker";
import { getProfile } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { startConversationAction } from "@/lib/actions";
import { INTEREST_LABEL, LEVEL_LABEL } from "@/lib/types";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const u = await db("users").where({ username }).first("name", "headline");
  return { title: u ? `${u.name}` : "Profil tidak ditemukan", description: u?.headline ?? undefined };
}

const EXP_ICON = { pendidikan: GraduationCap, pengalaman: Briefcase, prestasi: Award } as const;
const EXP_LABEL = { pendidikan: "Pendidikan", pengalaman: "Pengalaman", prestasi: "Prestasi" } as const;

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const me = await getSession();
  const profile = await getProfile(username, me?.id);
  if (!profile) notFound();
  const { user: u, skills, interests, experiences, portfolio, posts } = profile;
  const mine = me?.id === u.id;
  const isStudent = u.role === "mahasiswa";

  let challenges: { id: number; title: string; reward: string | null }[] = [];
  if (!isStudent) challenges = await db("challenges").where({ organizer_id: u.id, status: "open" }).select("id", "title", "reward");

  const wa = u.whatsapp ? `https://wa.me/${u.whatsapp}?text=${encodeURIComponent(`Halo ${u.name.split(" ")[0]}, aku menemukan profilmu di PartnerSeek dan tertarik berkolaborasi.`)}` : null;
  const roleLabel = u.role === "umkm" ? "UMKM / Startup" : u.role === "organisasi" ? "Organisasi kampus" : "Mahasiswa";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <ViewTracker event="view_talent" params={{ username: u.username }} />

      <header className="card overflow-hidden">
        <div className="relative h-36 bg-navy-800 sm:h-44">
          <div className="grid-bg absolute inset-0" />
          <div className="absolute -right-8 -top-8 size-44 rounded-full bg-amber-500/40 blur-2xl" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <Avatar name={u.name} size={96} className="relative z-10 !ring-4" />
            <div className="flex flex-wrap gap-2">
              {mine ? (
                <Link href="/settings/profile" className="btn btn-navy"><Pencil className="size-4" /> Edit profil</Link>
              ) : (
                <>
                  <form action={startConversationAction.bind(null, u.username, undefined)}>
                    <button className="btn btn-primary"><MessageCircle className="size-4" /> Kirim pesan</button>
                  </form>
                  {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Phone className="size-4" /> WhatsApp</a>}
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h1 className="flex flex-wrap items-center gap-2 font-display text-3xl font-semibold text-navy-800">
              {u.name}
              {u.is_verified && <span className="chip chip-amber"><BadgeCheck className="size-3.5" /> Terverifikasi</span>}
            </h1>
            {u.headline && <p className="mt-1 text-lg text-ink/80">{u.headline}</p>}
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="chip">{roleLabel}</span>
              {(u.prodi || u.university) && <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-4" />{[u.prodi, u.university].filter(Boolean).join(" · ")}</span>}
              {u.location && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{u.location}</span>}
            </p>
            {u.open_to_collab && <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><span className="size-2 rounded-full bg-emerald-500" /> Terbuka untuk kolaborasi</p>}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {u.bio && (
            <section className="card p-6"><h2 className="font-display text-xl font-semibold text-navy-800">Tentang</h2><p className="mt-2 whitespace-pre-line leading-relaxed text-ink/85">{u.bio}</p></section>
          )}

          {isStudent && (
            <section className="card p-6">
              <h2 className="font-display text-xl font-semibold text-navy-800">Keahlian</h2>
              {skills.length === 0 ? <p className="mt-2 text-sm text-muted">Belum ada skill.</p> : (
                <ul className="mt-4 divide-y divide-line">
                  {skills.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-navy-800">{s.name}</p>
                        <p className="text-xs text-muted">{s.category} · {LEVEL_LABEL[s.level]}</p>
                      </div>
                      <EndorseButton userId={u.id} skillId={s.id} username={u.username} count={s.endorsements} mine={s.endorsedByMe} canEndorse={!mine} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {isStudent && portfolio.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold text-navy-800">Portofolio</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {portfolio.map((p) => (
                  <article key={p.id} className="card card-hover overflow-hidden">
                    <div className="relative h-28" style={{ background: `linear-gradient(135deg, hsl(${p.hue} 70% 45%), hsl(${(p.hue + 50) % 360} 70% 30%))` }}>
                      <div className="grid-bg absolute inset-0 opacity-60" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-semibold text-navy-800">{p.title}</h3>
                      {p.description && <p className="mt-1 line-clamp-3 text-sm text-muted">{p.description}</p>}
                      {p.tags && <div className="mt-3 flex flex-wrap gap-1.5">{String(p.tags).split(",").map((t: string) => <span key={t} className="chip">{t.trim()}</span>)}</div>}
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-600 hover:underline">Lihat karya <ExternalLink className="size-3.5" /></a>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="card p-6">
              <h2 className="font-display text-xl font-semibold text-navy-800">Riwayat</h2>
              <ol className="mt-4 space-y-5 border-l-2 border-amber-300 pl-5">
                {experiences.map((e) => {
                  const Icon = EXP_ICON[e.type as keyof typeof EXP_ICON];
                  return (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full bg-navy-800 text-amber-400"><Icon className="size-3.5" /></span>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600">{EXP_LABEL[e.type as keyof typeof EXP_LABEL]}</p>
                      <p className="font-semibold text-navy-800">{e.title}</p>
                      <p className="text-sm text-muted">{[e.organization, e.start_year ? `${e.start_year}${e.end_year ? ` – ${e.end_year}` : " – sekarang"}` : null].filter(Boolean).join(" · ")}</p>
                      {e.description && <p className="mt-1 text-sm text-ink/80">{e.description}</p>}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {!isStudent && challenges.length > 0 && (
            <section className="card p-6">
              <h2 className="font-display text-xl font-semibold text-navy-800">Tantangan dibuka</h2>
              <ul className="mt-3 space-y-2">
                {challenges.map((c) => (
                  <li key={c.id}><Link href={`/challenges/${c.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-navy-50/60 p-3 transition hover:bg-amber-100"><span className="font-semibold text-navy-800">{c.title}</span><span className="text-xs text-muted">{c.reward}</span></Link></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {interests.length > 0 && (
            <section className="card p-5">
              <h2 className="font-display text-lg font-semibold text-navy-800">Minat kolaborasi</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">{interests.map((i) => <span key={i} className="chip chip-amber">{INTEREST_LABEL[i] ?? i}</span>)}</div>
            </section>
          )}
          {posts.length > 0 && (
            <section className="card p-5">
              <h2 className="font-display text-lg font-semibold text-navy-800">Sedang mencari</h2>
              <ul className="mt-3 space-y-2">
                {posts.map((p) => (
                  <li key={p.id}><Link href={`/posts/${p.id}`} className="block rounded-xl p-3 text-sm font-semibold text-navy-800 ring-1 ring-line transition hover:bg-navy-50">{p.title}</Link></li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
