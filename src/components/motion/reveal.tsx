"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_OUT, translateY } from "./tokens";

// Entrada ao rolar para blocos da landing. Parte de um estado já quase visível
// (24px e opacidade) e usa a string `transform` completa para rodar no compositor.
// Com movimento reduzido o MotionConfig remove o deslocamento e mantém só o fade.
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, transform: translateY(y) }}
      whileInView={{ opacity: 1, transform: translateY(0) }}
      viewport={{ once: true, amount, margin: "0px 0px -6% 0px" }}
      transition={{ duration: DURATION.section, ease: EASE_OUT, delay }}
    >
      {children}
    </m.div>
  );
}
