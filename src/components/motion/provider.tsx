"use client";

import type { ReactNode } from "react";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

// `strict` faz qualquer uso de <motion.*> lançar erro: só <m.*> é permitido, e assim o
// pacote de animação entra no bundle uma única vez, de forma controlada.
// reducedMotion="user" obedece à preferência do sistema: remove deslocamentos e mantém fades.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
