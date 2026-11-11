import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Circle, MessageCircle, Plus, Trophy, Users } from "lucide-react";
import PostCard from "@/components/PostCard";
import { requireUser } from "@/lib/auth";
import { getMyPosts, getProfile, getRecommendedPosts, countUnread } from "@/lib/data";
import { db } from "@/lib/db";
import { togglePostStatusAction } from "@/lib/actions";

export const metadata: Metadata = { title: "Dasbor" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const me = await requireUser("/dashboard");
  const [profile, myPosts, recs, unread, joined] = await Promise.all([
    getProfile(me.username, me.id),
    getMyPosts(me.id),
    getRecommendedPosts(me.id, 3),
    countUnread(me.id),
    db("challenge_entries").where({ user_id: me.id }).count({ n: "*" }).first(),
  ]);
  if (!profile) return null;
  const u = profile.user;
  const isStudent = u.role === "mahasiswa";

  const checks = [
    { ok: !!u.headline, label: "Tulis headline" },
    { ok: !!u.bio, label: "Isi bagian Tentang" },
    ...(isStudent ? [
      { ok: profile.skills.length >= 3, label: "Pilih minimal 3 skill" },
      { ok: profile.portfolio.length >= 1, label: "Tambahkan 1 karya portofolio" },
      { ok: profile.experiences.length >= 1, label: "Tambahkan riwayat / prestasi" },
    ] : []),
    { ok: !!u.whatsapp, label: "Tambahkan nomor WhatsApp" },
  ];
  const pct = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Dasbor</p>
          <h1 className="font-display text-4xl font-semibold text-navy-800">Halo, {u.name.split(" ")[0]} 👋</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/posts/new" className="btn btn-primary"><Plus className="size-4" /> Buat kebutuhan</Link>
          <Link href="/talent" className="btn btn-ghost">Cari talenta</Link>
        </div>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: "Kebutuhan aktif", value: myPosts.filter((p) => p.status === "open").length, href: "#kebutuhan" },
          { icon: MessageCircle, label: "Pesan belum dibaca", value: unread, href: "/messages" },
          { icon: Trophy, label: "Tantangan diikuti", value: Number(joined?.n ?? 0), href: "/challenges" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover flex items-center gap-4 p-5">
            <span className="grid size-12 place-items-center rounded-2xl bg-navy-800 text-amber-400"><s.icon className="size-6" /></span>
            <span><span className="block font-display text-3xl font-semibold text-navy-800">{s.value}</span><span className="text-sm text-muted">{s.label}</span></span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section id="kebutuhan">
            <h2 className="mb-3 font-display text-2xl font-semibold text-navy-800">Kebutuhan saya</h2>
            {myPosts.length === 0 ? (
              <div className="card p-10 text-center text-muted">Kamu belum membuat kebutuhan. <Link href="/posts/new" className="font-semibold text-navy-800 underline">Buat sekarang</Link></div>
            ) : (
              <div className="space-y-4">
                {myPosts.map((p) => (
                  <div key={p.id}>
                    <PostCard p={p} />
                    <form action={togglePostStatusAction.bind(null, p.id)} className="mt-2 text-right">
                      <button className="text-xs font-semibold text-navy-600 hover:underline">{p.status === "open" ? "Tutup kebutuhan ini" : "Buka kembali"}</button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>
          {recs.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-2xl font-semibold text-navy-800">Cocok untukmu</h2>
              <div className="space-y-4">{recs.map((p) => <PostCard key={p.id} p={p} mySkills={profile.skills.map((s) => s.name)} />)}</div>
            </section>
          )}
        </div>

        <aside className="card h-fit p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-800">Kelengkapan profil</h2>
            <span className="font-display text-2xl font-semibold text-amber-600">{pct}%</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-navy-50" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {checks.map((c) => (
              <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-muted line-through" : "text-navy-800"}`}>
                {c.ok ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Circle className="size-4 text-navy-100" />} {c.label}
              </li>
            ))}
          </ul>
          <Link href="/settings/profile" className="btn btn-navy mt-5 w-full">Lengkapi profil</Link>
        </aside>
      </div>
    </div>
  );
}
