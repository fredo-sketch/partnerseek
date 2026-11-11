import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, total, pageSize, params, basePath }: { page: number; total: number; pageSize: number; params: Record<string, string | string[] | undefined>; basePath: string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (k === "page" || v === undefined || v === "") continue;
      for (const x of Array.isArray(v) ? v : [v]) sp.append(k, x);
    }
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return q ? `${basePath}?${q}` : basePath;
  };
  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Halaman">
      {page > 1 && <Link href={href(page - 1)} className="btn btn-ghost !px-3" aria-label="Sebelumnya"><ChevronLeft className="size-4" /></Link>}
      <span className="text-sm text-muted">Halaman <b className="text-navy-800">{page}</b> dari {pages}</span>
      {page < pages && <Link href={href(page + 1)} className="btn btn-ghost !px-3" aria-label="Berikutnya"><ChevronRight className="size-4" /></Link>}
    </nav>
  );
}
