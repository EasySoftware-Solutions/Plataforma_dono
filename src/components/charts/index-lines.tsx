"use client";

import { useState } from "react";
import type { IndexRow, SerieKey } from "@/lib/calc";
import { mesCurto, mesLongo, pct } from "@/lib/format";
import { SERIES } from "@/lib/series";
import { DataTableView, Legend, ViewToggle, Swap } from "./chart-kit";
import { IndexLinesChart } from "./lazy";

export function IndexLines({ rows, series, height = 340, toggle = true }: { rows: IndexRow[]; series: SerieKey[]; height?: number; toggle?: boolean }) {
  const [table, setTable] = useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Legend items={series.map((s) => ({ label: SERIES[s].nome, color: SERIES[s].cor }))} />
        {toggle && <ViewToggle table={table} onChange={setTable} />}
      </div>
      <Swap id={table ? "tabela" : "grafico"}>
      {table ? (
        <DataTableView
          head={["Mês", ...series.map((s) => SERIES[s].nome)]}
          rows={[...rows].reverse().map((r) => [mesCurto(r.mes), ...series.map((s) => pct(r[s] - 100, { sign: true }))])}
        />
      ) : (
        <div style={{ height }} role="img" aria-label={`Rentabilidade acumulada em base 100 de ${mesLongo(rows[0].mes)} a ${mesLongo(rows[rows.length - 1].mes)}`}>
          <IndexLinesChart rows={rows} series={series} />
        </div>
      )}
      </Swap>
    </div>
  );
}
