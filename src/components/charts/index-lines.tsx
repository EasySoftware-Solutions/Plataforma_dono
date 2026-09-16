"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { IndexRow, SerieKey } from "@/lib/calc";
import { mesCurto, mesLongo, pct } from "@/lib/format";
import { SERIES } from "@/lib/series";
import { AXIS, DataTableView, GRID, Legend, TooltipBox, ViewToggle } from "./chart-kit";

export function IndexLines({ rows, series, height = 340, toggle = true }: { rows: IndexRow[]; series: SerieKey[]; height?: number; toggle?: boolean }) {
  const [table, setTable] = useState(false);
  const ordered = [...series].sort((a, b) => (a === "dono" ? 1 : b === "dono" ? -1 : 0));
  const values = rows.flatMap((r) => series.map((s) => r[s]));
  const min = Math.min(100, Math.floor(Math.min(...values)));
  const max = Math.ceil(Math.max(...values) + 0.5);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Legend items={series.map((s) => ({ label: SERIES[s].nome, color: SERIES[s].cor }))} />
        {toggle && <ViewToggle table={table} onChange={setTable} />}
      </div>
      {table ? (
        <DataTableView
          head={["Mês", ...series.map((s) => SERIES[s].nome)]}
          rows={[...rows].reverse().map((r) => [mesCurto(r.mes), ...series.map((s) => pct(r[s] - 100, { sign: true }))])}
        />
      ) : (
        <div style={{ height }} role="img" aria-label={`Rentabilidade acumulada em base 100 de ${mesLongo(rows[0].mes)} a ${mesLongo(rows[rows.length - 1].mes)}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="mes" tickFormatter={mesCurto} {...AXIS} minTickGap={16} />
              <YAxis domain={[min, max]} tickFormatter={(v: number) => pct(v - 100, { digits: 0, sign: true })} {...AXIS} width={52} />
              <ReferenceLine y={100} stroke="rgba(255,255,255,0.22)" />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <TooltipBox
                      title={`Acumulado até ${mesLongo(String(label))}`}
                      rows={[...series]
                        .sort((a, b) => (payload[0].payload as IndexRow)[b] - (payload[0].payload as IndexRow)[a])
                        .map((s) => ({ label: SERIES[s].nome, value: pct((payload[0].payload as IndexRow)[s] - 100, { sign: true }), color: SERIES[s].cor, strong: s === "dono" }))}
                    />
                  ) : null
                }
              />
              {ordered.map((s) => (
                <Line
                  key={s}
                  dataKey={s}
                  type="monotone"
                  stroke={SERIES[s].cor}
                  strokeWidth={s === "dono" ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 5, stroke: "#182054", strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
