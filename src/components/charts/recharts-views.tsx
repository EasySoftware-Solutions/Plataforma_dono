"use client";

// Tudo que depende de recharts fica neste módulo, carregado sob demanda pelos
// wrappers (ver lazy.tsx). Assim a biblioteca sai do bundle inicial das páginas.
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AssetType, MonthlyIncome } from "@/types";
import type { IncomeRow, IndexRow, SerieKey } from "@/lib/calc";
import { TIPOS } from "@/lib/constants";
import { brl, brlCompact, mesCurto, mesLongo, pct } from "@/lib/format";
import { SERIES } from "@/lib/series";
import { AXIS, GRID, TooltipBox } from "./chart-kit";

export function IncomeBarsChart({ rows, tipos }: { rows: IncomeRow[]; tipos: AssetType[] }) {
  const topo = tipos[tipos.length - 1];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="mes" tickFormatter={mesCurto} {...AXIS} minTickGap={12} />
        <YAxis tickFormatter={(v: number) => brlCompact(v)} {...AXIS} width={72} />
        <Tooltip
          cursor={{ fill: "var(--chart-cursor)" }}
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
        {tipos.map((t) => (
          <Bar
            key={t}
            dataKey={t}
            stackId="renda"
            fill={TIPOS[t].cor}
            stroke="var(--chart-sep)"
            strokeWidth={1}
            radius={t === topo ? [4, 4, 0, 0] : 0}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IndexLinesChart({ rows, series }: { rows: IndexRow[]; series: SerieKey[] }) {
  // A linha da carteira DONO é desenhada por último para ficar por cima das demais.
  const ordered = [...series].sort((a, b) => (a === "dono" ? 1 : b === "dono" ? -1 : 0));
  const values = rows.flatMap((r) => series.map((s) => r[s]));
  const min = Math.min(100, Math.floor(Math.min(...values)));
  const max = Math.ceil(Math.max(...values) + 0.5);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="mes" tickFormatter={mesCurto} {...AXIS} minTickGap={16} />
        <YAxis domain={[min, max]} tickFormatter={(v: number) => pct(v - 100, { digits: 0, sign: true })} {...AXIS} width={52} />
        <ReferenceLine y={100} stroke="var(--chart-ref)" />
        <Tooltip
          cursor={{ stroke: "var(--chart-cursor-line)", strokeWidth: 1 }}
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
            activeDot={{ r: 5, stroke: "var(--chart-dot)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AssetBarsChart({ data, color, invested }: { data: MonthlyIncome[]; color: string; invested: number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="24%">
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="mes" tickFormatter={mesCurto} {...AXIS} minTickGap={12} />
        <YAxis tickFormatter={(v: number) => brlCompact(v)} {...AXIS} width={68} />
        <Tooltip
          cursor={{ fill: "var(--chart-cursor)" }}
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
  );
}
