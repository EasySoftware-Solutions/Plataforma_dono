// Atualiza src/lib/market.json com séries reais de mercado, janela de 24 meses.
//
//   node scripts/update-market.mjs            termina no mês passado
//   node scripts/update-market.mjs 2026-08    termina em 2026-08 (use o mesmo valor de ULTIMO_MES_FECHADO)
//
// Fontes (todas públicas, sem chave):
//  - CDI: Banco Central, SGS 4391 (acumulado no mês).
//  - Poupança: Banco Central, SGS 195 (rendimento da data-base do dia 1).
//  - Tesouro Selic: Tesouro Transparente, PU do Tesouro Selic 2027. Retorno do mês = PU do 1º dia
//    com dado do mês seguinte dividido pelo do 1º dia do mês. Bruto de IR e taxa de custódia.
//  - Ações da B3 (ITUB4, BBAS3): Yahoo Finance, fechamento mensal AJUSTADO por
//    dividendos e juros sobre capital (retorno total de quem manteve a ação).
import { writeFileSync } from "node:fs";

const JANELA = 24;
const UA = { "User-Agent": "Mozilla/5.0" };

const fmt = (y, m) => `${y}-${String(m).padStart(2, "0")}`;
const add = (mes, n) => {
  const [y, m] = mes.split("-").map(Number);
  const t = y * 12 + (m - 1) + n;
  return fmt(Math.floor(t / 12), (t % 12) + 1);
};
const hoje = new Date();
const fim = process.argv[2] ?? add(fmt(hoje.getFullYear(), hoje.getMonth() + 1), -1);
const meses = Array.from({ length: JANELA }, (_, i) => add(fim, i - JANELA + 1));
const bcbIni = `01/${meses[0].slice(5)}/${meses[0].slice(0, 4)}`;
const [fy, fm] = add(fim, 1).split("-");
const bcbFim = `15/${fm}/${fy}`;

const json = async (url) => {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} em ${url}`);
  return r.json();
};
const mesDe = (d) => `${d.slice(6)}-${d.slice(3, 5)}`;
const pctVar = (a, b) => (a && b ? Math.round((b / a - 1) * 10000) / 100 : null);

const sgs = async (n) => json(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${n}/dados?formato=json&dataInicial=${bcbIni}&dataFinal=${bcbFim}`);

async function yahoo(simbolo, ajustado = false) {
  const r = (await json(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(simbolo)}?interval=1mo&range=5y`)).chart.result[0];
  const precos = ajustado ? r.indicators.adjclose[0].adjclose : r.indicators.quote[0].close;
  const out = {};
  r.timestamp.forEach((t, i) => {
    const close = precos[i];
    if (close == null) return;
    const d = new Date((t + r.meta.gmtoffset) * 1000);
    out[fmt(d.getUTCFullYear(), d.getUTCMonth() + 1)] = close;
  });
  return out;
}

async function tesouroSelic() {
  const url = "https://www.tesourotransparente.gov.br/ckan/dataset/df56aa42-484a-4a59-8184-7676580c81e3/resource/796d2059-14e9-44e3-80c9-2d9e30b405c1/download/PrecoTaxaTesouroDireto.csv";
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} no CSV do Tesouro`);
  const texto = new TextDecoder("latin1").decode(await r.arrayBuffer());
  const primeiro = {};
  for (const linha of texto.split("\n")) {
    const c = linha.split(";");
    if (c[0] !== "Tesouro Selic" || c[1] !== "01/03/2027") continue;
    const v = parseFloat((c[7] || c[6]).replace(",", "."));
    if (Number.isNaN(v)) continue;
    const k = mesDe(c[2]);
    const dia = Number(c[2].slice(0, 2));
    if (!primeiro[k] || dia <= primeiro[k].dia) primeiro[k] = { dia, v };
  }
  return Object.fromEntries(Object.entries(primeiro).map(([k, x]) => [k, x.v]));
}

const ACOES = { itub4: "ITUB4.SA", bbas3: "BBAS3.SA" };

const [cdiRaw, poupRaw, tes, ...acoes] = await Promise.all([
  sgs(4391),
  sgs(195),
  tesouroSelic(),
  ...Object.values(ACOES).map((t) => yahoo(t, true)),
]);
const acao = Object.fromEntries(Object.keys(ACOES).map((k, i) => [k, acoes[i]]));

const cdi = Object.fromEntries(cdiRaw.map((x) => [mesDe(x.data), Number(x.valor)]));
const poup = {};
for (const x of poupRaw) if (x.data.startsWith("01/")) poup[mesDe(x.data)] = Number(x.valor);
const doMes = (serie, m) => pctVar(serie[add(m, -1)], serie[m]);

const linhas = meses.map((mes) => ({
  mes,
  cdi: cdi[mes],
  selic: pctVar(tes[mes], tes[add(mes, 1)]),
  poupanca: poup[mes],
  ...Object.fromEntries(Object.keys(ACOES).map((k) => [k, doMes(acao[k], mes)])),
}));

const faltando = linhas.filter((l) => Object.values(l).some((v) => v == null || Number.isNaN(v)));
if (faltando.length) {
  console.error("Meses incompletos, nada foi gravado:", faltando.map((l) => l.mes).join(", "));
  process.exit(1);
}

writeFileSync(new URL("../src/lib/market.json", import.meta.url), JSON.stringify(linhas, null, 2) + "\n");
console.log(`market.json atualizado: ${meses[0]} a ${fim} (${linhas.length} meses)`);
