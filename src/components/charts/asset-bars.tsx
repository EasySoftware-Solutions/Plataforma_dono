"use client";

import { useState } from "react";
import type { MonthlyIncome } from "@/types";
import { brl, mesCurto, pct } from "@/lib/format";
import { DataTableView, ViewToggle, Swap } from "./chart-kit";
import { AssetBarsChart } from "./lazy";

export function AssetBars({ data, color, invested }: { data: MonthlyIncome[]; color: string; invested: number }) {
  const [table, setTable] = useState(false);
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <ViewToggle table={table} onChange={setTable} />
      </div>
      <Swap id={table ? "tabela" : "grafico"}>
      {table ? (
        <DataTableView
          head={["Mês", "Rendimento", "Sobre o investido"]}
          rows={[...data].reverse().map((d) => [mesCurto(d.mes), brl(d.valor), pct((d.valor / invested) * 100)])}
        />
      ) : (
        <div className="h-[280px]" role="img" aria-label="Rendimento mensal deste ativo">
          <AssetBarsChart data={data} color={color} invested={invested} />
        </div>
      )}
      </Swap>
    </div>
  );
}
