"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { href: "#manifesto", label: "A DONO" },
  { href: "#ativos", label: "Ativos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#plataforma", label: "Plataforma" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? "border-b border-white/[0.06] bg-crp-navy lg:bg-crp-navy/90 lg:backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-site"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="-ml-2 flex size-10 items-center justify-center rounded-full text-ink hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
        <Logo />
        <nav aria-label="Seções" className="ml-10 hidden lg:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative rounded-pill px-3.5 py-2 text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink">
                  {l.label}
                  <span aria-hidden className="absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-crp-blue-bright to-crp-gold transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link href="/login" className="hidden items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors hover:text-crp-blue-bright sm:inline-flex">
            Acesse sua conta <ArrowRight aria-hidden className="size-4" />
          </Link>
          <ButtonLink href="/login" size="sm" className="sm:h-11 sm:px-6 sm:text-[15px]">
            Abra sua conta
          </ButtonLink>
        </div>
      </div>

      {/* Barra de progresso da rolagem */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px]">
        <div
          className="h-full origin-left bg-gradient-to-r from-crp-blue via-crp-blue-hover to-crp-gold transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Menu abaixo da barra, fora do fluxo: o header deve ter só 72px de altura,
          senão o backdrop-blur/fundo cobrem a página inteira no mobile */}
      <div
        id="menu-site"
        inert={!open}
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/[0.06] bg-crp-navy px-5 pb-10 pt-6 transition-[opacity,transform] duration-300 ease-out-expo lg:hidden ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}
      >
        <ul className="space-y-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-xl px-3 py-4 text-2xl font-bold text-ink transition-colors hover:bg-white/5">
                {l.label}
                <ArrowRight aria-hidden className="size-5 text-ink-subtle transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:text-crp-blue-bright" />
              </a>
            </li>
          ))}
        </ul>
        <ButtonLink href="/login" size="lg" className="mt-8 w-full">
          Abra sua conta
        </ButtonLink>
      </div>
    </header>
  );
}
