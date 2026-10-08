// DADOS MOCKADOS DO CLIENTE MAGNO BORGES, USINAS NB1 E NB2.
//
// Origem dos números (planilha Consolidado_NB1_e_NB2_2026.xlsx):
//  - "Demonstrativo 2025-2026": líquido geral mensal de cada usina, mar/2025 a mar/2026.
//    A planilha não traz abr e mai de 2025 nem de 2026; esses quatro meses são ESTIMADOS por
//    interpolação linear entre os meses vizinhos com dados (mar→jun de cada ano):
//      2025: NB1 4.969,42 e 5.283,34 | NB2 5.019,94 e 5.208,69
//      2026: NB1 4.402,19 e 5.116,17 | NB2 4.083,72 e 4.246,83
//  - "NB1/NB2 - Relatórios 2026": faturamento real líquido de jun a ago/2026. Setembro de NB1
//    existe só parcial e NB2 ainda não tem relatório, então o último mês fechado é agosto.
//    Para NB2/junho vale a versão definitiva (2ª janela), não a preliminar.
//  - A aba "Histórico 2026 (Gráficos)" não é usada: as séries de geração estão deslocadas
//    um mês em relação aos relatórios.
//
// O QUE É MOCK (não vem da planilha, trocar pelos dados reais do contrato):
//  - FRACAO_CLIENTE: definido em 1 a pedido do investidor — a plataforma exibe o líquido
//    COMPLETO de cada usina, sem dividir a "fração 1/3" dos sócios do demonstrativo.
//  - Datas de aquisição, cidade/UF e coordenadas.
//  - Eletropostos CRP Charge 60kW e 22kW (Eletroposto 2000, Cedro/CE): valorInvestido
//    PENDENTE (R$ 0 até o investidor informar), datas provisórias e previsão de operação.
//  - Documentos e avisos.
import type { Asset, AssetType, Investor, MonthlyIncome, Notice } from "@/types";
import { MESES_HISTORICO, ULTIMO_MES_FECHADO } from "./constants";

/** Fração do líquido da usina exibida na plataforma (1 = líquido completo). */
export const FRACAO_CLIENTE = 1;


const round = (v: number) => Math.round(v * 100) / 100;

/** Faturamento real líquido da usina inteira (R$), antes da fração do cliente. */
const LIQUIDO_NB1: Record<string, number> = {
  "2025-03": 4655.49,
  "2025-04": 4969.42, // estimado (interpolação mar→jun/25)
  "2025-05": 5283.34, // estimado (interpolação mar→jun/25)
  "2025-06": 5597.27,
  "2025-07": 5253.23,
  "2025-08": 6001.35,
  "2025-09": 9926.79,
  "2025-10": 5203.54,
  "2025-11": 8288.79,
  "2025-12": 5670.42,
  "2026-01": 5659.64,
  "2026-02": 5936.41,
  "2026-03": 3688.2,
  "2026-04": 4402.19, // estimado (interpolação mar→jun/26)
  "2026-05": 5116.17, // estimado (interpolação mar→jun/26)
  "2026-06": 5830.16,
  "2026-07": 4933.77,
  "2026-08": 5358.04,
};

const LIQUIDO_NB2: Record<string, number> = {
  "2025-03": 4831.19,
  "2025-04": 5019.94, // estimado (interpolação mar→jun/25)
  "2025-05": 5208.69, // estimado (interpolação mar→jun/25)
  "2025-06": 5397.44,
  "2025-07": 4748.98,
  "2025-08": 6440.08,
  "2025-09": 6481.82,
  "2025-10": 4568.65,
  "2025-11": 6915.43,
  "2025-12": 6568.5,
  "2026-01": 6499.42,
  "2026-02": 5492.43,
  "2026-03": 3920.62,
  "2026-04": 4083.72, // estimado (interpolação mar→jun/26)
  "2026-05": 4246.83, // estimado (interpolação mar→jun/26)
  "2026-06": 4409.93,
  "2026-07": 5382.25,
  "2026-08": 6236.11,
};

