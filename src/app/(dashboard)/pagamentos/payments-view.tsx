"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Download, FileText, Loader2, Pencil } from "lucide-react";
import type { Asset, BankAccount, Payment, PaymentStatus } from "@/types";
import { HOJE, STATUS_PAGAMENTO, TIPOS } from "@/lib/constants";
import { addMonths } from "@/lib/mock-data";
import { brl, data, dataLonga, mesLongo, mesNome } from "@/lib/format";
import { exportCsv, exportPdf, type TableDoc } from "@/lib/exports";
import { Segmented } from "@/components/ui/segmented";
import { EmptyState, Panel } from "@/components/ui/panel";
import { PaymentStatusBadge } from "@/components/ui/status";

type Aba = "extrato" | "proximos";
type Periodo = "3" | "12" | "todos";
const POR_PAGINA = 12;
const BANK_KEY = "dono:conta";

const fieldCls =
  "h-11 w-full rounded-xl bg-white/[0.06] px-3.5 text-sm text-ink outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-crp-blue-bright aria-[invalid=true]:ring-negative";
const selectCls = "h-11 w-full rounded-xl bg-white/[0.06] px-4 text-sm font-semibold text-ink-muted outline-none hover:bg-white/10 sm:h-9 sm:w-auto sm:rounded-pill";

