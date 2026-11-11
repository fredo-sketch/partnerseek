export type Role = "mahasiswa" | "umkm" | "organisasi";
export type SkillLevel = "pemula" | "menengah" | "mahir";
export type PostType = "lomba" | "pkm" | "proyek" | "freelance" | "startup";

export const POST_TYPES: { value: PostType; label: string }[] = [
  { value: "lomba", label: "Lomba" },
  { value: "pkm", label: "PKM" },
  { value: "proyek", label: "Proyek IT" },
  { value: "freelance", label: "Freelance" },
  { value: "startup", label: "Startup" },
];

export const INTERESTS = POST_TYPES.map((p) => p.value as string).concat("organisasi");

export const INTEREST_LABEL: Record<string, string> = {
  lomba: "Lomba",
  pkm: "PKM",
  proyek: "Proyek IT",
  freelance: "Freelance",
  startup: "Startup",
  organisasi: "Organisasi",
};

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  mahir: "Mahir",
};

export interface SkillChip {
  id: number;
  name: string;
  category: string;
  level?: SkillLevel;
  endorsements?: number;
}

export interface UserCard {
  id: number;
  name: string;
  username: string;
  role: Role;
  university: string | null;
  prodi: string | null;
  headline: string | null;
  is_verified: boolean;
  open_to_collab: boolean;
  skills: SkillChip[];
  /** persentase kecocokan terhadap sebuah kebutuhan (opsional) */
  match?: number;
}

export interface SessionUser {
  id: number;
  name: string;
  username: string;
  role: Role;
}
