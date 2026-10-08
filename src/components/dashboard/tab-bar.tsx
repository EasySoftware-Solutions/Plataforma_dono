"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "motion/react";
import { SPRING_LAYOUT } from "@/components/motion/tokens";
import { isActive, NAV } from "./nav";

// Navegação principal no celular e tablet: ao alcance do polegar, alvos de 56px de altura,
// respeitando a área segura do iPhone. O indicador desliza entre abas (layoutId).
export function TabBar() {
  const path = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-dono-deep pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-[640px] grid-cols-4">
        {NAV.map(({ href, short, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold transition-colors duration-150 active:bg-white/[0.04] ${
                  active ? "text-dono-blue-bright" : "text-ink-subtle"
                }`}
              >
                {active && (
                  <m.span
                    layoutId="tab-indicator"
                    transition={SPRING_LAYOUT}
                    aria-hidden
                    className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-dono-blue-bright"
                  />
                )}
                <Icon aria-hidden className="size-[22px]" strokeWidth={active ? 2.3 : 2} />
                <span className="max-w-full truncate">{short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
