import type { Asset, AssetType, MarketMonth } from "@/types";
import { addMonths } from "./months";
import { MESES_HISTORICO, TIPO_ORDEM, ULTIMOS_12, ULTIMO_MES_FECHADO } from "./constants";

type Meses = readonly string[];

export const rendaAtivoMes = (a: Asset, mes: string) => a.historico.find((h) => h.mes === mes)?.valor ?? 0;

/**
 * Rendimento total de um ativo no período e a rentabilidade média mensal sobre o
 * valor investido, considerando só os meses em que ele de fato gerou renda.
 */
export function desempenhoAtivo(a: Asset, meses: Meses) {
  const set = new Set(meses);
  const hist = a.historico.filter((h) => set.has(h.mes));
  const renda = hist.reduce((s, h) => s + h.valor, 0);
  const mesesComRenda = hist.filter((h) => h.valor > 0).length;
  const mediaMensal = mesesComRenda ? renda / mesesComRenda : 0;
  return { renda, mediaMensal, yieldMedio: (mediaMensal / (a.valorInvestido || 1)) * 100 };
}

export function maisRentaveis(assets: Asset[], n = 3, meses: Meses = ULTIMOS_12) {
  return assets
    .map((a) => ({ a, ...desempenhoAtivo(a, meses) }))
    .filter((r) => r.yieldMedio > 0)
    .sort((x, y) => y.yieldMedio - x.yieldMedio)
    .slice(0, n);
}

export const investidoEm = (assets: Asset[], mes: string) =>
  assets.filter((a) => a.dataAquisicao.slice(0, 7) <= mes).reduce((s, a) => s + a.valorInvestido, 0);

export const investidoOperando = (assets: Asset[], mes: string) =>
  assets.filter((a) => a.inicioOperacao <= mes).reduce((s, a) => s + a.valorInvestido, 0);

export const rendaMes = (assets: Asset[], mes: string) => assets.reduce((s, a) => s + rendaAtivoMes(a, mes), 0);

export type IncomeRow = { mes: string; total: number } & Record<AssetType, number>;

export function rendaPorTipo(assets: Asset[], meses: Meses = MESES_HISTORICO): IncomeRow[] {
  return meses.map((mes) => {
    const row = { mes, total: 0, charge: 0, tank: 0, capaxero: 0, solar: 0 } as IncomeRow;
    for (const a of assets) {
      const v = rendaAtivoMes(a, mes);
      row[a.tipo] += v;
      row.total += v;
    }
    TIPO_ORDEM.forEach((t) => (row[t] = Math.round(row[t] * 100) / 100));
    row.total = Math.round(row.total * 100) / 100;
    return row;
  });
}

export function resumo(assets: Asset[]) {
  const mes = ULTIMO_MES_FECHADO;
  const anterior = addMonths(mes, -1);
  const doze = ULTIMOS_12;
  const patrimonio = investidoEm(assets, mes);
  const rendaAtual = rendaMes(assets, mes);
  const rendaAnterior = rendaMes(assets, anterior);
  const acumulado12 = doze.reduce((s, m) => s + rendaMes(assets, m), 0);
  const acumuladoTotal = MESES_HISTORICO.reduce((s, m) => s + rendaMes(assets, m), 0);
  const yieldMedio =
    (doze.reduce((s, m) => s + rendaMes(assets, m) / (investidoOperando(assets, m) || 1), 0) / doze.length) * 100;
  return {
    mes,
    patrimonio,
    rendaAtual,
    rendaAnterior,
    variacaoMes: rendaAnterior ? ((rendaAtual - rendaAnterior) / rendaAnterior) * 100 : 0,
    acumulado12,
    acumuladoTotal,
    yieldMedio,
    emOperacao: assets.filter((a) => a.status !== "implantacao").length,
  };
}

export function composicao(assets: Asset[]) {
  const total = assets.reduce((s, a) => s + a.valorInvestido, 0);
  return TIPO_ORDEM.map((tipo) => {
    const valor = assets.filter((a) => a.tipo === tipo).reduce((s, a) => s + a.valorInvestido, 0);
    return { tipo, valor, pct: total ? (valor / total) * 100 : 0 };
  }).filter((c) => c.valor > 0);
}

/** Séries de mercado comparadas com a carteira (renda fixa de referência + bolsa brasileira). */
export const MERCADO_KEYS = ["cdi", "selic", "poupanca", "itub4", "bbas3"] as const;
export type MercadoKey = (typeof MERCADO_KEYS)[number];
export type SerieKey = "dono" | MercadoKey;
export type IndexRow = { mes: string } & Record<SerieKey, number>;

export function retornosDono(assets: Asset[], meses: Meses) {
  return meses.map((m) => (rendaMes(assets, m) / (investidoOperando(assets, m) || 1)) * 100);
}

export function retornosMercado(market: MarketMonth[], meses: Meses, key: MercadoKey) {
  return meses.map((m) => market.find((x) => x.mes === m)?.[key] ?? 0);
}

export function indiceBase100(market: MarketMonth[], assets: Asset[], meses: Meses): IndexRow[] {
  const dono = retornosDono(assets, meses);
  const keys: SerieKey[] = ["dono", ...MERCADO_KEYS];
  const acc = Object.fromEntries(keys.map((k) => [k, 100])) as Record<SerieKey, number>;
  const rows: IndexRow[] = [{ mes: addMonths(meses[0], -1), ...acc }];
  meses.forEach((mes, i) => {
    const mk = market.find((x) => x.mes === mes);
    if (!mk) return;
    acc.dono *= 1 + dono[i] / 100;
    for (const k of MERCADO_KEYS) acc[k] *= 1 + mk[k] / 100;
    rows.push({ mes, ...(Object.fromEntries(keys.map((k) => [k, +acc[k].toFixed(2)])) as Record<SerieKey, number>) });
  });
  return rows;
}

export function metricas(serie: number[]) {
  const acumulado = (serie.reduce((a, r) => a * (1 + r / 100), 1) - 1) * 100;
  const media = serie.reduce((a, r) => a + r, 0) / serie.length;
  const desvio = Math.sqrt(serie.reduce((a, r) => a + (r - media) ** 2, 0) / serie.length);
  const anualizado = ((1 + acumulado / 100) ** (12 / serie.length) - 1) * 100;
  const mesesNegativos = serie.filter((r) => r < 0).length;
  return { acumulado, media, desvio, anualizado, mesesNegativos };
}
