import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { getFeed, getRecommendedPosts } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { POST_TYPES } from "@/lib/types";

export const metadata: Metadata = { title: "Cari Partner" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function FeedPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const me = await getSession();
  const page = Number(one(sp.page)) || 1;
  const type = one(sp.type);
  const q = one(sp.q);

  const [feed, recs, mySkills] = await Promise.all([
    getFeed({ type, q, page }),
    me ? getRecommendedPosts(me.id, 3) : Promise.resolve([]),
    me ? db("user_skills as us").join("skills as s", "s.id", "us.skill_id").where("us.user_id", me.id).pluck("s.name") : Promise.resolve([] as string[]),
  ]);

  const tabHref = (t: string) => (t ? `/feed?type=${t}${q ? `&q=${encodeURIComponent(q)}` : ""}` : `/feed${q ? `?q=${encodeURIComponent(q)}` : ""}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-navy-800">Cari partner</h1>
          <p className="mt-1 text-muted">Kebutuhan tim yang sedang dibuka. Temukan yang cocok dengan skill-mu.</p>
        </div>
        <Link href="/posts/new" className="btn btn-primary"><Plus className="size-4" /> Buat kebutuhan</Link>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {[{ value: "", label: "Semua" }, ...POST_TYPES].map((t) => (
              <Link key={t.value} href={tabHref(t.value)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${type === t.value ? "bg-navy-800 text-white" : "bg-white text-navy-800 ring-1 ring-line hover:bg-navy-50"}`}>{t.label}</Link>
            ))}
          </div>
          <form method="get" className="mb-5 flex gap-2">
            {type && <input type="hidden" name="type" value={type} />}
            <input name="q" defaultValue={q} className="input" placeholder="Cari judul atau deskripsi kebutuhan…" aria-label="Cari kebutuhan" />
            <button className="btn btn-navy">Cari</button>
          </form>

          {feed.posts.length ? (
            <div className="space-y-4">{feed.posts.map((p) => <PostCard key={p.id} p={p} mySkills={mySkills as string[]} />)}</div>
          ) : (
            <div className="card p-14 text-center text-muted">Belum ada kebutuhan yang cocok.</div>
          )}
          <Pagination page={feed.page} total={feed.total} pageSize={feed.pageSize} params={sp} basePath="/feed" />
        </section>

        <aside className="space-y-5">
          {me ? (
            recs.length > 0 && (
              <div className="card p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800"><Sparkles className="size-4 text-amber-500" /> Cocok untukmu</h2>
                <ul className="mt-3 space-y-3">
                  {recs.map((p) => (
                    <li key={p.id}>
                      <Link href={`/posts/${p.id}`} className="block rounded-xl p-3 ring-1 ring-line transition hover:bg-navy-50">
                        <p className="line-clamp-2 text-sm font-semibold text-navy-800">{p.title}</p>
                        <p className="mt-1 text-xs text-muted">{p.author.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ) : (
            <div className="card bg-navy-800 p-6 text-white">
              <h2 className="font-display text-xl font-semibold">Dapatkan rekomendasi</h2>
              <p className="mt-2 text-sm text-white/75">Daftar dan isi skill-mu agar kebutuhan yang cocok muncul otomatis.</p>
              <Link href="/register" className="btn btn-primary mt-4">Daftar gratis</Link>
            </div>
          )}
          <div className="card p-5 text-sm text-muted">
            <p className="font-display text-lg font-semibold text-navy-800">Tips</p>
            <p className="mt-1">Tulis kebutuhan sespesifik mungkin: skill, durasi, dan bentuk kolaborasi, agar talenta yang tepat cepat merespons.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
