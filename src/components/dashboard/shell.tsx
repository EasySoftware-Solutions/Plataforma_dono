"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, FileText, LogOut, Menu, Wallet, X, Zap } from "lucide-react";
import type { Investor, Notice } from "@/types";
import { Logo } from "@/components/logo";
import { logout } from "@/app/login/actions";
import { dataLonga } from "@/lib/format";
import { NAV } from "./nav";

function useClickOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <ul className="space-y-1">
      {NAV.map(({ href, label, Icon }) => {
        const active = path === href || path.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-[15px] font-semibold transition-colors ${
                active ? "bg-white/[0.08] text-crp-blue-bright" : "text-ink-subtle hover:bg-white/[0.04] hover:text-ink"
              }`}
            >
              <Icon aria-hidden className="size-[18px]" strokeWidth={2.1} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const NOTICE_ICON = { pagamento: Wallet, relatorio: FileText, ativo: Zap };

function Notifications({ notices }: { notices: Notice[] }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Avisos, ${notices.length} novos`}
        className="relative flex size-10 items-center justify-center rounded-full text-ink-muted hover:bg-white/[0.08] hover:text-ink"
      >
        <Bell aria-hidden className="size-5" />
        <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-crp-blue ring-2 ring-crp-navy" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-2rem))] rounded-card bg-crp-surface-2 p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]">
          <p className="px-3 pb-2 pt-2 text-sm font-bold text-ink">Avisos</p>
          <ul>
            {notices.map((n) => {
              const Icon = NOTICE_ICON[n.tipo];
              return (
                <li key={n.id}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="flex gap-3 rounded-xl p-3 hover:bg-white/[0.06]">
                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">{n.titulo}</span>
                      <span className="mt-0.5 block text-sm text-ink-subtle">{n.detalhe}</span>
                      <span className="mt-1 block text-xs text-ink-subtle/80">{dataLonga(n.data)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function UserMenu({ investor }: { investor: Investor }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(open, () => setOpen(false));
  const iniciais = investor.nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menu da conta"
        className="flex items-center gap-3 rounded-full py-1 pl-1 pr-1 hover:bg-white/[0.06] sm:pr-3"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-crp-blue text-sm font-bold text-ink">{iniciais}</span>
        <span className="hidden text-sm font-semibold text-ink sm:block">{investor.nome.split(" ")[0]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-64 rounded-card bg-crp-surface-2 p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{investor.nome}</p>
            <p className="truncate text-sm text-ink-subtle">{investor.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-muted hover:bg-white/[0.06] hover:text-ink">
              <LogOut aria-hidden className="size-4" />
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({ investor, notices, children }: { investor: Investor; notices: Notice[]; children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const path = usePathname();
  useEffect(() => setDrawer(false), [path]);
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  return (
    <div className="min-h-dvh bg-crp-navy lg:grid lg:grid-cols-[256px_1fr]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-crp-blue focus:px-4 focus:py-2 focus:text-ink">
        Pular para o conteúdo
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col bg-crp-navy-deep px-4 py-6 lg:flex">
        <div className="px-3.5">
          <Logo href="/dashboard" />
        </div>
        <nav aria-label="Principal" className="mt-10 flex-1">
          <NavLinks />
        </nav>
        <p className="px-3.5 text-xs leading-relaxed text-ink-subtle">
          Grupo CRP
          <br />
          Rentabilidade passada não garante rentabilidade futura.
        </p>
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-crp-navy-deep px-4 py-5">
            <div className="flex items-center justify-between px-3.5">
              <Logo href="/dashboard" />
              <button type="button" onClick={() => setDrawer(false)} aria-label="Fechar menu" className="flex size-10 items-center justify-center rounded-full text-ink-muted hover:bg-white/[0.08]">
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Principal" className="mt-8">
              <NavLinks onNavigate={() => setDrawer(false)} />
            </nav>
          </div>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 bg-crp-navy/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button type="button" onClick={() => setDrawer(true)} aria-label="Abrir menu" className="-ml-2 flex size-10 items-center justify-center rounded-full text-ink hover:bg-white/[0.08] lg:hidden">
              <Menu className="size-5" />
            </button>
            <div className="lg:hidden">
              <Logo href="/dashboard" />
            </div>
            <p className="ml-auto hidden items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-ink-muted md:flex lg:ml-0">
              <span aria-hidden className="size-1.5 rounded-full bg-crp-blue" />
              Ambiente de demonstração · valores fictícios
            </p>
            <div className="ml-auto flex items-center gap-1">
              <Notifications notices={notices} />
              <UserMenu investor={investor} />
            </div>
          </div>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
