function hueOf(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function Avatar({ name, size = 44, className = "" }: { name: string; size?: number; className?: string }) {
  const h = hueOf(name);
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white ring-2 ring-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${h} 70% 42%), hsl(${(h + 40) % 360} 75% 32%))`,
      }}
    >
      {initials(name)}
    </span>
  );
}