interface Seed {
  id: string;
  tipo: AssetType;
  nome: string;
  cidade: string;
  uf: string;
  dataAquisicao: string;
  inicioOperacao: string;
  valorInvestido: number;
  liquido: Record<string, number>;
  descricao: string;
  especificacoes: { rotulo: string; valor: string }[];
  coordenadas: { lat: number; lng: number };
}

const SEEDS: Seed[] = [
  {
    id: "nb1",
    tipo: "solar",
    nome: "Usina NB1",
    cidade: "Montes Claros",
    uf: "MG",
    dataAquisicao: "2025-02-20",
    inicioOperacao: "2025-03",
    valorInvestido: 240000,
    liquido: LIQUIDO_NB1,
    descricao: "Usina solar de geração distribuída. A energia gerada é compensada na unidade consumidora do beneficiário principal e o faturamento é liquidado todo mês na primeira janela.",
    especificacoes: [
      { rotulo: "Beneficiário principal", valor: "GREENLIFE (UC 6114876)" },
      { rotulo: "Janela de faturamento", valor: "1ª janela, por volta do dia 15" },
      { rotulo: "Geração de jun a ago/2026", valor: "25.158 kWh" },
      { rotulo: "Tarifa média de compensação", valor: "R$ 0,68 por kWh" },
      { rotulo: "Margem líquida média", valor: "80,1% do faturamento bruto" },
      { rotulo: "Sua participação", valor: "100% do líquido da usina" },
      { rotulo: "Modelo de receita", valor: "Venda de créditos de energia" },
    ],
    coordenadas: { lat: -16.7282, lng: -43.8578 },
  },
  {
    id: "nb2",
    tipo: "solar",
    nome: "Usina NB2",
    cidade: "Janaúba",
    uf: "MG",
    dataAquisicao: "2025-02-20",
    inicioOperacao: "2025-03",
    valorInvestido: 240000,
    liquido: LIQUIDO_NB2,
    descricao: "Usina solar de geração distribuída. O faturamento é liquidado na segunda janela de cada mês. O relatório preliminar de junho foi refeito nessa janela e vale o valor definitivo.",
    especificacoes: [
      { rotulo: "Beneficiário principal", valor: "ESTRELARIO (UC 59067561)" },
      { rotulo: "Janela de faturamento", valor: "2ª janela, por volta do dia 30" },
      { rotulo: "Geração de jun a ago/2026", valor: "27.257 kWh" },
      { rotulo: "Tarifa média de compensação", valor: "R$ 0,66 por kWh" },
      { rotulo: "Margem líquida média", valor: "80,6% do faturamento bruto" },
      { rotulo: "Sua participação", valor: "100% do líquido da usina" },
      { rotulo: "Modelo de receita", valor: "Venda de créditos de energia" },
    ],
    coordenadas: { lat: -15.8029, lng: -43.3094 },
  },
  {
    id: "charge-60kw",
    tipo: "charge",
    nome: "CRP Charge 60kW",
    cidade: "Cedro",
    uf: "CE",
    dataAquisicao: "2026-08-01",
    inicioOperacao: "2026-12",
    valorInvestido: 0,
    liquido: {},
    descricao: "Eletroposto de recarga rápida em construção no Eletroposto 2000. A receita virá da recarga de veículos elétricos assim que o ativo entrar em operação.",
    especificacoes: [
      { rotulo: "Local", valor: "Eletroposto 2000 — Cedro/CE" },
      { rotulo: "Potência", valor: "60 kW (DC, recarga rápida)" },
      { rotulo: "Situação", valor: "Em construção" },
      { rotulo: "Previsão de operação", valor: "Dezembro de 2026" },
      { rotulo: "Modelo de receita", valor: "Recarga de veículos elétricos" },
    ],
    coordenadas: { lat: -6.6006, lng: -39.0606 },
  },
  {
    id: "charge-22kw",
    tipo: "charge",
    nome: "CRP Charge 22kW",
    cidade: "Cedro",
    uf: "CE",
    dataAquisicao: "2026-08-01",
    inicioOperacao: "2026-12",
    valorInvestido: 0,
    liquido: {},
    descricao: "Eletroposto de recarga semi-rápida em construção no Eletroposto 2000. A receita virá da recarga de veículos elétricos assim que o ativo entrar em operação.",
    especificacoes: [
      { rotulo: "Local", valor: "Eletroposto 2000 — Cedro/CE" },
      { rotulo: "Potência", valor: "22 kW (AC, recarga semi-rápida)" },
      { rotulo: "Situação", valor: "Em construção" },
      { rotulo: "Previsão de operação", valor: "Dezembro de 2026" },
      { rotulo: "Modelo de receita", valor: "Recarga de veículos elétricos" },
    ],
    coordenadas: { lat: -6.6006, lng: -39.0606 },
  },
];

