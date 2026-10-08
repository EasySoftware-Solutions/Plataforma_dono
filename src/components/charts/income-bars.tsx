"use client";

import { useState } from "react";
import type { IncomeRow } from "@/lib/calc";
import { TIPOS, TIPO_ORDEM } from "@/lib/constants";
import { brl, mesCurto, mesLongo } from "@/lib/format";
import { DataTableView, Legend, ViewToggle, Swap } from "./chart-kit";
import { IncomeBarsChart } from "./lazy";

export function IncomeBars({ rows, height = 300, toggle = true }: { rows: IncomeRow[]; height?: number; toggle?: boolean }) {
  const [table, setTable] = useState(false);
  const tipos = TIPO_ORDEM.filter((t) => rows.some((r) => r[t] > 0));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Legend items={tipos.map((t) => ({ label: TIPOS[t].nome, color: TIPOS[t].cor }))} />
        {toggle && <ViewToggle table={table} onChange={setTable} />}
      </div>
      <Swap id={table ? "tabela" : "grafico"}>
      {table ? (
        <DataTableView
          head={["Mês", ...tipos.map((t) => TIPOS[t].nome), "Total"]}
          rows={[...rows].reverse().map((r) => [mesCurto(r.mes), ...tipos.map((t) => brl(r[t])), brl(r.total)])}
        />
      ) : (
        <div style={{ height }} role="img" aria-label={`Rendimentos mensais por tipo de ativo, ${mesLongo(rows[0].mes)} a ${mesLongo(rows[rows.length - 1].mes)}`}>
          <IncomeBarsChart rows={rows} tipos={tipos} />
        </div>
      )}
      </Swap>
    </div>
  );
}
