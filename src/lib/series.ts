import type { SerieKey } from "./calc";

export const SERIES: Record<SerieKey, { nome: string; cor: string; fonte: string }> = {
  dono: { nome: "Carteira DONO", cor: "#27AAE1", fonte: "Dados mockados (planilhas NB1 e NB2)" },
  cdi: { nome: "CDI", cor: "#8D91A3", fonte: "Banco Central do Brasil, SGS 4391" },
  selic: { nome: "Tesouro Selic", cor: "#8B6CC8", fonte: "Tesouro Transparente, PU do Tesouro Selic 2027 (bruto)" },
  poupanca: { nome: "Poupança", cor: "#9C9018", fonte: "Banco Central do Brasil, SGS 195" },
  itub4: { nome: "Itaú (ITUB4)", cor: "#6F7CF0", fonte: "B3 via Yahoo Finance, preço ajustado por proventos" },
  bbas3: { nome: "Banco do Brasil (BBAS3)", cor: "#D4B33A", fonte: "B3 via Yahoo Finance, preço ajustado por proventos" },
};
