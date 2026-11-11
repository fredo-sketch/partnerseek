import type { SkillLevel } from "@/lib/types";

const dot: Record<SkillLevel, string> = {
  pemula: "bg-navy-100",
  menengah: "bg-amber-300",
  mahir: "bg-amber-500",
};

export default function SkillBadge({ name, level, highlight = false }: { name: string; level?: SkillLevel; highlight?: boolean }) {
  return (
    <span className={`chip ${highlight ? "chip-amber" : ""}`}>
      {level && <span className={`size-1.5 rounded-full ${dot[level]}`} aria-hidden />}
      {name}
    </span>
  );
}
