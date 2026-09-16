"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AssetType } from "@/types";
import type { IncomeRow } from "@/lib/calc";
import { TIPOS, TIPO_ORDEM } from "@/lib/constants";
import { brl, brlCompact, mesCurto, mesLongo } from "@/lib/format";
import { AXIS, DataTableView, GRID, Legend, TooltipBox, ViewToggle } from "./chart-kit";

export function IncomeBars({ rows, height = 300, toggle = true }: { rows: IncomeRow[]; height?: number; toggle?: boolean }) {
  const [table, setTable] = useState(false);
  const tipos = TIPO_ORDEM.filter((t) => rows.some((r) => r[t] > 0));
  const topo = tipos[tipos.length - 1];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Legend items={tipos.map((t) => ({ label: TIPOS[t].nome, color: TIPOS[t].cor }))} />
        {toggle && <ViewToggle table={table} onChange={setTable} />}
      </div>
      {table ? (
        <DataTableView
          head={["Mês", ...tipos.map((t) => TIPOS[t].nome), "Total"]}
          rows={[...rows].reverse().map((r) => [mesCurto(r.mes), ...tipos.map((t) => brl(r[t])), brl(r.total)])}
        />
      ) : (
        <div style={{ height }} role="img" aria-label={`Rendimentos mensais por tipo de ativo, ${mesLongo(rows[0].mes)} a ${mesLongo(rows[rows.length - 1].mes)}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="22%">
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="mes" tickFormatter={mesCurto} {...AXIS} minTickGap={12} />
              <YAxis tickFormatter={(v: number) => brlCompact(v)} {...AXIS} width={72} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <TooltipBox
                      title={mesLongo(String(label))}
                      rows={[
                        ...[...tipos].reverse().map((t) => ({ label: TIPOS[t].nome, value: brl((payload[0].payload as IncomeRow)[t]), color: TIPOS[t].cor })),
                        { label: "Total", value: brl((payload[0].payload as IncomeRow).total), strong: true },
                      ]}
                    />
                  ) : null
                }
              />
              {tipos.map((t: AssetType) => (
                <Bar
                  key={t}
                  dataKey={t}
                  stackId="renda"
                  fill={TIPOS[t].cor}
                  stroke="#1f1f1f"
                  strokeWidth={1}
                  radius={t === topo ? [4, 4, 0, 0] : 0}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
