// TODO(dados reais): todo o conteúdo deste arquivo é DEMONSTRAÇÃO.
// Posições, valores investidos, yields, rendimentos e pagamentos são fictícios
// e precisam ser substituídos pelos dados reais antes de qualquer publicação.
import type { Asset, AssetType, BankAccount, Investor, MonthlyIncome, Notice, Payment } from "@/types";
import { HOJE, ULTIMO_MES_FECHADO } from "./constants";

export const MESES_HISTORICO: string[] = (() => {
  const out: string[] = [];
  let y = 2024;
  let m = 9;
  while (out.length < 24) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
})();

export const addMonths = (mes: string, n: number) => {
  const [y, m] = mes.split("-").map(Number);
  const t = y * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
};

const monthsBetween = (a: string, b: string) => {
  const [ya, ma] = a.split("-").map(Number);
  const [yb, mb] = b.split("-").map(Number);
  return yb * 12 + mb - (ya * 12 + ma);
};

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SAZONAL_SOLAR = [1.12, 1.1, 1.05, 0.97, 0.9, 0.86, 0.88, 0.93, 1.0, 1.06, 1.1, 1.13];

interface Seed {
  id: string;
  tipo: AssetType;
  nome: string;
  cidade: string;
  uf: string;
  dataAquisicao: string;
  inicioOperacao: string;
  valorInvestido: number;
  yieldReferencia: number;
  manutencao?: string[];
  descricao: string;
  especificacoes: { rotulo: string; valor: string }[];
  coordenadas: { lat: number; lng: number };
}

