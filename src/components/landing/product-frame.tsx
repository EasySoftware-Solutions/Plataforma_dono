"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useScroll, useTransform } from "motion/react";

// A moldura "assenta" conforme entra na tela: inclinação, escala e deslocamento ligados
// à rolagem. Só em telas grandes e sem preferência de movimento reduzido; fora disso
// o conteúdo aparece já em repouso (visível por padrão, sem custo de compositor no celular).
export function ProductFrame({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fancy, setFancy] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setFancy(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div ref={ref} className="mt-12 sm:mt-14" style={{ perspective: 1600 }}>
      <m.div
        inert
        role="img"
        aria-label={label}
        style={fancy ? { rotateX, scale, y, transformOrigin: "50% 0%" } : undefined}
        className="relative rounded-[24px] bg-dono-base p-3 shadow-[0_40px_120px_-30px_rgba(72,43,116,0.45)] ring-1 ring-white/10 sm:p-6"
      >
        {children}
      </m.div>
    </div>
  );
}