function BankPanel({ inicial }: { inicial: BankAccount }) {
  const [conta, setConta] = useState(inicial);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(BANK_KEY);
      if (s) setConta(JSON.parse(s));
    } catch {}
  }, []);

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!rascunho.banco.trim() || !/^\d{3,5}$/.test(rascunho.agencia) || !/^[\d-]{4,14}$/.test(rascunho.conta)) {
      setErro("Confira banco, agência (só números) e conta com dígito.");
      return;
    }
    setConta(rascunho);
    try {
      localStorage.setItem(BANK_KEY, JSON.stringify(rascunho));
    } catch {}
    setErro(null);
    setEditando(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 4000);
  }

  return (
    <Panel
      title="Conta de recebimento"
      actions={
        !editando && (
          <button
            type="button"
            onClick={() => {
              setRascunho(conta);
              setEditando(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-pill px-3 text-sm font-semibold text-ink-muted hover:bg-white/[0.08] hover:text-ink"
          >
            <Pencil aria-hidden className="size-3.5" /> Alterar
          </button>
        )
      }
    >
      {editando ? (
        <form onSubmit={salvar} className="space-y-3" noValidate>
          {(
            [
              ["banco", "Banco"],
              ["agencia", "Agência"],
              ["conta", "Conta com dígito"],
              ["pix", "Chave Pix (opcional)"],
            ] as const
          ).map(([k, label]) => (
            <div key={k}>
              <label htmlFor={`conta-${k}`} className="mb-1.5 block text-sm text-ink-subtle">{label}</label>
              <input
                id={`conta-${k}`}
                value={rascunho[k]}
                onChange={(e) => setRascunho({ ...rascunho, [k]: e.target.value })}
                aria-invalid={!!erro && k !== "pix"}
                inputMode={k === "agencia" ? "numeric" : undefined}
                className={fieldCls}
              />
            </div>
          ))}
          {erro && <p role="alert" className="text-sm font-medium text-negative">{erro}</p>}
          <p className="text-xs text-ink-subtle">Na plataforma real, a troca de conta é confirmada por e-mail antes do próximo repasse.</p>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="h-10 rounded-pill bg-crp-blue px-5 text-sm font-bold text-ink hover:bg-crp-blue-bright">Salvar conta</button>
            <button type="button" onClick={() => { setEditando(false); setErro(null); }} className="h-10 rounded-pill px-4 text-sm font-semibold text-ink-muted hover:bg-white/[0.08]">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <Building2 aria-hidden className="size-5 text-ink-muted" />
            </span>
            <dl className="min-w-0 text-sm">
              <dt className="sr-only">Banco</dt>
              <dd className="font-semibold text-ink">{conta.banco}</dd>
              <dt className="sr-only">Agência e conta</dt>
              <dd className="num text-ink-subtle">Ag. {conta.agencia} · Conta {conta.conta}</dd>
              <dt className="sr-only">Titular</dt>
              <dd className="text-ink-subtle">{conta.titular}</dd>
              {conta.pix && (
                <>
                  <dt className="sr-only">Pix</dt>
                  <dd className="truncate text-ink-subtle">Pix: {conta.pix}</dd>
                </>
              )}
            </dl>
          </div>
          {salvo && (
            <p role="status" className="mt-4 flex items-center gap-2 text-sm font-medium text-positive">
              <CheckCircle2 aria-hidden className="size-4" /> Conta atualizada para os próximos repasses.
            </p>
          )}
        </>
      )}
    </Panel>
  );
}

export function PaymentsView({ assets, payments, bank }: { assets: Asset[]; payments: Payment[]; bank: BankAccount }) {
  const [aba, setAba] = useState<Aba>("extrato");
  const [periodo, setPeriodo] = useState<Periodo>("12");
  const [ativo, setAtivo] = useState("todos");
  const [status, setStatus] = useState<PaymentStatus | "todos">("todos");
  const [pagina, setPagina] = useState(0);
  const [busy, setBusy] = useState<"csv" | "pdf" | null>(null);

  const asset = (id: string) => assets.find((a) => a.id === id)!;
  const realizados = payments.filter((p) => !p.previsto);
  const previstos = payments.filter((p) => p.previsto).sort((a, b) => a.data.localeCompare(b.data));

  const anoAtual = HOJE.slice(0, 4);
  const recebidoAno = realizados.filter((p) => p.status === "pago" && p.data.startsWith(anoAtual)).reduce((s, p) => s + p.valor, 0);
  const ultimaData = realizados.filter((p) => p.data <= HOJE).map((p) => p.data).sort().reverse()[0];
  const ultimoTotal = realizados.filter((p) => p.data === ultimaData).reduce((s, p) => s + p.valor, 0);
  const proxData = previstos[0]?.data;
  const proxTotal = previstos.filter((p) => p.data === proxData).reduce((s, p) => s + p.valor, 0);
  const atrasados = realizados.filter((p) => p.status === "atrasado");

  const filtrados = useMemo(() => {
    const limite = periodo === "todos" ? "0000-00" : addMonths(HOJE.slice(0, 7), -Number(periodo));
    return realizados.filter(
      (p) => p.data.slice(0, 7) > limite && (ativo === "todos" || p.assetId === ativo) && (status === "todos" || p.status === status),
    );
  }, [realizados, periodo, ativo, status]);

  useEffect(() => setPagina(0), [periodo, ativo, status]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visiveis = filtrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
  const totalFiltrado = filtrados.reduce((s, p) => s + p.valor, 0);

  const grupos = previstos.reduce<Record<string, Payment[]>>((acc, p) => ((acc[p.data] ??= []).push(p), acc), {});

  function doc(): TableDoc {
    return {
      titulo: "Extrato de pagamentos",
      subtitulo: `${periodo === "todos" ? "Todo o período" : `Últimos ${periodo} meses`}${ativo !== "todos" ? ` · ${asset(ativo).nome}` : ""}${status !== "todos" ? ` · ${STATUS_PAGAMENTO[status]}` : ""}`,
      arquivo: `dono-extrato-${HOJE}`,
      colunas: [
        { header: "Data" },
        { header: "Ativo", width: 32 },
        { header: "Tipo", width: 16 },
        { header: "Referência", width: 18 },
        { header: "Status" },
        { header: "Valor", align: "right" },
      ],
      linhas: filtrados.map((p) => [data(p.data), asset(p.assetId).nome, TIPOS[asset(p.assetId).tipo].nome, mesLongo(p.competencia), STATUS_PAGAMENTO[p.status], brl(p.valor)]),
      totais: ["Total", "", "", "", `${filtrados.length} lançamentos`, brl(totalFiltrado)],
    };
  }

  async function exportar(f: "csv" | "pdf") {
    setBusy(f);
    try {
      if (f === "csv") exportCsv(doc());
      else await exportPdf(doc());
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="card-elev rounded-card p-5">
          <dt className="text-sm text-ink-subtle">Recebido em {anoAtual}</dt>
          <dd className="num mt-1.5 text-xl font-bold text-ink sm:text-2xl">{brl(recebidoAno)}</dd>
        </div>
        <div className="card-elev rounded-card p-5">
          <dt className="text-sm text-ink-subtle">Último repasse · {ultimaData ? data(ultimaData) : "—"}</dt>
          <dd className="num mt-1.5 text-xl font-bold text-ink sm:text-2xl">{brl(ultimoTotal)}</dd>
        </div>
        <div className="rounded-card bg-gradient-to-br from-crp-blue to-crp-blue/80 p-5 text-ink shadow-lg shadow-crp-blue/25">
          <dt className="text-sm font-semibold">Próximo previsto · {proxData ? data(proxData) : "—"}</dt>
          <dd className="num mt-1.5 text-xl font-bold sm:text-2xl">{brl(proxTotal)}</dd>
        </div>
        <div className="card-elev rounded-card p-5">
          <dt className="text-sm text-ink-subtle">Atrasados</dt>
          <dd className={`num mt-1.5 text-xl font-bold sm:text-2xl ${atrasados.length ? "text-negative" : "text-ink"}`}>
            {atrasados.length ? brl(atrasados.reduce((s, p) => s + p.valor, 0)) : "Nenhum"}
          </dd>
          {atrasados.length > 0 && <dd className="mt-1 text-xs text-ink-subtle">{atrasados.map((p) => asset(p.assetId).nome).join(", ")}</dd>}
        </div>
      </dl>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <section className="card-elev min-w-0 rounded-card">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
            <Segmented
              label="Visualização"
              value={aba}
              onChange={setAba}
              options={[
                { value: "extrato", label: "Extrato" },
                { value: "proximos", label: "Próximos" },
              ]}
            />
            {aba === "extrato" && (
              <div className="flex gap-2">
                {(["csv", "pdf"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    disabled={!!busy || !filtrados.length}
                    onClick={() => exportar(f)}
                    className="inline-flex h-9 items-center gap-2 rounded-pill bg-white/[0.08] px-4 text-sm font-semibold text-ink hover:bg-white/[0.14] disabled:opacity-50"
                  >
                    {busy === f ? <Loader2 aria-hidden className="size-4 animate-spin" /> : f === "csv" ? <Download aria-hidden className="size-4" /> : <FileText aria-hidden className="size-4" />}
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {aba === "extrato" ? (
            <>
              <div className="flex flex-wrap items-center gap-2 px-5 pt-4 sm:px-6">
                <label className="sr-only" htmlFor="f-periodo">Período</label>
                <select id="f-periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)} className={selectCls}>
                  <option value="3">Últimos 3 meses</option>
                  <option value="12">Últimos 12 meses</option>
                  <option value="todos">Todo o período</option>
                </select>
                <label className="sr-only" htmlFor="f-ativo">Ativo</label>
                <select id="f-ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)} className={selectCls}>
                  <option value="todos">Todos os ativos</option>
                  {assets.filter((a) => realizados.some((p) => p.assetId === a.id)).map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="f-status">Status</label>
                <select id="f-status" value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus | "todos")} className={selectCls}>
                  <option value="todos">Todos os status</option>
                  <option value="pago">Pago</option>
                  <option value="processando">Processando</option>
                  <option value="atrasado">Atrasado</option>
                </select>
              </div>

              {filtrados.length === 0 ? (
                <EmptyState title="Nenhum pagamento com esses filtros">Amplie o período ou escolha outro ativo.</EmptyState>
              ) : (
                <>
                  <div className="mt-4 hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[680px] text-sm">
                    <caption className="sr-only">Extrato de pagamentos</caption>
                    <thead className="text-ink-subtle">
                      <tr className="border-y border-white/[0.07] bg-white/[0.02]">
                        <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.08em] sm:px-6">Data</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.08em]">Ativo</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.08em]">Referência</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.08em]">Status</th>
                        <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.08em] sm:px-6">Valor</th>
                      </tr>
                    </thead>
                      <tbody>
                        {visiveis.map((p) => (
                          <tr key={p.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                            <td className="num px-5 py-3.5 text-ink-muted sm:px-6">{data(p.data)}</td>
                            <td className="px-3 py-3.5">
                              <span className="flex items-center gap-2.5">
                                <span aria-hidden className="size-2 rounded-full" style={{ background: TIPOS[asset(p.assetId).tipo].cor }} />
                                <span className="font-semibold text-ink">{asset(p.assetId).nome}</span>
                              </span>
                            </td>
                            <td className="px-3 py-3.5 capitalize text-ink-muted">{mesNome(p.competencia)}/{p.competencia.slice(2, 4)}</td>
                            <td className="px-3 py-3.5"><PaymentStatusBadge status={p.status} /></td>
                            <td className="num px-5 py-3.5 text-right font-semibold text-ink sm:px-6">{brl(p.valor)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ul className="divide-y divide-white/[0.06] md:hidden">
                    {visiveis.map((p) => (
                      <li key={p.id} className="flex items-start justify-between gap-3 px-5 py-3.5 sm:px-6">
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-semibold text-ink">{asset(p.assetId).nome}</span>
                          <span className="mt-0.5 block text-sm text-ink-muted">
                            {data(p.data)} · ref. {mesNome(p.competencia)}/{p.competencia.slice(2, 4)}
                          </span>
                          <span className="mt-1.5 block"><PaymentStatusBadge status={p.status} /></span>
                        </span>
                        <span className="num shrink-0 text-[15px] font-bold text-ink">{brl(p.valor)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm sm:px-6">
                    <p className="text-ink-subtle">
                      {filtrados.length} lançamentos · total <span className="num font-semibold text-ink">{brl(totalFiltrado)}</span>
                    </p>
                    {paginas > 1 && (
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setPagina((p) => p - 1)} disabled={pagina === 0} aria-label="Página anterior" className="flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-white/[0.08] disabled:opacity-30">
                          <ChevronLeft className="size-4" />
                        </button>
                        <span className="num px-2 text-ink-muted">{pagina + 1} de {paginas}</span>
                        <button type="button" onClick={() => setPagina((p) => p + 1)} disabled={pagina >= paginas - 1} aria-label="Próxima página" className="flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-white/[0.08] disabled:opacity-30">
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="px-5 pb-6 pt-4 sm:px-6">
              <p className="mb-5 text-sm text-ink-subtle">Valores estimados pelo rendimento de referência de cada ativo. O valor final depende da operação do mês.</p>
              <ol className="space-y-6">
                {Object.entries(grupos).map(([dia, itens]) => (
                  <li key={dia}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3 className="text-[15px] font-bold text-ink">{dataLonga(dia)}</h3>
                      <span className="num text-[15px] font-bold text-ink">{brl(itens.reduce((s, p) => s + p.valor, 0))}</span>
                    </div>
                    <ul className="divide-y divide-white/[0.05] rounded-xl bg-white/[0.03]">
                      {itens.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: TIPOS[asset(p.assetId).tipo].cor }} />
                            <span className="truncate text-ink-muted">{asset(p.assetId).nome}</span>
                          </span>
                          <span className="num shrink-0 text-ink">{brl(p.valor)}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <div className="min-w-0 space-y-4">
          <BankPanel inicial={bank} />
          <Panel title="Como funcionam os repasses">
            <ul className="space-y-3 text-sm leading-relaxed text-ink-subtle">
              <li>O rendimento de cada mês é apurado no fechamento e pago no dia 10 do mês seguinte.</li>
              <li>Pagamentos em processamento costumam compensar em até 2 dias úteis.</li>
              <li>Em caso de atraso, o motivo aparece nos avisos e na página do ativo.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