const SEEDS: Seed[] = [
  {
    id: "charge-campinas",
    tipo: "charge",
    nome: "Eletroposto Anhanguera",
    cidade: "Campinas",
    uf: "SP",
    dataAquisicao: "2024-07-18",
    inicioOperacao: "2024-09",
    valorInvestido: 180000,
    yieldReferencia: 1.45,
    descricao: "Estação de recarga rápida à beira de rodovia, com operação e manutenção feitas pela CRP Charge.",
    especificacoes: [
      { rotulo: "Carregadores", valor: "2 DC de 60 kW e 4 AC de 22 kW" },
      { rotulo: "Operação", valor: "24 horas, 7 dias" },
      { rotulo: "Modelo de receita", valor: "Tarifa por kWh recarregado" },
    ],
    coordenadas: { lat: -22.9056, lng: -47.0608 },
  },
  {
    id: "charge-sp",
    tipo: "charge",
    nome: "Hub de Recarga Zona Sul",
    cidade: "São Paulo",
    uf: "SP",
    dataAquisicao: "2025-02-11",
    inicioOperacao: "2025-04",
    valorInvestido: 120000,
    yieldReferencia: 1.38,
    descricao: "Hub urbano de recarga em estacionamento de alto giro, com ocupação crescente desde a inauguração.",
    especificacoes: [
      { rotulo: "Carregadores", valor: "1 DC de 40 kW e 6 AC de 11 kW" },
      { rotulo: "Operação", valor: "6h às 24h" },
      { rotulo: "Modelo de receita", valor: "Tarifa por kWh e por tempo de vaga" },
    ],
    coordenadas: { lat: -23.6509, lng: -46.6951 },
  },
  {
    id: "tank-sorocaba",
    tipo: "tank",
    nome: "Posto Serra Azul",
    cidade: "Sorocaba",
    uf: "SP",
    dataAquisicao: "2024-07-30",
    inicioOperacao: "2024-09",
    valorInvestido: 250000,
    yieldReferencia: 1.22,
    descricao: "Modernização completa da infraestrutura de abastecimento, remunerada por participação no volume vendido.",
    especificacoes: [
      { rotulo: "Escopo", valor: "6 bombas, tanques e automação" },
      { rotulo: "Volume de referência", valor: "420 mil litros por mês" },
      { rotulo: "Modelo de receita", valor: "Participação por litro" },
    ],
    coordenadas: { lat: -23.5015, lng: -47.4526 },
  },
  {
    id: "capaxero-bh",
    tipo: "capaxero",
    nome: "Rede Capaxero Centro",
    cidade: "Belo Horizonte",
    uf: "MG",
    dataAquisicao: "2024-12-05",
    inicioOperacao: "2025-01",
    valorInvestido: 45000,
    yieldReferencia: 1.7,
    manutencao: ["2026-07", "2026-08"],
    descricao: "Rede de máquinas de higienização de capacetes em estacionamentos e pontos de entrega por moto.",
    especificacoes: [
      { rotulo: "Máquinas", valor: "10 unidades" },
      { rotulo: "Pontos", valor: "Estacionamentos e hubs de entrega" },
      { rotulo: "Modelo de receita", valor: "Valor por higienização" },
    ],
    coordenadas: { lat: -19.9167, lng: -43.9345 },
  },
  {
    id: "capaxero-curitiba",
    tipo: "capaxero",
    nome: "Rede Capaxero Terminais",
    cidade: "Curitiba",
    uf: "PR",
    dataAquisicao: "2025-09-22",
    inicioOperacao: "2025-10",
    valorInvestido: 36000,
    yieldReferencia: 1.65,
    descricao: "Máquinas instaladas em terminais e bolsões de estacionamento de motos.",
    especificacoes: [
      { rotulo: "Máquinas", valor: "8 unidades" },
      { rotulo: "Pontos", valor: "Terminais e bolsões de motos" },
      { rotulo: "Modelo de receita", valor: "Valor por higienização" },
    ],
    coordenadas: { lat: -25.4284, lng: -49.2733 },
  },
  {
    id: "solar-montes-claros",
    tipo: "solar",
    nome: "Usina Solar Montes Claros I",
    cidade: "Montes Claros",
    uf: "MG",
    dataAquisicao: "2024-06-14",
    inicioOperacao: "2024-09",
    valorInvestido: 320000,
    yieldReferencia: 1.3,
    descricao: "Usina de solo com energia injetada na rede e créditos vendidos a consumidores comerciais.",
    especificacoes: [
      { rotulo: "Potência instalada", valor: "1,2 MWp" },
      { rotulo: "Geração média", valor: "160 MWh por mês" },
      { rotulo: "Modelo de receita", valor: "Venda de créditos de energia" },
    ],
    coordenadas: { lat: -16.7282, lng: -43.8578 },
  },
  {
    id: "solar-petrolina",
    tipo: "solar",
    nome: "Usina Solar Petrolina II",
    cidade: "Petrolina",
    uf: "PE",
    dataAquisicao: "2026-06-03",
    inicioOperacao: "2026-11",
    valorInvestido: 280000,
    yieldReferencia: 1.35,
    descricao: "Usina em construção, com conexão à rede prevista para novembro de 2026.",
    especificacoes: [
      { rotulo: "Potência prevista", valor: "1,0 MWp" },
      { rotulo: "Conexão prevista", valor: "Novembro de 2026" },
      { rotulo: "Modelo de receita", valor: "Venda de créditos de energia" },
    ],
    coordenadas: { lat: -9.3891, lng: -40.5027 },
  },
];

function fator(s: Seed, mes: string, r: () => number) {
  const idade = monthsBetween(s.inicioOperacao, mes);
  const ruido = 0.96 + r() * 0.08;
  switch (s.tipo) {
    case "solar":
      return SAZONAL_SOLAR[Number(mes.split("-")[1]) - 1] * ruido;
    case "charge":
      return Math.min(1, 0.62 + idade * 0.065) * (1 + idade * 0.004) * ruido;
    case "capaxero":
      return (s.manutencao?.includes(mes) ? 0.35 : Math.min(1, 0.7 + idade * 0.08)) * ruido;
    default:
      return (0.98 + r() * 0.04) * ruido;
  }
}

const round = (v: number) => Math.round(v * 100) / 100;

function historico(s: Seed, seed: number): MonthlyIncome[] {
  const r = rng(seed);
  return MESES_HISTORICO.map((mes) => ({
    mes,
    valor:
      monthsBetween(s.inicioOperacao, mes) < 0
        ? 0
        : round(((s.valorInvestido * s.yieldReferencia) / 100) * fator(s, mes, r)),
  }));
}

function status(s: Seed): Asset["status"] {
  if (s.inicioOperacao > ULTIMO_MES_FECHADO) return "implantacao";
  if (s.manutencao?.includes(ULTIMO_MES_FECHADO)) return "manutencao";
  return "ativo";
}

