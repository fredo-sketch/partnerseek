import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSession()) redirect("/feed");
  return (
    <AuthShell title="Selamat datang kembali" subtitle="Masuk untuk melanjutkan mencari partner." footer={<>Belum punya akun? <Link href="/register" className="font-semibold text-navy-800 underline">Daftar gratis</Link></>}>
      <LoginForm next={next} />
    </AuthShell>
  );
}
