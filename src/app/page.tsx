import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Building2, CheckCircle2, MessageCircle, Search, ShieldCheck, Sparkles,
  Trophy, UserPlus, Users, XCircle, Zap, Handshake, Layers,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import TrackedLink from "@/components/TrackedLink";
import TalentCard from "@/components/TalentCard";
import WaitlistForm from "@/components/WaitlistForm";
import Avatar from "@/components/Avatar";
import { getLandingStats, getLandingTalents } from "@/lib/data";
import type { UserCard } from "@/lib/types";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "UI/UX Design", "Fullstack Web", "Flutter", "Data Analyst", "Copywriting", "Machine Learning", "Business Plan",
  "Video Editing", "Ilustrasi", "Karya Tulis Ilmiah", "IoT", "Digital Marketing", "Public Speaking", "Analisis Keuangan",
];

const PROBLEMS = [
  { icon: Search, title: "Bingung cari anggota dengan skill khusus", text: "Butuh desainer atau data analyst, tapi lingkaran pertemananmu itu-itu saja." },
  { icon: Users, title: "Relasi kerja kurang luas", text: "Banyak talenta bagus lintas prodi dan kampus yang tidak pernah kamu temui." },
  { icon: Zap, title: "Proses manual dan memakan waktu", text: "Tanya satu-satu di grup WA, tunggu balasan, lalu ternyata skill-nya tidak cocok." },
];

const STEPS = [
  { icon: UserPlus, title: "Buat profil skill", text: "Isi keahlian, level, dan portofolio. Hanya sekitar 5 menit." },
  { icon: Search, title: "Cari berdasarkan keahlian", text: "Filter by skill, prodi, dan minat. Lihat persentase kecocokan dengan kebutuhanmu." },
  { icon: Handshake, title: "Chat & mulai berkolaborasi", text: "Ngobrol langsung di platform atau lanjut ke WhatsApp. Tim terbentuk, proyek jalan." },
];

const FEATURES = [
  { icon: Search, title: "Pencarian berbasis skill", text: "Filter multi-skill, prodi, kampus, dan jenis kebutuhan: lomba, PKM, proyek, freelance, startup." },
  { icon: Layers, title: "Profil & portofolio digital", text: "Tunjukkan karya nyata, riwayat, dan prestasi. Lebih meyakinkan daripada sekadar CV." },
  { icon: BadgeCheck, title: "Endorsement & verifikasi", text: "Skill divalidasi teman kolaborasi, dan profil terverifikasi menekan akun palsu." },
  { icon: MessageCircle, title: "Chat terintegrasi", text: "Hubungi langsung dalam aplikasi, dengan pintasan ke WhatsApp saat sudah cocok." },
  { icon: Trophy, title: "Tantangan dari UMKM", text: "UMKM dan startup membuka tantangan nyata. Tunjukkan karyamu, dapat hadiah dan peluang kerja." },
  { icon: Sparkles, title: "Rekomendasi kecocokan", text: "Setiap kebutuhan otomatis dicocokkan dengan talenta yang skill-nya paling sesuai." },
];

const COMPARE: { label: string; wa: boolean | string; sosmed: boolean | string; linkedin: boolean | string; ps: boolean | string }[] = [
  { label: "Filter berdasarkan skill spesifik", wa: false, sosmed: false, linkedin: "Terbatas", ps: true },
  { label: "Fokus kolaborasi mahasiswa", wa: false, sosmed: false, linkedin: false, ps: true },
  { label: "Portofolio terstruktur", wa: false, sosmed: "Acak", linkedin: true, ps: true },
  { label: "Persentase kecocokan otomatis", wa: false, sosmed: false, linkedin: false, ps: true },
  { label: "Jalur langsung ke UMKM/organisasi kampus", wa: false, sosmed: false, linkedin: false, ps: true },
  { label: "Gratis untuk mahasiswa", wa: true, sosmed: true, linkedin: "Sebagian", ps: true },
];

const FAQ = [
  { q: "Apakah PartnerSeek gratis?", a: "Gratis untuk mahasiswa. Model bisnis kami berasal dari langganan premium UMKM/startup, listing berbayar, dan sponsor penyelenggara lomba." },
  { q: "Apakah hanya untuk mahasiswa UNNES?", a: "Tahap awal kami fokus di sekitar UNNES, tetapi mahasiswa kampus lain sudah bisa mendaftar dan akan kami buka bertahap lintas kampus." },
  { q: "Bagaimana kalau kami pindah ke WhatsApp setelah ketemu?", a: "Tidak masalah. Chat di platform membantu kenalan awal, dan kamu bisa lanjut ke WhatsApp kapan saja. Reputasi dan endorsement tetap tercatat di profilmu." },
  { q: "Bagaimana PartnerSeek mencegah profil palsu?", a: "Ada verifikasi profil, endorsement dari kolaborator, dan fitur pelaporan. Skill yang tidak pernah divalidasi akan tampil tanpa lencana." },
  { q: "Apa itu Tantangan UMKM?", a: "UMKM, startup, atau organisasi kampus membuka tantangan nyata (desain, produk, konten). Mahasiswa mengirim karya; yang terbaik berpeluang mendapat hadiah, kontrak, atau magang." },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <CheckCircle2 className="mx-auto size-5 text-emerald-500" aria-label="Ya" />;
  if (v === false) return <XCircle className="mx-auto size-5 text-navy-100" aria-label="Tidak" />;
  return <span className="text-xs font-semibold text-muted">{v}</span>;
}

