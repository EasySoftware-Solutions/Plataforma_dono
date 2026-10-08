"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import type { Asset, AssetStatus, AssetType } from "@/types";
import { desempenhoAtivo } from "@/lib/calc";
import { MESES_HISTORICO, STATUS_ATIVO, TIPOS, TIPO_ORDEM } from "@/lib/constants";
import { brl, data, pct } from "@/lib/format";
import { Segmented } from "@/components/ui/segmented";
import { AssetStatusBadge } from "@/components/ui/status";
import { EmptyState } from "@/components/ui/panel";

type Periodo = "3" | "12" | "24";
type SortKey = "nome" | "investido" | "renda" | "yield";
type Sort = { key: SortKey; desc: boolean };

// Fora do componente pai: definido dentro do render, o botão seria recriado a cada
// ordenação e o foco do teclado se perderia.
function SortHeader({ k, sort, onSort, children, right }: { k: SortKey; sort: Sort; onSort: (s: Sort) => void; children: ReactNode; right?: boolean }) {
  const active = sort.key === k;
  return (
    <th scope="col" aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"} className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] ${right ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort({ key: k, desc: active ? !sort.desc : k !== "nome" })}
        className={`inline-flex items-center gap-1 transition-colors hover:text-ink ${active ? "text-dono-blue-bright" : ""}`}
      >
        {children}
        {active && (sort.desc ? <ArrowDown aria-hidden className="size-3.5" /> : <ArrowUp aria-hidden className="size-3.5" />)}
      </button>
    </th>
  );
}

