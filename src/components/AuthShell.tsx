import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-navy-800 p-10 text-white lg:block">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-amber-500/30 blur-3xl" />
        <div className="relative">
          <Image src="/logo-mark.png" alt="" width={72} height={87} className="animate-float" />
          <h2 className="mt-6 font-display text-4xl font-semibold leading-tight">Seek Your Partner and <span className="text-amber-400">Catch the Peak!</span></h2>
          <p className="mt-4 max-w-sm text-white/75">Temukan partner dengan keahlian yang tepat untuk lomba, PKM, dan proyekmu.</p>
          <ul className="mt-8 space-y-3 text-sm text-white/85">
            <li>✦ Pencarian berbasis skill & portofolio</li>
            <li>✦ Chat terintegrasi dengan pintasan WhatsApp</li>
            <li>✦ Tantangan nyata dari UMKM & startup</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-navy-800">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="card mt-6 p-6">{children}</div>
        <p className="mt-5 text-center text-sm text-muted">{footer}</p>
      </div>
    </div>
  );
}