export const ASSETS: Asset[] = SEEDS.map((s, i) => ({
  id: s.id,
  tipo: s.tipo,
  nome: s.nome,
  cidade: s.cidade,
  uf: s.uf,
  status: status(s),
  dataAquisicao: s.dataAquisicao,
  inicioOperacao: s.inicioOperacao,
  valorInvestido: s.valorInvestido,
  yieldReferencia: s.yieldReferencia,
  descricao: s.descricao,
  especificacoes: s.especificacoes,
  coordenadas: s.coordenadas,
  historico: historico(s, 1000 + i * 97),
  documentos: [
    { id: `${s.id}-contrato`, titulo: "Contrato de aquisição", tipo: "Contrato", data: s.dataAquisicao },
    { id: `${s.id}-laudo`, titulo: "Laudo técnico de instalação", tipo: "Laudo", data: s.dataAquisicao },
    { id: `${s.id}-seguro`, titulo: "Apólice de seguro patrimonial", tipo: "Seguro", data: s.dataAquisicao },
  ],
}));

function payments(): Payment[] {
  const out: Payment[] = [];
  for (const a of ASSETS) {
    for (const h of a.historico) {
      if (h.valor <= 0) continue;
      const dataPg = `${addMonths(h.mes, 1)}-10`;
      let st: Payment["status"] = dataPg <= HOJE ? "pago" : "pendente";
      if (h.mes === ULTIMO_MES_FECHADO && a.id === "capaxero-bh") st = "atrasado";
      if (h.mes === ULTIMO_MES_FECHADO && a.id === "solar-montes-claros") st = "processando";
      out.push({ id: `${a.id}-${h.mes}`, assetId: a.id, competencia: h.mes, data: dataPg, valor: h.valor, status: st });
    }
    for (let k = 1; k <= 3; k++) {
      const mes = addMonths(ULTIMO_MES_FECHADO, k);
      if (mes < a.inicioOperacao) continue;
      const sazonal = a.tipo === "solar" ? SAZONAL_SOLAR[Number(mes.split("-")[1]) - 1] : 1;
      const manut = a.status === "manutencao" && k === 1 ? 0.6 : 1;
      out.push({
        id: `${a.id}-${mes}`,
        assetId: a.id,
        competencia: mes,
        data: `${addMonths(mes, 1)}-10`,
        valor: round(((a.valorInvestido * a.yieldReferencia) / 100) * sazonal * manut),
        status: "pendente",
        previsto: true,
      });
    }
  }
  return out.sort((x, y) => (x.data === y.data ? y.valor - x.valor : y.data.localeCompare(x.data)));
}

export const PAYMENTS: Payment[] = payments();

export const DEMO_INVESTOR: Investor = { nome: "Ricardo Almeida", email: "ricardo@exemplo.com.br" };

export const DEMO_BANK: BankAccount = {
  banco: "341 · Itaú Unibanco",
  agencia: "0472",
  conta: "31845-2",
  titular: "Ricardo Almeida",
  pix: "ricardo@exemplo.com.br",
};

export const NOTICES: Notice[] = [
  {
    id: "n1",
    tipo: "pagamento",
    titulo: "Pagamento de agosto em andamento",
    detalhe: "4 repasses pagos, 1 em processamento e 1 atrasado.",
    data: "2026-09-10",
    href: "/pagamentos",
  },
  {
    id: "n2",
    tipo: "ativo",
    titulo: "Rede Capaxero Centro em manutenção",
    detalhe: "Troca preventiva de módulos. O repasse de agosto está atrasado.",
    data: "2026-09-08",
    href: "/ativos/capaxero-bh",
  },
  {
    id: "n3",
    tipo: "relatorio",
    titulo: "Relatório de agosto disponível",
    detalhe: "Rendimentos, pagamentos e desempenho por ativo.",
    data: "2026-09-05",
    href: "/relatorios",
  },
  {
    id: "n4",
    tipo: "ativo",
    titulo: "Petrolina II: obra em andamento",
    detalhe: "Conexão à rede prevista para novembro de 2026.",
    data: "2026-08-28",
    href: "/ativos/solar-petrolina",
  },
];
