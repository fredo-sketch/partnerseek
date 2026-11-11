import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarClock, MessageCircle, Users } from "lucide-react";
import Avatar from "@/components/Avatar";
import SkillBadge from "@/components/SkillBadge";
import TalentCard from "@/components/TalentCard";
import { getMatchesForPost, getPost } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { startConversationAction, togglePostStatusAction } from "@/lib/actions";
import { POST_TYPES } from "@/lib/types";
import { daysLeft, formatDate, timeAgo } from "@/components/time";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const post = await getPost(Number((await params).id));
  return { title: post?.title ?? "Kebutuhan tidak ditemukan" };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [post, me] = await Promise.all([getPost(id), getSession()]);
  if (!post) notFound();
  const matches = await getMatchesForPost(post, 5);
  const mine = me?.id === post.author.id;
  const dl = daysLeft(post.deadline);
  const typeLabel = POST_TYPES.find((t) => t.value === post.type)?.label;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/feed" className="text-sm font-semibold text-navy-600 hover:underline">← Kembali ke feed</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <article className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip chip-amber">{typeLabel}</span>
            <span className={`chip ${post.status === "open" ? "!bg-emerald-50 !text-emerald-700" : ""}`}>{post.status === "open" ? "Dibuka" : "Ditutup"}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy-800">{post.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5"><Users className="size-4" /> {post.slots} orang dicari</span>
            <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" /> {post.deadline ? `${formatDate(post.deadline)}${dl !== null && dl > 0 ? ` (${dl} hari lagi)` : ""}` : "Tanpa batas waktu"}</span>
            <span>Diposting {timeAgo(post.created_at)}</span>
          </div>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/90">{post.description}</p>
          <h2 className="mt-8 font-display text-lg font-semibold text-navy-800">Skill yang dibutuhkan</h2>
          <div className="mt-3 flex flex-wrap gap-2">{post.skills.map((s) => <SkillBadge key={s.id} name={s.name} />)}</div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            {mine ? (
              <form action={togglePostStatusAction.bind(null, post.id)}>
                <button className="btn btn-ghost">{post.status === "open" ? "Tutup kebutuhan" : "Buka kembali"}</button>
              </form>
            ) : (
              <form action={startConversationAction.bind(null, post.author.username, post.id)}>
                <button className="btn btn-primary btn-lg" disabled={post.status !== "open"}><MessageCircle className="size-4" /> {me ? "Hubungi pembuat" : "Masuk untuk menghubungi"}</button>
              </form>
            )}
          </div>
        </article>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Diposting oleh</p>
            <Link href={`/u/${post.author.username}`} className="mt-3 flex items-center gap-3">
              <Avatar name={post.author.name} size={52} />
              <div className="min-w-0">
                <p className="flex items-center gap-1 font-display text-lg font-semibold text-navy-800">{post.author.name}{post.author.is_verified && <BadgeCheck className="size-4 text-amber-500" />}</p>
                <p className="truncate text-xs text-muted">{[post.author.prodi, post.author.university].filter(Boolean).join(" · ")}</p>
              </div>
            </Link>
          </div>
          {matches.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-navy-800">Talenta yang cocok</h2>
              <div className="space-y-3">{matches.map((m) => <TalentCard key={m.id} u={m} highlightSkills={post.skills.map((s) => s.name)} />)}</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
