"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, MessageCircle, UserRound, X, LayoutDashboard } from "lucide-react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import TrackedLink from "./TrackedLink";
import { logoutAction } from "@/lib/actions";

const LINKS = [
  { href: "/talent", label: "Cari Talenta" },
  { href: "/feed", label: "Cari Partner" },
  { href: "/challenges", label: "Tantangan" },
];

export default function NavClient({
  user,
  unread,
}: {
  user: { name: string; username: string } | null;
  unread: number;
}) {
  const pathname = usePathname();
  // Menu otomatis tertutup saat pindah halaman: simpan path tempat menu dibuka.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  // Di beranda (hero biru gelap) dan belum scroll → teks navbar dibuat terang.
  const light = pathname === "/" && !scrolled && !open;

  return (
    <>
      <Logo light={light} />
      <div className={`fixed inset-x-0 top-0 -z-10 h-[72px] transition-all duration-300 ${scrolled ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent"}`} />

      <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active(l.href)
                ? light ? "bg-white text-navy-800" : "bg-navy-800 text-white"
                : light ? "text-white/90 hover:bg-white/10" : "text-navy-800 hover:bg-navy-50"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        {user ? (
          <>
            <Link href="/messages" className="btn btn-ghost relative !p-2.5" aria-label="Pesan">
              <MessageCircle className="size-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-navy-900">{unread}</span>
              )}
            </Link>
            <Link href="/dashboard" className="btn btn-ghost">Dasbor</Link>
            <Link href={`/u/${user.username}`} className="flex items-center gap-2 rounded-full p-1 pr-3 ring-1 ring-line transition hover:ring-navy-600/40" aria-label="Profil saya">
              <Avatar name={user.name} size={32} />
              <span className="max-w-24 truncate text-sm font-semibold text-navy-800">{user.name.split(" ")[0]}</span>
            </Link>
            <form action={logoutAction}>
              <button className="btn btn-ghost !p-2.5" aria-label="Keluar" title="Keluar"><LogOut className="size-4" /></button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">Masuk</Link>
            <TrackedLink href="/register" event="klik_daftar" eventParams={{ location: "navbar" }} className="btn btn-primary">
              Daftar gratis
            </TrackedLink>
          </>
        )}
      </div>

      <button className={`btn !p-2.5 md:hidden ${light ? "bg-white/10 text-white ring-1 ring-white/25" : "btn-ghost"}`} onClick={() => setOpenAt(open ? null : pathname)} aria-expanded={open} aria-label="Buka menu">
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-line bg-white p-4 shadow-pop md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-xl px-4 py-3 font-semibold ${active(l.href) ? "bg-navy-800 text-white" : "text-navy-800"}`}>
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-navy-800"><LayoutDashboard className="size-4" /> Dasbor</Link>
                <Link href="/messages" className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-navy-800"><MessageCircle className="size-4" /> Pesan {unread > 0 && <span className="rounded-full bg-amber-500 px-2 text-xs">{unread}</span>}</Link>
                <Link href={`/u/${user.username}`} className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-navy-800"><UserRound className="size-4" /> Profil saya</Link>
                <form action={logoutAction}><button className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold text-red-600"><LogOut className="size-4" /> Keluar</button></form>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="btn btn-ghost">Masuk</Link>
                <TrackedLink href="/register" event="klik_daftar" eventParams={{ location: "navbar_mobile" }} className="btn btn-primary">Daftar gratis</TrackedLink>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
