"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, FileText, History, Loader2 } from "lucide-react";
import type { Asset, Payment } from "@/types";
import { composicao, investidoEm, rendaMes } from "@/lib/calc";
import { HOJE, STATUS_PAGAMENTO, TIPOS, ULTIMO_MES_FECHADO } from "@/lib/constants";
import { MESES_HISTORICO } from "@/lib/mock-data";
import { brl, data, dataLonga, mesCurto, mesLongo, pct } from "@/lib/format";
import { exportPdf, exportRelatorioMensal, exportXlsx, type TableDoc } from "@/lib/exports";
import { EmptyState, Panel } from "@/components/ui/panel";

type Formato = "pdf" | "xlsx";
type Gerado = { id: string; titulo: string; formato: Formato; em: string };
const STORAGE = "dono:relatorios";

const selectCls =
  "h-11 w-full rounded-xl bg-white/[0.06] px-3.5 text-sm font-semibold text-ink outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-crp-blue-bright sm:w-56";

export function Reports({ assets, payments, investidor }: { assets: Asset[]; payments: Payment[]; investidor: string }) {
  const mesesDesc = [...MESES_HISTORICO].reverse();
  const anos = [...new Set(payments.filter((p) => !p.previsto && p.data <= HOJE).map((p) => p.data.slice(0, 4)))].sort().reverse();
  const operando = assets.filter((a) => a.historico.some((h) => h.valor > 0));

  const [mes, setMes] = useState(ULTIMO_MES_FECHADO);
  const [ano, setAno] = useState(anos.find((a) => a < HOJE.slice(0, 4)) ?? anos[0]);
  const [ativo, setAtivo] = useState(operando[0]?.id ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [historico, setHistorico] = useState<Gerado[]>([]);

  useEffect(() => {
    try {
      setHistorico(JSON.parse(localStorage.getItem(STORAGE) ?? "[]"));
    } catch {}
  }, []);

  const nome = (id: string) => assets.find((a) => a.id === id)!;

  function docMensal(): TableDoc {
    const linhas = assets
      .map((a) => {
        const v = a.historico.find((h) => h.mes === mes)?.valor ?? 0;
        const p = payments.find((x) => x.assetId === a.id && x.competencia === mes);
        return { a, v, p };
      })
      .filter((l) => l.v > 0);
    const total = linhas.reduce((s, l) => s + l.v, 0);
    return {
      titulo: `Relatório mensal · ${mesLongo(mes)}`,
      subtitulo: `${linhas.length} ativos com rendimento no mês`,
      arquivo: `dono-relatorio-mensal-${mes}`,
      resumo: [
        { rotulo: "Rendimento do mês", valor: brl(total) },
        { rotulo: "Patrimônio investido", valor: brl(investidoEm(assets, mes)) },
        { rotulo: "Sobre o capital em operação", valor: pct((total / (linhas.reduce((s, l) => s + l.a.valorInvestido, 0) || 1)) * 100) },
      ],
      colunas: [
        { header: "Ativo", width: 32 },
        { header: "Tipo", width: 16 },
        { header: "Investido", align: "right" },
        { header: "Rendimento", align: "right" },
        { header: "% no mês", align: "right" },
        { header: "Pagamento", width: 22 },
      ],
      linhas: linhas.map((l) => [
        l.a.nome,
        TIPOS[l.a.tipo].nome,
        brl(l.a.valorInvestido),
        brl(l.v),
        pct((l.v / l.a.valorInvestido) * 100),
        l.p ? `${STATUS_PAGAMENTO[l.p.status]} · ${data(l.p.data)}` : "—",
      ]),
      totais: ["Total", "", "", brl(total), "", ""],
    };
  }

  function dadosMensalPdf() {
    const linhas = assets
      .map((a) => ({ a, v: a.historico.find((h) => h.mes === mes)?.valor ?? 0 }))
      .filter((l) => l.v > 0)
      .sort((x, y) => y.v - x.v);
    const total = linhas.reduce((s, l) => s + l.v, 0);
    const iFim = MESES_HISTORICO.indexOf(mes);
    const seis = MESES_HISTORICO.slice(Math.max(0, iFim - 5), iFim + 1);
    return {
      arquivo: `dono-relatorio-mensal-${mes}`,
      mesLabel: mesLongo(mes),
      investidor,
      rendimentoMes: total,
      patrimonioInvestido: investidoEm(assets, mes),
      ativosComRendimento: linhas.length,
      totalAtivos: assets.length,
      ativos: linhas.map((l) => ({ nome: l.a.nome, tipo: TIPOS[l.a.tipo].nome, cor: TIPOS[l.a.tipo].cor, rendimento: l.v })),
      historicoRendimento: seis.map((m) => ({ label: mesCurto(m), valor: rendaMes(assets, m) })),
      historicoPatrimonio: seis.map((m) => ({ label: mesCurto(m), valor: investidoEm(assets, m) })),
    };
  }

  function docAnual(): TableDoc {
    const pagos = payments.filter((p) => !p.previsto && p.status === "pago" && p.data.startsWith(ano));
    const porAtivo = assets
      .map((a) => ({ a, v: pagos.filter((p) => p.assetId === a.id).reduce((s, p) => s + p.valor, 0), n: pagos.filter((p) => p.assetId === a.id).length }))
      .filter((x) => x.v > 0);
    const total = porAtivo.reduce((s, x) => s + x.v, 0);
    const fimAno = `${ano}-12`;
    return {
      titulo: `Informe de rendimentos · ano-calendário ${ano}`,
      subtitulo: "Valores pagos no ano. Confirme a natureza tributária de cada rendimento com seu contador.",
      arquivo: `dono-informe-rendimentos-${ano}`,
      resumo: [
        { rotulo: `Rendimentos pagos em ${ano}`, valor: brl(total) },
        { rotulo: `Posição em 31/12/${ano}`, valor: brl(investidoEm(assets, fimAno < ULTIMO_MES_FECHADO ? fimAno : ULTIMO_MES_FECHADO)) },
      ],
      colunas: [
        { header: "Ativo", width: 32 },
        { header: "Tipo", width: 16 },
        { header: "Local", width: 20 },
        { header: "Pagamentos", align: "right" },
        { header: "Total recebido", align: "right" },
      ],
      linhas: porAtivo.map((x) => [x.a.nome, TIPOS[x.a.tipo].nome, `${x.a.cidade}/${x.a.uf}`, x.n, brl(x.v)]),
      totais: ["Total", "", "", pagos.length, brl(total)],
    };
  }

  function docAtivo(): TableDoc {
    const a = nome(ativo);
    const hist = a.historico.slice(a.historico.findIndex((h) => h.valor > 0));
    const total = hist.reduce((s, h) => s + h.valor, 0);
    return {
      titulo: `Desempenho · ${a.nome}`,
      subtitulo: `${TIPOS[a.tipo].nome} · ${a.cidade}/${a.uf} · investido ${brl(a.valorInvestido)}`,
      arquivo: `dono-desempenho-${a.id}`,
      resumo: [
        { rotulo: "Total recebido", valor: brl(total) },
        { rotulo: "Média mensal", valor: brl(total / (hist.length || 1)) },
        { rotulo: "Rentabilidade média mensal", valor: pct((total / (hist.length || 1) / a.valorInvestido) * 100) },
      ],
      colunas: [{ header: "Mês" }, { header: "Rendimento", align: "right" }, { header: "% sobre o investido", align: "right" }, { header: "Acumulado", align: "right" }],
      linhas: hist.map((h, i) => [mesCurto(h.mes), brl(h.valor), pct((h.valor / a.valorInvestido) * 100), brl(hist.slice(0, i + 1).reduce((s, x) => s + x.valor, 0))]),
      totais: ["Total", brl(total), "", ""],
    };
  }

  function docDistribuicao(): TableDoc {
    const total = assets.reduce((s, a) => s + a.valorInvestido, 0);
    const renda12 = (id: string) => MESES_HISTORICO.slice(-12).reduce((s, m) => s + (nome(id).historico.find((h) => h.mes === m)?.valor ?? 0), 0);
    return {
      titulo: "Distribuição da carteira",
      subtitulo: `Posição em ${dataLonga(HOJE)}`,
      arquivo: "dono-distribuicao-carteira",
      resumo: composicao(assets).map((c) => ({ rotulo: TIPOS[c.tipo].nome, valor: pct(c.pct, { digits: 1 }) })),
      colunas: [
        { header: "Ativo", width: 32 },
        { header: "Tipo", width: 16 },
        { header: "Investido", align: "right" },
        { header: "Participação", align: "right" },
        { header: "Renda 12 meses", align: "right" },
      ],
      linhas: [...assets]
        .sort((x, y) => y.valorInvestido - x.valorInvestido)
        .map((a) => [a.nome, TIPOS[a.tipo].nome, brl(a.valorInvestido), pct((a.valorInvestido / total) * 100, { digits: 1 }), brl(renda12(a.id))]),
      totais: ["Total", "", brl(total), "100,0%", brl(MESES_HISTORICO.slice(-12).reduce((s, m) => s + rendaMes(assets, m), 0))],
    };
  }

  async function gerar(key: string, build: () => TableDoc, formato: Formato) {
    setBusy(`${key}-${formato}`);
    try {
      let titulo: string;
      if (key === "mensal" && formato === "pdf") {
        const d = dadosMensalPdf();
        await exportRelatorioMensal(d);
        titulo = `Relatório mensal · ${d.mesLabel}`;
      } else {
        const doc = build();
        await (formato === "pdf" ? exportPdf(doc) : exportXlsx(doc));
        titulo = doc.titulo;
      }
      const item: Gerado = { id: `${Date.now()}`, titulo, formato, em: new Date().toISOString() };
      setHistorico((h) => {
        const next = [item, ...h].slice(0, 8);
        try {
          localStorage.setItem(STORAGE, JSON.stringify(next));
        } catch {}
        return next;
      });
    } finally {
      setBusy(null);
    }
  }

  const relatorios = [
    {
      key: "mensal",
      titulo: "Relatório mensal",
      texto: "Rendimento de cada ativo no mês, percentual sobre o investido e situação do pagamento.",
      build: docMensal,
      controle: (
        <select aria-label="Mês do relatório" value={mes} onChange={(e) => setMes(e.target.value)} className={selectCls}>
          {mesesDesc.map((m) => <option key={m} value={m}>{mesLongo(m)}</option>)}
        </select>
      ),
    },
    {
      key: "anual",
      titulo: "Informe de rendimentos para o IR",
      texto: "Tudo o que foi pago a você no ano-calendário, por ativo, e a posição em 31 de dezembro.",
      build: docAnual,
      controle: (
        <select aria-label="Ano-calendário" value={ano} onChange={(e) => setAno(e.target.value)} className={selectCls}>
          {anos.map((a) => <option key={a} value={a}>{a}{a === HOJE.slice(0, 4) ? " (parcial)" : ""}</option>)}
        </select>
      ),
    },
    {
      key: "ativo",
      titulo: "Desempenho por ativo",
      texto: "Histórico mês a mês de um ativo, com acumulado e rentabilidade média desde o início da operação.",
      build: docAtivo,
      controle: (
        <select aria-label="Ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)} className={selectCls}>
          {operando.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
      ),
    },
    {
      key: "distribuicao",
      titulo: "Distribuição da carteira",
      texto: "Participação de cada tipo e de cada ativo no patrimônio, com a renda dos últimos 12 meses.",
      build: docDistribuicao,
      controle: <p className="flex h-11 items-center text-sm text-ink-subtle sm:w-56">Posição atual</p>,
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
      <section className="card-elev min-w-0 divide-y divide-white/[0.06] rounded-card">
        {relatorios.map((r) => (
          <div key={r.key} className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-ink">{r.titulo}</h2>
              <p className="mt-1 max-w-[52ch] text-sm text-ink-subtle">{r.texto}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {r.controle}
              <div className="flex gap-2">
                {(["pdf", "xlsx"] as Formato[]).map((f) => {
                  const b = busy === `${r.key}-${f}`;
                  const Icon = f === "pdf" ? FileText : FileSpreadsheet;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => gerar(r.key, r.build, f)}
                      disabled={!!busy}
                      className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-pill px-4 text-sm font-semibold transition-[background-color,box-shadow,transform] duration-300 ease-out-expo hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 sm:flex-none ${
                        f === "pdf"
                          ? "bg-crp-blue text-ink shadow-[0_10px_26px_-12px_color-mix(in_srgb,var(--color-crp-blue)_75%,transparent)] hover:bg-crp-blue-hover"
                          : "bg-white/[0.08] text-ink outline-1 outline-offset-[-1px] outline-white/15 hover:bg-white/[0.14]"
                      }`}
                    >
                      {b ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Icon aria-hidden className="size-4" />}
                      {f === "pdf" ? "PDF" : "Excel"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </section>

      <Panel title="Gerados recentemente" description="Neste navegador">
        {historico.length ? (
          <ul className="divide-y divide-white/[0.06]">
            {historico.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-3">
                {h.formato === "pdf" ? <FileText aria-hidden className="size-4 shrink-0 text-ink-muted" /> : <FileSpreadsheet aria-hidden className="size-4 shrink-0 text-ink-muted" />}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{h.titulo}</span>
                  <span className="block text-xs text-ink-subtle">
                    {h.formato.toUpperCase()} · {new Date(h.em).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nenhum relatório gerado ainda">
            <span className="inline-flex items-center gap-1.5">
              <History aria-hidden className="size-4" /> Os downloads que você fizer aparecem aqui.
            </span>
          </EmptyState>
        )}
      </Panel>
    </div>
  );
}
