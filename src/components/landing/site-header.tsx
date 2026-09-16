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

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? "bg-crp-navy/95 backdrop-blur-md" : "bg-transparent"}`}>
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
                <a href={l.href} className="rounded-pill px-3.5 py-2 text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link href="/login" className="hidden items-center gap-1.5 text-[15px] font-semibold text-ink hover:text-crp-blue-bright sm:inline-flex">
            Acesse sua conta <ArrowRight aria-hidden className="size-4" />
          </Link>
          <ButtonLink href="/login" size="sm" className="sm:h-11 sm:px-6 sm:text-[15px]">
            Acessar plataforma
          </ButtonLink>
        </div>
      </div>

      {open && (
        <div id="menu-site" className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/10 bg-crp-navy px-5 pb-10 pt-6 lg:hidden">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-4 text-2xl font-bold text-ink hover:bg-white/5">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="/login" size="lg" className="mt-8 w-full">
            Acessar plataforma
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
