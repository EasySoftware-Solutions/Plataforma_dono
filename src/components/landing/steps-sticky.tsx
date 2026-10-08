"use client";

import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "motion/react";

type Step = { t: string; d: string };

// Desktop: título fixo à esquerda e etapas à direita; a etapa em foco acompanha a rolagem.
// Celular: lista simples e legível, sem escurecer nada. O índice ativo só vira estado
// quando muda de etapa; o trilho de progresso é um MotionValue ligado ao estilo.
export function StepsSticky({ title, steps }: { title: string; steps: Step[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.5", "end 0.5"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))));

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
      <h2 className="max-w-[16ch] font-display text-[clamp(1.75rem,3.8vw,2.75rem)] font-extrabold uppercase leading-[1.04] tracking-[-0.01em] lg:sticky lg:top-32 lg:self-start">
        {title}
      </h2>
      <div className="relative pl-7 sm:pl-9">
        <div aria-hidden className="absolute bottom-0 left-0 top-0 w-[2px] rounded-full bg-ink-dark/10">
          <m.div className="h-full origin-top rounded-full bg-dono-blue" style={{ scaleY: scrollYProgress }} />
        </div>
        <ol ref={listRef} className="space-y-14 lg:space-y-0">
          {steps.map((s, i) => (
            <li key={s.t} className="lg:flex lg:min-h-[46vh] lg:flex-col lg:justify-center">
              <div className={`transition-opacity duration-300 ease-out-expo lg:opacity-30 ${i === active ? "lg:opacity-100" : ""}`}>
                <h3 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-3 max-w-[42ch] text-[17px] leading-relaxed text-ink-dark-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
