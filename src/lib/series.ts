import type { SerieKey } from "./calc";

export const SERIES: Record<SerieKey, { nome: string; cor: string; fonte: string }> = {
  dono: { nome: "Carteira DONO", cor: "#3268DE", fonte: "Dados de demonstração" },
  cdi: { nome: "CDI", cor: "#1C96A8", fonte: "Banco Central do Brasil" },
  selic: { nome: "Taxa Selic", cor: "#9A3C10", fonte: "Banco Central do Brasil" },
  poupanca: { nome: "Poupança", cor: "#9C9018", fonte: "Banco Central do Brasil" },
  ibovespa: { nome: "Ibovespa", cor: "#D9538F", fonte: "B3, fechamento mensal" },
  btc: { nome: "Bitcoin (BTC)", cor: "#C9761A", fonte: "CoinGecko / BRL mensal" },
  eth: { nome: "Ethereum (ETH)", cor: "#7D449A", fonte: "CoinGecko / BRL mensal" },
};
