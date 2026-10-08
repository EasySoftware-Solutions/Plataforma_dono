"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_OUT, translateY } from "@/components/motion/tokens";

// Entrada da folha de login: sobe 28px com fade. Momento raro, então pode ter um respiro
// maior que a UI recorrente. Em movimento reduzido o MotionConfig mantém só o fade.
export function LoginSheet({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.section
      className={className}
      initial={{ opacity: 0, transform: translateY(28) }}
      animate={{ opacity: 1, transform: translateY(0) }}
      transition={{ duration: DURATION.section - 0.1, ease: EASE_OUT }}
    >
      {children}
    </m.section>
  );
}
