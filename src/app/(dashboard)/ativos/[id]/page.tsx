import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { ASSETS, MESES_HISTORICO } from "@/lib/mock-data";
import { TIPOS } from "@/lib/constants";
import { brl, data, mesLongo, mesNome, pct } from "@/lib/format";
import { AssetBars } from "@/components/charts/asset-bars";
import { EmptyState, Panel } from "@/components/ui/panel";
import { AssetStatusBadge, PaymentStatusBadge } from "@/components/ui/status";
import { Documents } from "./documents";

export function generateStaticParams() {
  return ASSETS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const asset = await api.getAsset((await params).id);
  return { title: asset?.nome ?? "Ativo" };
}

export default async function AtivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [asset, payments] = await Promise.all([api.getAsset(id), api.getPayments()]);
  if (!asset) notFound();

  const tipo = TIPOS[asset.tipo];
  const recebido = asset.historico.reduce((s, h) => s + h.valor, 0);
  const doze = asset.historico.filter((h) => MESES_HISTORICO.slice(-12).includes(h.mes) && h.valor > 0);
  const media12 = doze.length ? doze.reduce((s, h) => s + h.valor, 0) / doze.length : 0;
  const desde = asset.historico.findIndex((h) => h.valor > 0);
  const serie = desde >= 0 ? asset.historico.slice(desde) : [];
  const pagamentos = payments.filter((p) => p.assetId === asset.id).slice(0, 8);
  const maps = `https://www.google.com/maps/search/?api=1&query=${asset.coordenadas.lat},${asset.coordenadas.lng}`;

  return (
    <>
      <Link href="/ativos" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-subtle hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        Meus ativos
      </Link>

      <section className="relative overflow-hidden rounded-card bg-crp-navy-deep">
        <Image src={tipo.imagem} alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" style={{ objectPosition: tipo.foco }} className="object-cover opacity-80" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/10" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
            <span aria-hidden className="size-2 rounded-full" style={{ background: tipo.cor }} />
            {tipo.nome} · {tipo.categoria}
          </p>
          <h1 className="mt-3 max-w-[20ch] text-[32px] font-bold leading-[1.08] text-ink sm:text-[44px]">{asset.nome}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-[15px] text-ink-muted">
            <MapPin aria-hidden className="size-4" />
            {asset.cidade}/{asset.uf}
          </p>
          <div className="mt-5"><AssetStatusBadge status={asset.status} /></div>
        </div>
      </section>

      <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { k: "Valor investido", v: brl(asset.valorInvestido) },
          { k: "Rendimento recebido", v: brl(recebido), s: `desde ${mesLongo(serie[0]?.mes ?? asset.inicioOperacao)}` },
          { k: "Média mensal em 12 meses", v: media12 ? brl(media12) : "—" },
          { k: "Yield médio ao mês", v: media12 ? pct((media12 / asset.valorInvestido) * 100) : "—", s: `referência contratada ${pct(asset.yieldReferencia)}` },
        ].map((m) => (
          <div key={m.k} className="rounded-card bg-crp-surface p-5">
            <dt className="text-sm text-ink-subtle">{m.k}</dt>
            <dd className="num mt-1.5 text-xl font-bold text-ink sm:text-2xl">{m.v}</dd>
            {m.s && <dd className="mt-1 text-xs text-ink-subtle">{m.s}</dd>}
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Rendimento mensal" description={serie.length ? `${mesLongo(serie[0].mes)} a ${mesLongo(serie[serie.length - 1].mes)}` : undefined}>
          {serie.length ? (
            <AssetBars data={serie} color={tipo.cor} invested={asset.valorInvestido} />
          ) : (
            <EmptyState title="Ainda sem rendimentos">
              Este ativo está em implantação. O primeiro repasse vem depois do início da operação, previsto para {mesLongo(asset.inicioOperacao)}.
            </EmptyState>
          )}
        </Panel>

        <Panel title="Sobre o ativo">
          <p className="text-[15px] leading-relaxed text-ink-muted">{asset.descricao}</p>
          <dl className="mt-5 divide-y divide-white/[0.06]">
            {[
              { rotulo: "Aquisição", valor: data(asset.dataAquisicao) },
              { rotulo: "Início da operação", valor: mesLongo(asset.inicioOperacao) },
              ...asset.especificacoes,
            ].map((e) => (
              <div key={e.rotulo} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-ink-subtle">{e.rotulo}</dt>
                <dd className="text-right font-semibold text-ink">{e.valor}</dd>
              </div>
            ))}
          </dl>
          <a href={maps} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-crp-blue-bright">
            Ver localização no mapa <ExternalLink aria-hidden className="size-3.5" />
          </a>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Pagamentos deste ativo">
          {pagamentos.length ? (
            <ul className="divide-y divide-white/[0.06]">
              {pagamentos.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-ink">Referente a {mesNome(p.competencia)}</span>
                    <span className="block text-sm text-ink-subtle">{data(p.data)}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <PaymentStatusBadge status={p.status} previsto={p.previsto} />
                    <span className="num w-24 text-right text-sm font-semibold text-ink">{brl(p.valor)}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nenhum pagamento ainda">Os repasses aparecem aqui assim que o ativo começar a operar.</EmptyState>
          )}
        </Panel>
        <Panel title="Documentos">
          <Documents asset={asset} />
        </Panel>
      </div>
    </>
  );
}
