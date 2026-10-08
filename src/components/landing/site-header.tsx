"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE_OUT, translateY } from "@/components/motion/tokens";

const LINKS = [
  { href: "#manifesto", label: "A DONO" },
  { href: "#ativos", label: "Ativos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#plataforma", label: "Plataforma" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  // Só a virada do fundo sólido vira estado React; a barra de progresso é um valor
  // de movimento ligado direto ao estilo, sem render por quadro.
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out-expo ${solid || open ? "border-b border-white/[0.06] bg-dono-base lg:bg-dono-base/90 lg:backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-3 px-4 sm:gap-4 sm:px-8">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-site"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="-ml-2.5 flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-150 active:bg-white/10 lg:hidden [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/10"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        <span data-site-logo className="inline-flex">
          <Logo />
        </span>
        <nav aria-label="Seções" className="ml-10 hidden lg:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative rounded-pill px-3.5 py-2 text-[15px] font-semibold text-ink-muted transition-colors duration-150 hover:text-ink">
                  {l.label}
                  <span aria-hidden className="absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-dono-blue-bright transition-transform duration-300 ease-out-expo [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link href="/login" className="hidden items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors duration-150 hover:text-dono-blue-bright sm:inline-flex">
            Acesse sua conta <ArrowRight aria-hidden className="size-4" />
          </Link>
          <ButtonLink href="/login" size="md">
            Abra sua conta
          </ButtonLink>
        </div>
      </div>

      {/* Barra de progresso da rolagem */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px]">
        <m.div className="h-full origin-left bg-dono-blue-bright" style={{ scaleX: scrollYProgress }} />
      </div>

      {/* Menu abaixo da barra, fora do fluxo: o header deve ter só 72px de altura,
          senão o backdrop-blur e o fundo cobrem a página inteira no mobile */}
      <AnimatePresence>
        {open && (
          <m.div
            id="menu-site"
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: DURATION.menu, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: DURATION.menuExit, ease: EASE_OUT } }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/[0.06] bg-dono-base px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6 lg:hidden"
          >
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <m.li
                  key={l.href}
                  initial={{ opacity: 0, transform: translateY(10) }}
                  animate={{ opacity: 1, transform: translateY(0), transition: { duration: 0.26, ease: EASE_OUT, delay: 0.04 + i * 0.045 } }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="group flex min-h-14 items-center justify-between rounded-xl px-3 py-3 font-display text-2xl font-bold text-ink transition-colors duration-150 active:bg-white/5">
                    {l.label}
                    <ArrowRight aria-hidden className="size-5 text-ink-subtle" />
                  </a>
                </m.li>
              ))}
            </ul>
            <ButtonLink href="/login" size="lg" className="mt-8 w-full">
              Abra sua conta
            </ButtonLink>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
