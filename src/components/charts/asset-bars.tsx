"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyIncome } from "@/types";
import { brl, brlCompact, mesCurto, mesLongo, pct } from "@/lib/format";
import { AXIS, DataTableView, GRID, TooltipBox, ViewToggle } from "./chart-kit";

export function AssetBars({ data, color, invested }: { data: MonthlyIncome[]; color: string; invested: number }) {
  const [table, setTable] = useState(false);
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <ViewToggle table={table} onChange={setTable} />
      </div>
      {table ? (
        <DataTableView
          head={["Mês", "Rendimento", "Sobre o investido"]}
          rows={[...data].reverse().map((d) => [mesCurto(d.mes), brl(d.valor), pct((d.valor / invested) * 100)])}
        />
      ) : (
        <div className="h-[280px]" role="img" aria-label="Rendimento mensal deste ativo">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="24%">
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="mes" tickFormatter={mesCurto} {...AXIS} minTickGap={12} />
              <YAxis tickFormatter={(v: number) => brlCompact(v)} {...AXIS} width={68} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <TooltipBox
                      title={mesLongo(String(label))}
                      rows={[
                        { label: "Rendimento", value: brl(Number(payload[0].value)), color, strong: true },
                        { label: "Sobre o investido", value: pct((Number(payload[0].value) / invested) * 100) },
                      ]}
                    />
                  ) : null
                }
              />
              <Bar dataKey="valor" fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