function historico(s: Seed): MonthlyIncome[] {
  return MESES_HISTORICO.map((mes) => ({ mes, valor: round((s.liquido[mes] ?? 0) * FRACAO_CLIENTE) }));
}

/** Rentabilidade mensal de referência: média da parcela do cliente sobre o capital, nos meses com renda. */
function yieldReferencia(s: Seed, hist: MonthlyIncome[]) {
  const com = hist.filter((h) => h.valor > 0);
  const media = com.reduce((a, h) => a + h.valor, 0) / (com.length || 1);
  return round((media / (s.valorInvestido || 1)) * 100);
}

export const ASSETS: Asset[] = SEEDS.map((s) => {
  const hist = historico(s);
  return {
    id: s.id,
    tipo: s.tipo,
    nome: s.nome,
    cidade: s.cidade,
    uf: s.uf,
    status: s.inicioOperacao > ULTIMO_MES_FECHADO ? "implantacao" : "ativo",
    dataAquisicao: s.dataAquisicao,
    inicioOperacao: s.inicioOperacao,
    valorInvestido: s.valorInvestido,
    yieldReferencia: yieldReferencia(s, hist),
    descricao: s.descricao,
    especificacoes: s.especificacoes,
    coordenadas: s.coordenadas,
    historico: hist,
    documentos: [
      { id: `${s.id}-contrato`, titulo: "Contrato de participação", tipo: "Contrato", data: s.dataAquisicao },
      { id: `${s.id}-laudo`, titulo: "Laudo técnico de instalação", tipo: "Laudo", data: s.dataAquisicao },
      { id: `${s.id}-seguro`, titulo: "Apólice de seguro patrimonial", tipo: "Seguro", data: s.dataAquisicao },
    ],
  };
});


export const DEMO_INVESTOR: Investor = { nome: "Magno Borges", email: "magno@exemplo.com.br" };


export const NOTICES: Notice[] = [
  {
    id: "n2",
    tipo: "relatorio",
    titulo: "Relatório de agosto disponível",
    detalhe: "Geração, compensação, custos e faturamento líquido de cada usina.",
    data: "2026-09-05",
    href: "/relatorios",
  },
  {
    id: "n3",
    tipo: "ativo",
    titulo: "NB1: setembro em andamento",
    detalhe: "O relatório parcial já mostra 2.835 kWh gerados. O fechamento do mês sai no próximo ciclo.",
    data: "2026-09-12",
    href: "/ativos/nb1",
  },
  {
    id: "n4",
    tipo: "ativo",
    titulo: "NB2: junho refeito na 2ª janela",
    detalhe: "O valor preliminar foi substituído pelo definitivo. Seus relatórios já usam o valor correto.",
    data: "2026-08-28",
    href: "/ativos/nb2",
  },
  {
    id: "n5",
    tipo: "ativo",
    titulo: "Eletroposto 2000: dois carregadores em construção",
    detalhe: "CRP Charge de 60 kW (DC) e 22 kW (AC) em Cedro/CE entram para a carteira. Os valores investidos serão lançados quando o contrato fechar.",
    data: "2026-09-10",
    href: "/ativos",
  },
];
