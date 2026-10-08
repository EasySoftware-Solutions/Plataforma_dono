"use client";

import { useId } from "react";
import { m } from "motion/react";
import { SPRING_LAYOUT } from "@/components/motion/tokens";

// A pílula ativa desliza entre as opções (layoutId). O id é único por instância, para
// duas barras segmentadas na mesma página não disputarem a mesma pílula.
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  tone = "dark",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  tone?: "dark" | "light";
}) {
  const id = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`flex w-full rounded-pill p-1 sm:inline-flex sm:w-auto ${tone === "dark" ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative h-11 flex-1 rounded-pill px-3.5 text-sm font-semibold transition-colors duration-150 sm:h-8 sm:flex-none [@media(pointer:coarse)]:h-11 ${
              active ? "text-ink-dark" : tone === "dark" ? "text-ink-subtle hover:text-ink" : "text-ink-dark-muted hover:text-ink-dark"
            }`}
          >
            {active && (
              <m.span
                layoutId={id}
                transition={SPRING_LAYOUT}
                aria-hidden
                className="absolute inset-0 rounded-pill bg-ink shadow-[0_6px_16px_-8px_rgba(11,18,48,0.45)]"
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
