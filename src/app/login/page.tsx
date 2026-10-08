import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Logo } from "@/components/logo";
import { TIPOS } from "@/lib/constants";
import { LoginForm } from "./login-form";
import { LoginSheet } from "./login-sheet";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const { voltar } = await searchParams;
  return (
    <main className="relative flex min-h-dvh flex-col bg-dono-deep lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Banda visual do topo (mobile/tablet) */}
      <div className="relative h-[232px] shrink-0 overflow-hidden sm:h-[272px] lg:hidden">
        <Image src="/assets/usinas-solares.jpg" alt="" fill priority sizes="100vw" style={{ objectPosition: TIPOS.solar.foco }} className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dono-deep via-dono-deep/30 to-black/30" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <Logo />
          <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-black/35 px-4 text-sm font-semibold text-ink backdrop-blur-sm transition-colors duration-150 hover:bg-black/55">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar ao site
          </Link>
        </div>
        <p className="absolute inset-x-0 bottom-0 px-6 pb-[52px] font-display text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:pb-[58px] sm:text-[32px]">
          O que é seu, <span className="text-dono-blue-bright">à vista.</span>
        </p>
      </div>

      {/* Painel visual (desktop) */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image src="/assets/usinas-solares.jpg" alt="" fill priority sizes="55vw" style={{ objectPosition: TIPOS.solar.foco }} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <p className="max-w-[16ch] font-display text-[44px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink xl:text-[52px]">
            O que é seu, <span className="text-dono-blue-bright">à vista.</span>
          </p>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-muted">
            Carregadores, postos, máquinas Capaxero e usinas solares. Rendimento e relatórios de cada ativo em um só lugar.
          </p>
        </div>
      </aside>

      {/* Formulário em folha elevada */}
      <LoginSheet className="relative z-10 -mt-7 flex flex-1 flex-col rounded-t-[28px] border-t border-white/[0.08] bg-dono-base px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-9 shadow-[0_-28px_64px_-32px_rgba(2,6,22,0.95)] sm:px-10 lg:mt-0 lg:rounded-none lg:border-0 lg:px-16 lg:pb-8 lg:shadow-none lg:pt-8">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(440px_240px_at_50%_0%,rgba(72,43,116,0.35),transparent_70%)] lg:hidden" />

        <div className="relative hidden items-center justify-between lg:flex">
          <Logo />
          <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-subtle transition-colors duration-150 hover:text-ink">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar ao site
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8 sm:py-10 lg:py-12">
          <h1 className="text-[32px] font-bold leading-tight text-ink sm:text-4xl">Acesse sua conta</h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-subtle">Investidores do Club Renda Passiva entram aqui. A plataforma agora se chama DONO.</p>

          <div className="mt-8">
            <LoginForm voltar={voltar} />
          </div>

          <p className="mt-7 flex items-start gap-2.5 rounded-xl bg-white/[0.04] p-4 text-sm leading-relaxed text-ink-subtle ring-1 ring-inset ring-white/[0.07]">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
            Ambiente de demonstração: qualquer e-mail válido e senha com 4 caracteres ou mais dão acesso à carteira de demonstração do cliente Magno Borges (usinas NB1 e NB2).
          </p>
        </div>

        <p className="relative text-xs text-ink-subtle">Grupo CRP · Plataforma DONO</p>
      </LoginSheet>
    </main>
  );
}
