"use client";

import { m } from "motion/react";
import { DURATION, EASE_OUT } from "@/components/motion/tokens";

// Diferente do layout, o template remonta a cada navegação. A troca de aba acontece
// dezenas de vezes por dia, então a transição é só um fade curto: sem deslocamento.
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DURATION.route, ease: EASE_OUT }}>
      {children}
    </m.div>
  );
}
