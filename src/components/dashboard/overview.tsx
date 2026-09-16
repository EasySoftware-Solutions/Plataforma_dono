import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Asset, Payment } from "@/types";
import { composicao, rendaPorTipo, resumo } from "@/lib/calc";
import { TIPOS } from "@/lib/constants";
import { MESES_HISTORICO } from "@/lib/mock-data";
import { brl, data, mesLongo, mesNome, pct } from "@/lib/format";
import { IncomeBars } from "@/components/charts/income-bars";
import { CompositionBar } from "@/components/charts/composition-bar";
import { AssetStatusBadge, PaymentStatusBadge } from "@/components/ui/status";
import { Delta, Panel } from "@/components/ui/panel";

export function PortfolioSummary({ assets, preview = false }: { assets: Asset[]; preview?: boolean }) {
  const r = resumo(assets);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <section className="card-elev min-w-0 rounded-card p-5 sm:p-7">
        <h2 className="text-sm font-semibold text-ink-subtle">Patrimônio investido</h2>
        <p className="num mt-2 text-[40px] font-bold leading-none tracking-[-0.03em] text-ink sm:text-[52px]">{brl(r.patrimonio)}</p>
        <p className="mt-3 text-sm text-ink-subtle">
          {assets.length} ativos · {r.emOperacao} gerando renda
        </p>
        <dl className="mt-7 grid gap-5 border-t border-white/[0.08] pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/[0.08]">
          <div className="sm:pr-5">
            <dt className="text-sm text-ink-subtle">Rendimento de {mesNome(r.mes)}</dt>
            <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
              <span className="num text-xl font-bold text-ink">{brl(r.rendaAtual)}</span>
              <Delta value={r.variacaoMes} />
            </dd>
          </div>
          <div className="sm:px-5">
            <dt className="text-sm text-ink-subtle">Últimos 12 meses</dt>
            <dd className="num mt-1.5 text-xl font-bold text-ink">{brl(r.acumulado12)}</dd>
          </div>
          <div className="sm:pl-5">
            <dt className="text-sm text-ink-subtle">Rentabilidade média ao mês</dt>
            <dd className="num mt-1.5 text-xl font-bold text-ink">{pct(r.yieldMedio)}</dd>
          </div>
        </dl>
      </section>
      <Panel title="Composição da carteira" description={preview ? undefined : "Por valor investido"}>
        <CompositionBar items={composicao(assets)} />
      </Panel>
    </div>
  );
}

export function IncomePanel({ assets, toggle = true, actions }: { assets: Asset[]; toggle?: boolean; actions?: React.ReactNode }) {
  const meses = MESES_HISTORICO.slice(-12);
  return (
    <Panel title="Rendimentos mensais" description={`${mesLongo(meses[0])} a ${mesLongo(meses[meses.length - 1])}`} actions={actions}>
      <IncomeBars rows={rendaPorTipo(assets, meses)} toggle={toggle} />
    </Panel>
  );
}

const MEDALHAS = ["#eac26e", "#b7c0dc", "#d1936b"];

