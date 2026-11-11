import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-navy-900 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light size={36} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            Platform pencarian partner berbasis keahlian untuk mahasiswa. Temukan tim yang tepat untuk lomba, PKM, dan proyek — lebih cepat, lebih akurat.
          </p>
          <p className="mt-5 font-display text-amber-400">Seek Your Partner and Catch the Peak!</p>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">Jelajahi</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-amber-400" href="/talent">Cari Talenta</Link></li>
            <li><Link className="hover:text-amber-400" href="/feed">Cari Partner</Link></li>
            <li><Link className="hover:text-amber-400" href="/challenges">Tantangan UMKM</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">Akun</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-amber-400" href="/register">Daftar gratis</Link></li>
            <li><Link className="hover:text-amber-400" href="/login">Masuk</Link></li>
            <li><Link className="hover:text-amber-400" href="/#waitlist">Daftar tunggu</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} PartnerSeek · Kelompok 4 · Sistem Informasi UNNES
      </div>
    </footer>
  );
}
