import type { Asset, AssetType, MarketMonth } from "@/types";
import { addMonths, MESES_HISTORICO } from "./mock-data";
import { TIPO_ORDEM, ULTIMO_MES_FECHADO } from "./constants";

export const investidoEm = (assets: Asset[], mes: string) =>
  assets.filter((a) => a.dataAquisicao.slice(0, 7) <= mes).reduce((s, a) => s + a.valorInvestido, 0);

export const investidoOperando = (assets: Asset[], mes: string) =>
  assets.filter((a) => a.inicioOperacao <= mes).reduce((s, a) => s + a.valorInvestido, 0);

export const rendaMes = (assets: Asset[], mes: string) =>
  assets.reduce((s, a) => s + (a.historico.find((h) => h.mes === mes)?.valor ?? 0), 0);

export type IncomeRow = { mes: string; total: number } & Record<AssetType, number>;

export function rendaPorTipo(assets: Asset[], meses = MESES_HISTORICO): IncomeRow[] {
  return meses.map((mes) => {
    const row = { mes, total: 0, charge: 0, tank: 0, capaxero: 0, solar: 0 } as IncomeRow;
    for (const a of assets) {
      const v = a.historico.find((h) => h.mes === mes)?.valor ?? 0;
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
  const doze = MESES_HISTORICO.slice(-12);
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

export type SerieKey = "dono" | "cdi" | "selic" | "poupanca" | "ibovespa" | "btc" | "eth";
export type IndexRow = { mes: string } & Record<SerieKey, number>;

export function retornosDono(assets: Asset[], meses: string[]) {
  return meses.map((m) => (rendaMes(assets, m) / (investidoOperando(assets, m) || 1)) * 100);
}

export function retornosMercado(market: MarketMonth[], meses: string[], key: Exclude<SerieKey, "dono">) {
  return meses.map((m) => market.find((x) => x.mes === m)?.[key] ?? 0);
}

export function indiceBase100(market: MarketMonth[], assets: Asset[], meses: string[]): IndexRow[] {
  const dono = retornosDono(assets, meses);
  const acc: Record<SerieKey, number> = {
    dono: 100,
    cdi: 100,
    selic: 100,
    poupanca: 100,
    ibovespa: 100,
    btc: 100,
    eth: 100,
  };
  const rows: IndexRow[] = [{ mes: addMonths(meses[0], -1), ...acc }];
  meses.forEach((mes, i) => {
    const mk = market.find((x) => x.mes === mes);
    if (!mk) return;
    acc.dono *= 1 + dono[i] / 100;
    acc.cdi *= 1 + mk.cdi / 100;
    acc.selic *= 1 + mk.selic / 100;
    acc.poupanca *= 1 + mk.poupanca / 100;
    acc.ibovespa *= 1 + mk.ibovespa / 100;
    acc.btc *= 1 + (mk.btc ?? 0) / 100;
    acc.eth *= 1 + (mk.eth ?? 0) / 100;
    rows.push({
      mes,
      dono: +acc.dono.toFixed(2),
      cdi: +acc.cdi.toFixed(2),
      selic: +acc.selic.toFixed(2),
      poupanca: +acc.poupanca.toFixed(2),
      ibovespa: +acc.ibovespa.toFixed(2),
      btc: +acc.btc.toFixed(2),
      eth: +acc.eth.toFixed(2),
    });
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
