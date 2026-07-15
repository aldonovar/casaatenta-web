import type { Metadata } from "next";
import { MfaChallenge } from "@/components/MfaChallenge";

export const metadata: Metadata = { title: "Verificación 2FA", robots: { index: false, follow: false } };

export default async function MfaPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <section className="auth-simple-page"><MfaChallenge next={next} /></section>;
}