export default async function Home() {
  let talents: UserCard[] = [];
  let stats = { talents: 0, openPosts: 0, challenges: 0, campuses: 0 };
  try {
    [talents, stats] = await Promise.all([getLandingTalents(6), getLandingStats()]);
  } catch {
    /* DB belum siap: halaman tetap tampil tanpa data dinamis */
  }

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative -mt-[72px] overflow-hidden bg-navy-800 pt-[72px] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgb(27_79_179/0.55),transparent),radial-gradient(40%_50%_at_10%_90%,rgb(248_168_24/0.18),transparent)]" />
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-24 top-40 size-72 rounded-full bg-amber-500/20 blur-3xl animate-float-slow" aria-hidden />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-32 lg:pt-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-amber-300 ring-1 ring-white/15 backdrop-blur">
                <span className="size-2 rounded-full bg-amber-400 animate-pulse-ring" /> Platform matchmaking talenta mahasiswa
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Cari partner yang <span className="gradient-text animate-shimmer">skill-nya pas</span>, bukan sekadar yang kamu kenal.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                Bentuk tim untuk lomba, PKM, dan proyek dalam hitungan menit. Cari berdasarkan keahlian, lihat portofolio nyata, lalu langsung chat.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-3">
              <TrackedLink href="/register" event="klik_daftar" eventParams={{ location: "hero" }} className="btn btn-primary btn-lg group">
                Daftar gratis <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </TrackedLink>
              <Link href="/talent" className="btn btn-lg bg-white/10 text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/20">
                Jelajahi talenta
              </Link>
            </Reveal>
            <Reveal delay={320} className="mt-10 grid max-w-lg grid-cols-3 gap-6">
              {[
                [stats.talents || "100+", "Talenta"],
                [stats.openPosts || "50+", "Kebutuhan aktif"],
                [stats.challenges || "10+", "Tantangan UMKM"],
              ].map(([n, l]) => (
                <div key={String(l)}>
                  <div className="font-display text-3xl font-semibold text-amber-400">{n}</div>
                  <div className="text-xs text-white/65">{l}</div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* mockup kartu mengambang */}
          <div className="relative mx-auto hidden h-[460px] w-full max-w-md lg:block" aria-hidden>
            <div className="absolute left-0 top-4 w-72 animate-float rounded-2xl bg-white p-5 text-ink shadow-pop" style={{ ["--r" as string]: "-4deg" }}>
              <div className="flex items-center gap-3">
                <Avatar name="Rina Kusuma" size={46} />
                <div>
                  <p className="flex items-center gap-1 font-display font-semibold text-navy-800">Rina Kusuma <BadgeCheck className="size-4 text-amber-500" /></p>
                  <p className="text-xs text-muted">UI/UX Designer · DKV</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["UI/UX", "Figma", "Riset"].map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
            <div className="absolute right-0 top-36 w-72 animate-float-slow rounded-2xl bg-white p-5 text-ink shadow-pop" style={{ ["--r" as string]: "3deg" }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Dicari · Lomba</p>
              <p className="mt-1 font-display text-lg font-semibold leading-snug text-navy-800">Butuh UI/UX Designer untuk lomba perangkat lunak</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="chip chip-amber">98% cocok</span>
                <span className="text-xs text-muted">1 slot</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-10 w-64 animate-float rounded-2xl bg-navy-900/90 p-4 shadow-pop ring-1 ring-white/15 backdrop-blur" style={{ ["--r" as string]: "-2deg" }}>
              <div className="flex items-center gap-2 text-xs text-white/70"><MessageCircle className="size-3.5 text-amber-400" /> Pesan baru</div>
              <p className="mt-1.5 text-sm text-white">“Aku kosong mulai minggu depan, yuk mulai!”</p>
            </div>
          </div>
        </div>

        <div className="relative border-y border-white/10 bg-navy-900/60 py-4 backdrop-blur">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee gap-3">
              {[...MARQUEE, ...MARQUEE].map((s, i) => (
                <span key={i} className="whitespace-nowrap rounded-full bg-white/8 px-4 py-1.5 text-sm font-medium text-white/80 ring-1 ring-white/10">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── MASALAH ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">Masalahnya</p>
          <h2 className="section-title mt-2">Cari partner lomba itu melelahkan</h2>
          <p className="mt-3 text-muted">Kami menemukan akar masalahnya sederhana: belum ada platform khusus yang mempertemukan mahasiswa berdasarkan kompetensi.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="card h-full p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-600"><p.icon className="size-6" /></span>
                <h3 className="mt-4 font-display text-xl font-semibold text-navy-800">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── CARA KERJA ───────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">Cara kerja</p>
            <h2 className="section-title mt-2">Tiga langkah, tim terbentuk</h2>
          </Reveal>
          <ol className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 md:block" aria-hidden />
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 120} className="relative text-center">
                <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-navy-800 text-white shadow-pop ring-8 ring-white">
                  <s.icon className="size-7" />
                  <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-amber-500 font-display text-sm font-bold text-navy-900">{i + 1}</span>
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-800">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── FITUR ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">Fitur</p>
          <h2 className="section-title mt-2">Semua yang kamu butuhkan untuk membentuk tim</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <div className="card card-hover group h-full p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-navy-800 text-amber-400 transition group-hover:scale-110 group-hover:rotate-3"><f.icon className="size-6" /></span>
                <h3 className="mt-4 font-display text-xl font-semibold text-navy-800">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── TALENTA ───────────── */}
      {talents.length > 0 && (
        <section className="bg-navy-50 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-amber-600">Talent spotlight</p>
                <h2 className="section-title mt-2">Kenalan dengan talenta di PartnerSeek</h2>
                <p className="mt-2 text-xs text-muted">Contoh data dummy untuk demonstrasi.</p>
              </div>
              <Link href="/talent" className="btn btn-navy">Lihat semua talenta <ArrowRight className="size-4" /></Link>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {talents.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 90}><TalentCard u={t} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── PEMBEDA ───────────── */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">Kenapa PartnerSeek</p>
          <h2 className="section-title mt-2">LinkedIn khusus mahasiswa untuk kolaborasi</h2>
          <p className="mt-3 text-muted">Bukan sekadar tempat memajang CV, tapi tempat membentuk tim.</p>
        </Reveal>
        <Reveal className="card mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-center">
                <th className="p-4 text-left font-semibold text-muted">Kemampuan</th>
                <th className="p-4 font-semibold text-muted">Grup WA</th>
                <th className="p-4 font-semibold text-muted">IG / TikTok</th>
                <th className="p-4 font-semibold text-muted">LinkedIn</th>
                <th className="bg-amber-100/70 p-4 font-display text-base font-semibold text-navy-800">PartnerSeek</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.label} className="border-b border-line/70 text-center last:border-0">
                  <td className="p-4 text-left font-medium text-navy-800">{r.label}</td>
                  <td className="p-4"><Cell v={r.wa} /></td>
                  <td className="p-4"><Cell v={r.sosmed} /></td>
                  <td className="p-4"><Cell v={r.linkedin} /></td>
                  <td className="bg-amber-100/40 p-4"><Cell v={r.ps} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* ───────────── UMKM ───────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-800 to-navy-950 p-8 text-white sm:p-14">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-amber-500/25 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="chip chip-amber"><Building2 className="size-3.5" /> Untuk UMKM, startup & organisasi</span>
              <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Temukan talenta mahasiswa lewat tantangan nyata</h2>
              <p className="mt-3 max-w-xl text-white/75">
                Buka tantangan desain, produk, atau konten. Mahasiswa mengirim karya, kamu menilai langsung dari portofolio. Mulai dari talent scouting sampai kontrak proyek.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink href="/challenges" event="klik_tantangan" className="btn btn-primary">Lihat tantangan <Trophy className="size-4" /></TrackedLink>
                <TrackedLink href="/register" event="klik_daftar" eventParams={{ location: "umkm_cta" }} className="btn bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20">Daftar sebagai mitra</TrackedLink>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {["Akses talenta lintas prodi & kampus", "Nilai langsung dari portofolio", "Verifikasi profil mitra", "Mulai gratis, upgrade saat butuh"].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 ring-1 ring-white/10"><ShieldCheck className="size-5 shrink-0 text-amber-400" />{t}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <Reveal className="text-center"><h2 className="section-title">Pertanyaan umum</h2></Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <details className="card group p-5 open:ring-navy-600/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-navy-800">
                  {f.q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-800 transition group-open:rotate-45 group-open:bg-amber-500">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── WAITLIST ───────────── */}
      <section id="waitlist" className="scroll-mt-20 px-4 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-navy-800 px-6 py-14 text-white sm:px-14">
          <div className="grid-bg absolute inset-0 opacity-70" />
          <div className="absolute -left-10 bottom-0 size-60 rounded-full bg-amber-500/25 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Jadi yang pertama mencoba PartnerSeek</h2>
              <p className="mt-3 text-white/75">Gabung daftar tunggu dan dapatkan akses awal, lencana early adopter, serta prioritas saat kampusmu dibuka.</p>
              <ul className="mt-6 space-y-2 text-sm text-white/85">
                {["Akses awal sebelum peluncuran umum", "Lencana Early Adopter di profil", "Kabar tantangan UMKM pertama"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-amber-400" /> {t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}><div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/15 backdrop-blur"><WaitlistForm tone="dark" /></div></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
