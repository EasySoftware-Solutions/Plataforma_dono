"use client";

import { useMemo, useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import type { Asset, MarketMonth } from "@/types";
import { desempenhoAtivo, indiceBase100, MERCADO_KEYS, metricas, rendaAtivoMes, resumo, retornosDono, retornosMercado, type MercadoKey, type SerieKey } from "@/lib/calc";
import { brl, mesLongo, mesNome, pct } from "@/lib/format";
import { exportPdf } from "@/lib/exports";
import { MESES_HISTORICO, ULTIMOS_12 } from "@/lib/constants";
import { IndexLines } from "@/components/charts/index-lines";
import { SERIES } from "@/lib/series";
import { Segmented } from "@/components/ui/segmented";
import { Delta, Panel } from "@/components/ui/panel";

type Periodo = "3" | "6" | "12" | "24";
const MERCADO = MERCADO_KEYS;

export function Comparator({ assets, market }: { assets: Asset[]; market: MarketMonth[] }) {
  const [periodo, setPeriodo] = useState<Periodo>("12");
  const [ativos, setAtivos] = useState<MercadoKey[]>(["cdi", "selic", "itub4", "bbas3"]);
  const [valor, setValor] = useState(100000);
  const [busy, setBusy] = useState(false);

  const r = useMemo(() => resumo(assets), [assets]);
  const metricasDono12 = useMemo(() => metricas(retornosDono(assets, ULTIMOS_12)), [assets]);
  const meses = useMemo(() => MESES_HISTORICO.slice(-Number(periodo)), [periodo]);
  const series = useMemo<SerieKey[]>(() => ["dono", ...MERCADO.filter((m) => ativos.includes(m))], [ativos]);
  const rows = useMemo(() => indiceBase100(market, assets, meses), [market, assets, meses]);

  const tabela = useMemo(
    () =>
      series
        .map((s) => {
          const ret = s === "dono" ? retornosDono(assets, meses) : retornosMercado(market, meses, s);
          const m = metricas(ret);
          return { s, ...m, final: valor * (1 + m.acumulado / 100) };
        })
        .sort((a, b) => b.acumulado - a.acumulado),
    [series, assets, market, meses, valor],
  );
  const dono = tabela.find((t) => t.s === "dono")!;
  const porUsina = useMemo(
    () => assets.map((a) => ({ a, mes: rendaAtivoMes(a, r.mes), ...desempenhoAtivo(a, ULTIMOS_12) })),
    [assets, r.mes],
  );

  const toggle = (k: MercadoKey) =>
    setAtivos((cur) => (cur.includes(k) ? cur.filter((c) => c !== k) : [...cur, k]));

  async function baixar() {
    setBusy(true);
    try {
      await exportPdf({
        titulo: "Comparativo de rentabilidade",
        subtitulo: `${mesLongo(meses[0])} a ${mesLongo(meses[meses.length - 1])} · simulação com ${brl(valor)}`,
        arquivo: `comparativo-${periodo}-meses`,
        colunas: [
          { header: "Série" },
          { header: "Acumulado", align: "right" },
          { header: "Anualizado", align: "right" },
          { header: "Média mensal", align: "right" },
          { header: "Volatilidade mensal", align: "right" },
          { header: "Meses negativos", align: "right" },
          { header: `${brl(valor)} viraria`, align: "right" },
        ],
        linhas: tabela.map((t) => [SERIES[t.s].nome, pct(t.acumulado, { sign: true }), pct(t.anualizado), pct(t.media), pct(t.desvio), t.mesesNegativos, brl(t.final)]),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Destaque inicial: Quanto está rendendo por mês a Carteira DONO */}
      <section className="theme-dark relative overflow-hidden rounded-card border border-white/[0.07] bg-gradient-to-br from-[#15204a] via-dono-surface to-[#070d26] p-5 shadow-[0_20px_44px_-28px_rgba(2,6,22,0.95)] sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <div className="min-w-0 space-y-2">
            <h2 className="text-sm font-semibold text-ink-subtle">Rendimento mensal da carteira DONO</h2>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num text-[34px] font-extrabold tracking-tight text-ink sm:text-[44px]">
                {brl(r.rendaAtual)}
              </span>
              <span className="text-base font-semibold text-ink-subtle">/ mês</span>
              <Delta value={r.variacaoMes} />
            </div>
            <p className="max-w-[65ch] text-sm leading-relaxed text-ink-subtle">
              Renda líquida de {mesNome(r.mes)}: sua participação de 1/3 no faturamento líquido de {r.emOperacao} {r.emOperacao === 1 ? "usina solar em operação" : "usinas solares em operação"}.
            </p>
            <dl className="grid gap-x-6 gap-y-1.5 pt-3 text-sm sm:grid-cols-[auto_1fr_1fr]">
              {porUsina.map((u) => (
                <div key={u.a.id} className="contents">
                  <dt className="font-semibold text-ink">{u.a.nome}</dt>
                  <dd className="num text-ink-muted">{brl(u.mes)} em {mesNome(r.mes)}</dd>
                  <dd className="num text-ink-subtle">{brl(u.renda)} em 12 meses, {pct(u.yieldMedio)} ao mês</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 xl:w-[560px] xl:shrink-0">
            <div className="rounded-xl bg-white/[0.04] p-3.5 ring-1 ring-inset ring-white/[0.08]">
              <span className="block text-xs font-semibold text-ink-subtle">Rentabilidade média mensal</span>
              <span className="num mt-1 block text-lg font-bold text-ink sm:text-xl">{pct(r.yieldMedio)}</span>
              <span className="num mt-0.5 block text-[11px] text-ink-subtle">ao mês (~{pct(metricasDono12.anualizado, { digits: 1 })} a.a.)</span>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-3.5 ring-1 ring-inset ring-white/[0.08]">
              <span className="block text-xs font-semibold text-ink-subtle">Últimos 12 meses</span>
              <span className="num mt-1 block text-lg font-bold text-ink sm:text-xl">{brl(r.acumulado12)}</span>
              <span className="mt-0.5 block text-[11px] text-ink-subtle">renda acumulada no período</span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl bg-white/[0.04] p-3.5 ring-1 ring-inset ring-white/[0.08]">
              <span className="block text-xs font-semibold text-ink-subtle">Meses negativos</span>
              <span className={`num mt-1 block text-lg font-bold sm:text-xl ${metricasDono12.mesesNegativos > 0 ? "text-negative" : "text-positive"}`}>
                {metricasDono12.mesesNegativos} {metricasDono12.mesesNegativos === 1 ? "mês" : "meses"}
              </span>
              <span className="mt-0.5 block text-[11px] text-ink-subtle">estabilidade do fluxo real</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Filtros e Período */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Índices para comparar">
          <span className="mr-1 text-sm font-semibold text-ink-subtle">Comparar com</span>
          {MERCADO.map((k) => {
            const on = ativos.includes(k);
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(k)}
                className={`flex h-9 items-center gap-2 rounded-pill px-3.5 text-sm font-semibold transition-colors ${
                  on ? "bg-white/[0.12] text-ink" : "bg-white/[0.04] text-ink-subtle hover:text-ink"
                }`}
              >
                <span
                  aria-hidden
                  className="flex size-4 items-center justify-center rounded-[5px]"
                  style={{ background: on ? SERIES[k].cor : "transparent", boxShadow: on ? "none" : "inset 0 0 0 1.5px #4a5488" }}
                >
                  {on && <Check className="size-3 text-ink" strokeWidth={3} />}
                </span>
                {SERIES[k].nome}
              </button>
            );
          })}
        </div>
        <Segmented
          label="Período"
          value={periodo}
          onChange={setPeriodo}
          options={[
            { value: "3", label: "3m" },
            { value: "6", label: "6m" },
            { value: "12", label: "1 ano" },
            { value: "24", label: "2 anos" },
          ]}
        />
      </div>

      <Panel
        title="Rentabilidade acumulada"
        description={`${mesLongo(meses[0])} a ${mesLongo(meses[meses.length - 1])}. Todas as séries partem do mesmo ponto.`}
      >
        <IndexLines rows={rows} series={series} />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel
          title="Métricas do período"
          actions={
            <button
              type="button"
              onClick={baixar}
              disabled={busy}
              className="inline-flex h-9 items-center gap-2 rounded-pill bg-white/[0.08] px-4 text-sm font-semibold text-ink hover:bg-white/[0.14] disabled:opacity-60"
            >
              {busy ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Download aria-hidden className="size-4" />}
              Exportar PDF
            </button>
          }
          bodyClassName="!px-0 sm:!px-0"
        >
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-ink-subtle">
                <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.08em] sm:px-6">Série</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.08em]">Acumulado</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.08em]">Anualizado</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.08em]">Volatilidade</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.08em] sm:px-6">Meses negativos</th>
                </tr>
              </thead>
              <tbody>
                {tabela.map((t) => (
                  <tr key={t.s} className={`border-b border-white/[0.05] last:border-0 ${t.s === "dono" ? "bg-white/[0.03]" : ""}`}>
                    <th scope="row" className="px-5 py-3.5 text-left font-semibold text-ink sm:px-6">
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: SERIES[t.s].cor }} />
                        {SERIES[t.s].nome}
                      </span>
                    </th>
                    <td className={`num px-3 py-3.5 text-right font-semibold ${t.acumulado < 0 ? "text-negative" : "text-ink"}`}>{pct(t.acumulado, { sign: true })}</td>
                    <td className="num px-3 py-3.5 text-right text-ink-muted">{pct(t.anualizado)}</td>
                    <td className="num px-3 py-3.5 text-right text-ink-muted">{pct(t.desvio)}</td>
                    <td className="num px-5 py-3.5 text-right text-ink-muted sm:px-6">{t.mesesNegativos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-white/[0.06] px-5 md:hidden sm:px-6">
            {tabela.map((t) => (
              <li key={t.s} className="py-4 first:pt-2 last:pb-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                    <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: SERIES[t.s].cor }} />
                    {SERIES[t.s].nome}
                  </span>
                  <span className={`num text-lg font-bold ${t.acumulado < 0 ? "text-negative" : "text-ink"}`}>{pct(t.acumulado, { sign: true })}</span>
                </div>
                <dl className="mt-2.5 grid grid-cols-3 gap-2">
                  <div>
                    <dt className="text-xs text-ink-subtle">Anualizado</dt>
                    <dd className="num mt-0.5 text-sm font-medium text-ink-muted">{pct(t.anualizado)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-subtle">Volatilidade</dt>
                    <dd className="num mt-0.5 text-sm font-medium text-ink-muted">{pct(t.desvio)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-subtle">Meses negativos</dt>
                    <dd className="num mt-0.5 text-sm font-medium text-ink-muted">{t.mesesNegativos}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Simulação em reais">
          <label htmlFor="valor-sim" className="text-sm text-ink-subtle">Valor aplicado no início do período</label>
          <div className="mt-2 flex h-12 items-center rounded-xl bg-white/[0.06] px-4 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-dono-blue-bright">
            <span className="text-ink-subtle">R$</span>
            <input
              id="valor-sim"
              inputMode="numeric"
              value={valor.toLocaleString("pt-BR")}
              onChange={(e) => setValor(Math.min(1e9, Number(e.target.value.replace(/\D/g, "")) || 0))}
              className="num h-full w-full bg-transparent pl-2 text-lg font-semibold text-ink outline-none"
            />
          </div>
          <ul className="mt-5 space-y-3">
            {tabela.map((t) => (
              <li key={t.s} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-ink-muted">
                  <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: SERIES[t.s].cor }} />
                  {SERIES[t.s].nome}
                </span>
                <span className="text-right">
                  <span className="num block font-semibold text-ink">{brl(t.final)}</span>
                  {t.s !== "dono" && (
                    <span className={`num block text-xs ${dono.final - t.final >= 0 ? "text-ink-subtle" : "text-negative"}`}>
                      DONO {dono.final - t.final >= 0 ? "+" : "−"}{brl(Math.abs(dono.final - t.final))}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <section className="rounded-card bg-white/[0.03] p-5 text-sm leading-relaxed text-ink-subtle sm:p-6">
        <h2 className="mb-2 font-semibold text-ink-muted">Como este comparativo é calculado</h2>
        <p className="max-w-[90ch]">
          A rentabilidade da carteira DONO é o rendimento distribuído em cada mês dividido pelo capital dos ativos em operação, com reinvestimento para comparação. Esses valores são de demonstração.
          O CDI e a poupança vêm do Banco Central do Brasil (séries 4391 e 195). O Tesouro Selic é o retorno mensal do preço unitário do título com vencimento em 2027, publicado pelo Tesouro Transparente, e inclui a marcação a mercado. As ações do Itaú e do Banco do Brasil usam o fechamento mensal ajustado por dividendos e juros sobre capital, ou seja, o retorno total de quem manteve a ação. Todas as séries são brutas, sem impostos e taxas. Para atualizar, rode npm run market:update.
          Rentabilidade passada não garante rentabilidade futura.
        </p>
      </section>
    </div>
  );
}
