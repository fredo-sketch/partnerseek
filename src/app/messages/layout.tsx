import type { Metadata } from "next";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { requireUser } from "@/lib/auth";
import { getConversations } from "@/lib/data";
import { timeAgo } from "@/components/time";

export const metadata: Metadata = { title: "Pesan" };
export const dynamic = "force-dynamic";

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser("/messages");
  const list = await getConversations(me.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-navy-800">Pesan</h1>
      <div className="card mt-5 grid h-[calc(100dvh-230px)] min-h-[480px] overflow-hidden md:grid-cols-[320px_1fr]">
        <aside className="overflow-y-auto border-line md:border-r">
          {list.length === 0 ? (
            <p className="p-6 text-sm text-muted">Belum ada percakapan. Buka profil talenta lalu klik “Kirim pesan”.</p>
          ) : (
            <ul>
              {list.map((c) => (
                <li key={c.id}>
                  <Link href={`/messages/${c.id}`} className="flex gap-3 border-b border-line/70 p-4 transition hover:bg-navy-50">
                    <Avatar name={c.other.name} size={42} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate text-sm ${c.unread ? "font-bold" : "font-semibold"} text-navy-800`}>{c.other.name}</p>
                        <span className="shrink-0 text-[10px] text-muted">{timeAgo(c.lastAt)}</span>
                      </div>
                      <p className={`truncate text-xs ${c.unread ? "font-semibold text-ink" : "text-muted"}`}>{c.lastFromMe ? "Kamu: " : ""}{c.lastBody || "Belum ada pesan"}</p>
                      {c.postTitle && <p className="mt-0.5 truncate text-[10px] text-amber-600">Re: {c.postTitle}</p>}
                    </div>
                    {c.unread && <span className="mt-1 size-2.5 shrink-0 rounded-full bg-amber-500" aria-label="Belum dibaca" />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <section className="flex min-h-0 flex-col">{children}</section>
      </div>
    </div>
  );
}
