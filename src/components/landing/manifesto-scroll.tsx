"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";

// Cada palavra acende conforme a rolagem avança pelo bloco. Os valores são
// MotionValues ligados ao estilo: nenhuma re-renderização durante a rolagem.
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <m.span style={{ opacity }} className="inline-block">
      {children}
    </m.span>
  );
}

export function ManifestoScroll({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });
  const words = text.split(" ");

  return (
    <h2 ref={ref} className={className}>
      {/* Texto completo para leitores de tela; as palavras animadas ficam escondidas deles */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <Word progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2.5) / words.length)]}>
              {w}
            </Word>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </h2>
  );
}
