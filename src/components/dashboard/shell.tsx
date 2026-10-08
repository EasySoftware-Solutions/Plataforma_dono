"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { Bell, FileText, LogOut, Moon, Sun, Zap } from "lucide-react";
import type { Investor, Notice } from "@/types";
import { Logo } from "@/components/logo";
import { logout } from "@/app/login/actions";
import { dataLonga } from "@/lib/format";
import { THEME_COOKIE, type Theme } from "@/lib/theme";
import { DURATION, EASE_OUT, SPRING_LAYOUT } from "@/components/motion/tokens";
import { isActive, NAV } from "./nav";
import { TabBar } from "./tab-bar";

function useClickOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  // `close` costuma ser uma arrow nova a cada render; guardá-la em ref evita
  // reinscrever os listeners do documento em todo render enquanto o menu está aberto.
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    // pointerdown cobre mouse, toque e caneta de forma uniforme
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && closeRef.current();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return ref;
}

// Popover nasce do canto do botão que o abriu (transform-origin no gatilho), parte de 96%
// e nunca de zero. A saída é mais rápida que a entrada: o usuário já decidiu fechar.
const POPOVER = {
  initial: { opacity: 0, transform: "scale(0.96)" },
  animate: { opacity: 1, transform: "scale(1)", transition: { duration: DURATION.menu, ease: EASE_OUT } },
  exit: { opacity: 0, transform: "scale(0.96)", transition: { duration: DURATION.menuExit, ease: EASE_OUT } },
} as const;

const POPOVER_CLASS =
  "fixed inset-x-4 top-[4.5rem] z-40 rounded-card bg-dono-surface-2 p-2 shadow-[0_20px_44px_-14px_rgba(11,18,48,0.28)] ring-1 ring-black/[0.06] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12";

function NavLinks() {
  const path = usePathname();
  return (
    <ul className="space-y-1">
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(path, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-11 items-center gap-3 rounded-xl px-3.5 text-[15px] font-semibold transition-colors duration-150 ${
                active ? "text-dono-blue-bright" : "text-ink-subtle hover:bg-white/[0.04] hover:text-ink"
              }`}
            >
              {active && (
                <m.span
                  layoutId="nav-pill"
                  transition={SPRING_LAYOUT}
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-dono-blue/15 ring-1 ring-inset ring-dono-blue/30"
                />
              )}
              <Icon aria-hidden className="relative size-[18px]" strokeWidth={2.1} />
              <span className="relative">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const NOTICE_ICON = { relatorio: FileText, ativo: Zap };

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
        className="relative flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-white/[0.08] hover:text-ink active:bg-white/[0.08]"
      >
        <Bell aria-hidden className="size-5" />
        <span aria-hidden className="absolute right-2.5 top-2.5 size-2 rounded-full bg-dono-blue ring-2 ring-dono-base" />
      </button>
      <AnimatePresence>
        {open && (
          <m.div {...POPOVER} style={{ transformOrigin: "top right" }} className={`${POPOVER_CLASS} sm:w-[360px]`}>
            <p className="px-3 pb-2 pt-2 text-sm font-bold text-ink">Avisos</p>
            <ul className="max-h-[min(70dvh,480px)] overflow-y-auto">
              {notices.map((n) => {
                const Icon = NOTICE_ICON[n.tipo];
                return (
                  <li key={n.id}>
                    <Link href={n.href} onClick={() => setOpen(false)} className="flex min-h-11 gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-white/[0.06]">
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
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserMenu({ investor, theme, onToggleTheme }: { investor: Investor; theme: Theme; onToggleTheme: () => void }) {
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
        className="flex min-h-11 items-center gap-3 rounded-full py-1 pl-1 pr-1 transition-colors duration-150 hover:bg-white/[0.06] sm:pr-3"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-dono-blue text-sm font-bold text-on-accent">{iniciais}</span>
        <span className="hidden text-sm font-semibold text-ink sm:block">{investor.nome.split(" ")[0]}</span>
      </button>
      <AnimatePresence>
        {open && (
          <m.div {...POPOVER} style={{ transformOrigin: "top right" }} className={`${POPOVER_CLASS} sm:w-64`}>
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-ink">{investor.nome}</p>
              <p className="truncate text-sm text-ink-subtle">{investor.email}</p>
            </div>
            {/* Troca de tema: instantânea, sem animar cores da página inteira */}
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={onToggleTheme}
              className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-ink"
            >
              {theme === "dark" ? <Moon aria-hidden className="size-4" /> : <Sun aria-hidden className="size-4" />}
              <span className="flex-1 text-left">Modo escuro</span>
              <span aria-hidden className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ${theme === "dark" ? "bg-dono-blue" : "bg-white/[0.16]"}`}>
                <span
                  className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-[#ffffff] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-150 ease-out-expo ${theme === "dark" ? "translate-x-4" : ""}`}
                />
              </span>
            </button>
            <form action={logout}>
              <button type="submit" className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-ink">
                <LogOut aria-hidden className="size-4" />
                Sair
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardShell({
  investor,
  notices,
  theme: initialTheme,
  children,
}: {
  investor: Investor;
  notices: Notice[];
  theme: Theme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    // Um ano; o servidor lê esse cookie e já renderiza a próxima visita no tema certo.
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <div className={`${theme === "dark" ? "theme-dark" : "theme-light"} min-h-dvh bg-dono-base text-ink lg:grid lg:grid-cols-[256px_1fr]`}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-dono-blue focus:px-4 focus:py-2 focus:text-on-accent">
        Pular para o conteúdo
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-white/[0.06] bg-dono-deep px-4 py-6 lg:flex">
        <div className="px-3.5">
          <Logo href="/dashboard" qualifier="Gestão" />
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

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-dono-base lg:bg-dono-base/80 lg:backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <div className="shrink-0 lg:hidden">
              <Logo href="/dashboard" qualifier="Gestão" />
            </div>
            <p className="ml-1 min-w-0 truncate rounded-full bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-ink-muted ring-1 ring-inset ring-white/10 lg:ml-0">
              <span className="md:hidden">Demonstração</span>
              <span className="hidden md:inline">Ambiente de demonstração, dados mockados</span>
            </p>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Notifications notices={notices} />
              <UserMenu investor={investor} theme={theme} onToggleTheme={toggleTheme} />
            </div>
          </div>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-[1280px] px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
          {children}
        </main>
      </div>

      <TabBar />
    </div>
  );
}
