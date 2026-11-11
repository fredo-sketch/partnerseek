import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false, size = 40 }: { light?: boolean; size?: number }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2" aria-label="PartnerSeek — beranda">
      <Image
        src="/logo-mark.png"
        alt=""
        width={size}
        height={Math.round(size * 1.22)}
        className="h-auto transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
        style={{ width: size }}
        priority
      />
      <span className={`font-display text-2xl font-semibold tracking-tight ${light ? "text-white" : "text-navy-800"}`}>
        artner<span className="text-amber-500">S</span>eek
      </span>
    </Link>
  );
}
