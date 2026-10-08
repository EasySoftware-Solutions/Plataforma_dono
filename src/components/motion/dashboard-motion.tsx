"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("./features-max").then((m) => m.default);

// Substitui o provider raiz dentro do dashboard por um que carrega domMax (layout
// animations) de forma assíncrona. Enquanto não carrega, os <m.*> renderizam estáticos.
export function DashboardMotion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
