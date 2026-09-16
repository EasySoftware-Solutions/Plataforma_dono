import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Logo } from "@/components/logo";
import { TIPOS } from "@/lib/constants";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const { voltar } = await searchParams;
  return (
    <main className="grid min-h-dvh bg-crp-navy-deep lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image src="/assets/usinas-solares.jpg" alt="" fill priority sizes="55vw" style={{ objectPosition: TIPOS.solar.foco }} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <p className="max-w-[16ch] text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-ink xl:text-[52px]">
            O que é seu, <span className="text-crp-blue-bright">à vista.</span>
          </p>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-muted">
            Carregadores, postos, máquinas Capaxero e usinas solares. Rendimento, relatórios e pagamentos de cada ativo em um só lugar.
          </p>
        </div>
      </aside>

      <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-subtle hover:text-ink">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar ao site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <h1 className="text-[32px] font-bold leading-tight text-ink sm:text-4xl">Acesse sua conta</h1>
          <p className="mt-3 text-[15px] text-ink-subtle">Investidores do Club Renda Passiva entram aqui. A plataforma agora se chama DONO.</p>

          <div className="mt-10">
            <LoginForm voltar={voltar} />
          </div>

          <p className="mt-8 flex items-start gap-2.5 rounded-xl bg-white/[0.04] p-4 text-sm leading-relaxed text-ink-subtle">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
            Ambiente de demonstração: qualquer e-mail válido e senha com 4 caracteres ou mais dão acesso a uma carteira fictícia.
          </p>
        </div>

        <p className="text-xs text-ink-subtle">Grupo CRP · Plataforma DONO</p>
      </section>
    </main>
  );
}
