"use client";

import { Table2, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { m } from "motion/react";
import { DURATION, EASE_OUT } from "@/components/motion/tokens";

export const AXIS = { stroke: "transparent", tick: { fill: "var(--chart-axis)", fontSize: 12 }, tickLine: false, axisLine: false } as const;
export const GRID = "var(--chart-grid)";

export function TooltipBox({ title, rows, footer }: { title: string; rows: { label: string; value: string; color?: string; strong?: boolean }[]; footer?: ReactNode }) {
  return (
    <div className="min-w-[200px] rounded-xl bg-dono-surface-2 px-3.5 py-3 text-sm shadow-[0_16px_40px_-12px_rgba(11,18,48,0.4)] ring-1 ring-white/10">
      <p className="mb-2 font-semibold text-ink">{title}</p>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-ink-muted">
              {r.color && <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: r.color }} />}
              {r.label}
            </span>
            <span className={`num ${r.strong ? "font-bold text-ink" : "font-medium text-ink"}`}>{r.value}</span>
          </li>
        ))}
      </ul>
      {footer && <div className="mt-2 border-t border-white/10 pt-2 text-xs text-ink-subtle">{footer}</div>}
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          {i.dashed ? (
            <span aria-hidden className="h-0.5 w-4 rounded" style={{ background: `repeating-linear-gradient(90deg, ${i.color} 0 4px, transparent 4px 7px)` }} />
          ) : (
            <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: i.color }} />
          )}
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export function ViewToggle({ table, onChange }: { table: boolean; onChange: (t: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!table)}
      className="inline-flex h-11 items-center gap-1.5 rounded-pill px-3 text-sm font-semibold text-ink-subtle transition-colors duration-150 hover:bg-white/[0.08] hover:text-ink sm:h-8 [@media(pointer:coarse)]:h-11"
    >
      {table ? <BarChart3 aria-hidden className="size-4" /> : <Table2 aria-hidden className="size-4" />}
      {table ? "Ver gráfico" : "Ver tabela"}
    </button>
  );
}

export function DataTableView({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <>
      {/* Mobile: um cartão por linha, sem rolagem lateral */}
      <ul className="max-h-[320px] space-y-2 overflow-y-auto sm:hidden">
        {rows.map((r, ri) => (
          <li key={ri} className="rounded-xl bg-white/[0.03] px-3.5 py-3 ring-1 ring-inset ring-white/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">{r[0]}</p>
            <dl className="mt-2 space-y-1.5">
              {r.slice(1).map((c, ci) => (
                <div key={ci} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-ink-muted">{head[ci + 1]}</dt>
                  <dd className="num font-medium text-ink">{c}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      {/* Tablet/desktop: tabela */}
      <div className="hidden max-h-[320px] overflow-auto rounded-xl sm:block">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="sticky top-0 bg-dono-surface">
            <tr>
              {head.map((h, i) => (
                <th key={h} className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle ${i ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-white/[0.06]">
                {r.map((c, i) => (
                  <td key={i} className={`num px-3 py-2 ${i ? "text-right text-ink" : "text-left text-ink-muted"}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Troca gráfico <-> tabela no mesmo lugar: fade de entrada curto. A saída é instantânea
// de propósito, para a troca ser interrompível e nunca deixar dois conteúdos empilhados.
export function Swap({ id, children }: { id: string; children: ReactNode }) {
  return (
    <m.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DURATION.swap, ease: EASE_OUT }}>
      {children}
    </m.div>
  );
}
