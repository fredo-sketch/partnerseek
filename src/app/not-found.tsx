import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60dvh] max-w-xl place-items-center px-4 text-center">
      <div>
        <Image src="/logo-mark.png" alt="" width={80} height={97} className="mx-auto animate-float" />
        <h1 className="mt-4 font-display text-5xl font-semibold text-navy-800">404</h1>
        <p className="mt-2 text-muted">Halaman yang kamu cari tidak ditemukan. Mungkin partner-nya sudah pindah.</p>
        <Link href="/" className="btn btn-primary mt-6">Kembali ke beranda</Link>
      </div>
    </div>
  );
}