export function AssetsTable({ assets }: { assets: Asset[] }) {
  const [tipo, setTipo] = useState<AssetType | "todos">("todos");
  const [status, setStatus] = useState<AssetStatus | "todos">("todos");
  const [periodo, setPeriodo] = useState<Periodo>("12");
  const [sort, setSort] = useState<Sort>({ key: "investido", desc: true });

  // Desempenho só muda com o período; filtros e ordenação reaproveitam o cálculo.
  const desempenho = useMemo(() => {
    const meses = MESES_HISTORICO.slice(-Number(periodo));
    return assets.map((a) => ({ a, ...desempenhoAtivo(a, meses) }));
  }, [assets, periodo]);

  const rows = useMemo(
    () =>
      desempenho
        .filter(({ a }) => (tipo === "todos" || a.tipo === tipo) && (status === "todos" || a.status === status))
        .sort((x, y) => {
          const v =
            sort.key === "nome" ? x.a.nome.localeCompare(y.a.nome) :
            sort.key === "investido" ? x.a.valorInvestido - y.a.valorInvestido :
            sort.key === "renda" ? x.renda - y.renda : x.yieldMedio - y.yieldMedio;
          return sort.desc ? -v : v;
        }),
    [desempenho, tipo, status, sort],
  );

  const totalInvestido = rows.reduce((s, r) => s + r.a.valorInvestido, 0);
  const totalRenda = rows.reduce((s, r) => s + r.renda, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <div className="flex flex-wrap gap-2">
          {(["todos", ...TIPO_ORDEM.filter((t) => assets.some((a) => a.tipo === t))] as const).map((t) => {
            const active = tipo === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => setTipo(t)}
                className={`flex h-10 items-center justify-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors md:h-9 ${
                  active ? "bg-ink text-ink-dark" : "bg-white/[0.06] text-ink-muted hover:bg-white/10 hover:text-ink"
                }`}
              >
                {t !== "todos" && <span aria-hidden className="size-2 rounded-full" style={{ background: TIPOS[t].cor }} />}
                {t === "todos" ? "Todos" : TIPOS[t].nome}
              </button>
            );
          })}
        </div>
        <label className="sr-only" htmlFor="filtro-status">Status</label>
        <select
          id="filtro-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AssetStatus | "todos")}
          className="h-11 w-full rounded-xl bg-white/[0.06] px-4 text-sm font-semibold text-ink-muted outline-none hover:bg-white/10 md:h-9 md:w-auto md:rounded-pill"
        >
          <option value="todos">Todos os status</option>
          {(Object.keys(STATUS_ATIVO) as AssetStatus[]).filter((s) => assets.some((a) => a.status === s)).map((s) => (
            <option key={s} value={s}>{STATUS_ATIVO[s]}</option>
          ))}
        </select>
        <div className="md:ml-auto">
          <Segmented
            label="Período do rendimento"
            value={periodo}
            onChange={setPeriodo}
            options={[
              { value: "3", label: "3 meses" },
              { value: "12", label: "12 meses" },
              { value: "24", label: "24 meses" },
            ]}
          />
        </div>
      </div>

      <section className="card-elev overflow-hidden rounded-card">
        {rows.length === 0 ? (
          <EmptyState title="Nenhum ativo com esses filtros">
            Troque o tipo ou o status para ver outras posições da sua carteira.
          </EmptyState>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[860px] text-sm">
                <caption className="sr-only">Seus ativos, rendimento dos últimos {periodo} meses</caption>
                <thead className="text-ink-subtle">
                  <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                    <SortHeader k="nome" sort={sort} onSort={setSort}>Ativo</SortHeader>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.08em]">Status</th>
                    <SortHeader k="investido" right sort={sort} onSort={setSort}>Investido</SortHeader>
                    <SortHeader k="renda" right sort={sort} onSort={setSort}>Rendimento {periodo}m</SortHeader>
                    <SortHeader k="yield" right sort={sort} onSort={setSort}>Rentabilidade/mês</SortHeader>
                    <th scope="col"><span className="sr-only">Abrir</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ a, renda, yieldMedio }) => (
                    <tr key={a.id} className="group border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                      <td className="px-4 py-4">
                        <Link href={`/ativos/${a.id}`} className="flex items-center gap-3 rounded-lg hover:[&_span.block:first-child]:text-dono-blue-bright">
                          <span aria-hidden className="h-10 w-1 rounded-full" style={{ background: TIPOS[a.tipo].cor }} />
                          <span>
                            <span className="block text-[15px] font-semibold text-ink">{a.nome}</span>
                            <span className="block text-ink-subtle">
                              {TIPOS[a.tipo].nome} · {a.cidade}/{a.uf} · desde {data(a.dataAquisicao)}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-4"><AssetStatusBadge status={a.status} /></td>
                      <td className="num px-4 py-4 text-right font-semibold text-ink">{brl(a.valorInvestido)}</td>
                      <td className="num px-4 py-4 text-right font-semibold text-ink">{renda ? brl(renda) : "-"}</td>
                      <td className="num px-4 py-4 text-right text-ink-muted">{yieldMedio ? pct(yieldMedio) : "-"}</td>
                      <td className="pr-4 text-right">
                        <ChevronRight aria-hidden className="ml-auto size-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10 bg-white/[0.02]">
                    <td className="px-4 py-4 font-semibold text-ink" colSpan={2}>{rows.length} {rows.length === 1 ? "ativo" : "ativos"}</td>
                    <td className="num px-4 py-4 text-right font-bold text-ink">{brl(totalInvestido)}</td>
                    <td className="num px-4 py-4 text-right font-bold text-ink">{brl(totalRenda)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            <ul className="divide-y divide-white/[0.06] xl:hidden">
              {rows.map(({ a, renda, yieldMedio }) => (
                <li key={a.id}>
                  <Link href={`/ativos/${a.id}`} className="flex gap-3 p-4 active:bg-white/[0.04]">
                    <span aria-hidden className="w-1 shrink-0 rounded-full" style={{ background: TIPOS[a.tipo].cor }} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-ink">{a.nome}</span>
                        <span className="num shrink-0 text-sm font-bold text-dono-blue-bright">
                          {yieldMedio ? pct(yieldMedio) : "-"}
                          <span className="font-medium text-ink-subtle">/mês</span>
                        </span>
                      </span>
                      <span className="block text-sm text-ink-subtle">{TIPOS[a.tipo].nome} · {a.cidade}/{a.uf}</span>
                      <span className="mt-2 block"><AssetStatusBadge status={a.status} /></span>
                      <span className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <span><span className="block text-ink-subtle">Investido</span><span className="num font-semibold text-ink">{brl(a.valorInvestido)}</span></span>
                        <span><span className="block text-ink-subtle">Rendimento {periodo}m</span><span className="num font-semibold text-ink">{renda ? brl(renda) : "-"}</span></span>
                      </span>
                    </span>
                    <ChevronRight aria-hidden className="size-4 self-center text-ink-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
