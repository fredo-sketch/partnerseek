import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import RegisterForm from "@/components/RegisterForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Daftar" };

export default async function RegisterPage() {
  if (await getSession()) redirect("/feed");
  return (
    <AuthShell title="Buat akun PartnerSeek" subtitle="Gratis untuk mahasiswa. Selesai dalam semenit." footer={<>Sudah punya akun? <Link href="/login" className="font-semibold text-navy-800 underline">Masuk</Link></>}>
      <RegisterForm />
    </AuthShell>
  );
}
