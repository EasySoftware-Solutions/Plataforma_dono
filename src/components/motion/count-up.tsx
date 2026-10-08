"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { brl, pct } from "@/lib/format";
import { EASE_OUT } from "./tokens";

type Kind = "brl" | "pct";

// Contagem de entrada para números da landing (momento raro, orçamento de deleite).
// O HTML do servidor já traz o valor final: sem JS ou com movimento reduzido nada muda.
// Escreve direto no DOM a cada quadro, sem estado React.
export function CountUp({
  value,
  kind,
  digits = 1,
  sign = false,
  className,
}: {
  value: number;
  kind: Kind;
  digits?: number;
  sign?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const format = (v: number) => (kind === "brl" ? brl(v) : pct(v, { digits, sign }));

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (v) => {
        el.textContent = format(v);
      },
      onComplete: () => {
        el.textContent = format(value);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `format` só depende de kind/digits/sign
  }, [inView, reduce, value, kind, digits, sign]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