export function TopPerformers({ assets }: { assets: Asset[] }) {
  const doze = MESES_HISTORICO.slice(-12);
  const ranking = assets
    .map((a) => {
      const meses = a.historico.filter((h) => doze.includes(h.mes) && h.valor > 0);
      const renda12 = a.historico.filter((h) => doze.includes(h.mes)).reduce((s, h) => s + h.valor, 0);
      const yieldMedio = meses.length ? (meses.reduce((s, h) => s + h.valor, 0) / meses.length / a.valorInvestido) * 100 : 0;
      return { a, renda12, yieldMedio };
    })
    .filter((r) => r.yieldMedio > 0)
    .sort((x, y) => y.yieldMedio - x.yieldMedio)
    .slice(0, 3);

  return (
    <Panel
      title="Mais rentáveis"
      description="Rentabilidade média mensal sobre o valor investido, nos últimos 12 meses"
      actions={
        <Link href="/ativos" className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-crp-blue-bright">
          Ver todos <ArrowRight aria-hidden className="size-4" />
        </Link>
      }
    >
      <ol className="grid gap-3 sm:grid-cols-3">
        {ranking.map((r, i) => (
          <li key={r.a.id}>
            <Link
              href={`/ativos/${r.a.id}`}
              className="group flex h-full flex-col rounded-xl bg-white/[0.03] p-4 ring-1 ring-inset ring-white/[0.06] transition-colors hover:bg-white/[0.06]"
            >
              <span className="flex items-center justify-between gap-2">
                <span aria-label={`${i + 1}º mais rentável`} className="num text-sm font-bold" style={{ color: MEDALHAS[i] }}>
                  {i + 1}º
                </span>
                <span className="flex min-w-0 items-center gap-1.5 text-xs text-ink-subtle">
                  <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: TIPOS[r.a.tipo].cor }} />
                  <span className="truncate">{TIPOS[r.a.tipo].nome}</span>
                </span>
              </span>
              <span className="mt-2 block truncate text-[15px] font-semibold text-ink transition-colors group-hover:text-crp-blue-bright">
                {r.a.nome}
              </span>
              <span className="num mt-3 block text-[28px] font-bold leading-none tracking-[-0.02em] text-ink">
                {pct(r.yieldMedio)}
              </span>
              <span className="mt-1.5 text-xs text-ink-subtle">ao mês, em média</span>
              <span className="num mt-3 block border-t border-white/[0.06] pt-2.5 text-xs text-ink-muted">
                {brl(r.renda12)} em 12 meses
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function AssetList({ assets }: { assets: Asset[] }) {
  const mes = MESES_HISTORICO[MESES_HISTORICO.length - 1];
  return (
    <Panel
      title="Seus ativos"
      actions={
        <Link href="/ativos" className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-crp-blue-bright">
          Ver todos <ArrowRight aria-hidden className="size-4" />
        </Link>
      }
      bodyClassName="!px-2 sm:!px-3"
    >
      <ul>
        {assets.map((a) => {
          const renda = a.historico.find((h) => h.mes === mes)?.valor ?? 0;
          return (
            <li key={a.id}>
              <Link href={`/ativos/${a.id}`} className="group flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.04]">
                <span aria-hidden className="h-9 w-1 shrink-0 rounded-full" style={{ background: TIPOS[a.tipo].cor }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-ink">{a.nome}</span>
                  <span className="block truncate text-sm text-ink-subtle">
                    {TIPOS[a.tipo].nome} · {a.cidade}/{a.uf}
                  </span>
                </span>
                <span className="hidden sm:block">
                  <AssetStatusBadge status={a.status} />
                </span>
                <span className="num w-28 text-right text-[15px] font-semibold text-ink">{renda ? brl(renda) : "—"}</span>
                <ChevronRight aria-hidden className="size-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function RecentPayments({ assets, payments }: { assets: Asset[]; payments: Payment[] }) {
  const recentes = payments.filter((p) => !p.previsto).slice(0, 6);
  const proximo = payments.filter((p) => p.previsto).sort((a, b) => a.data.localeCompare(b.data));
  const dataProx = proximo[0]?.data;
  const totalProx = proximo.filter((p) => p.data === dataProx).reduce((s, p) => s + p.valor, 0);
  const nome = (id: string) => assets.find((a) => a.id === id)?.nome ?? id;

  return (
    <Panel
      title="Pagamentos"
      actions={
        <Link href="/pagamentos" className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-crp-blue-bright">
          Extrato <ArrowRight aria-hidden className="size-4" />
        </Link>
      }
    >
      {dataProx && (
        <div className="mb-4 rounded-xl bg-gradient-to-br from-crp-blue to-crp-blue/80 px-4 py-3.5 text-ink shadow-lg shadow-crp-blue/25">
          <p className="text-sm font-semibold">Próximo repasse previsto em {data(dataProx)}</p>
          <p className="num mt-0.5 text-2xl font-bold tracking-[-0.02em]">{brl(totalProx)}</p>
        </div>
      )}
      <ul className="divide-y divide-white/[0.06]">
        {recentes.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 py-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">{nome(p.assetId)}</span>
              <span className="block text-sm text-ink-subtle">
                {data(p.data)} · ref. {mesNome(p.competencia)}
              </span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="num text-sm font-semibold text-ink">{brl(p.valor)}</span>
              <PaymentStatusBadge status={p.status} />
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
