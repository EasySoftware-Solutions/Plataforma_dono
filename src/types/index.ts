export type AssetType = "charge" | "tank" | "capaxero" | "solar";
export type AssetStatus = "ativo" | "implantacao" | "manutencao";

export interface MonthlyIncome {
  mes: string;
  valor: number;
}

export interface AssetDocument {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
}

export interface Asset {
  id: string;
  tipo: AssetType;
  nome: string;
  cidade: string;
  uf: string;
  status: AssetStatus;
  dataAquisicao: string;
  inicioOperacao: string;
  valorInvestido: number;
  yieldReferencia: number;
  descricao: string;
  especificacoes: { rotulo: string; valor: string }[];
  coordenadas: { lat: number; lng: number };
  historico: MonthlyIncome[];
  documentos: AssetDocument[];
}

export interface MarketMonth {
  mes: string;
  cdi: number;
  selic: number;
  poupanca: number;
  itub4: number;
  bbas3: number;
}

export interface Notice {
  id: string;
  tipo: "relatorio" | "ativo";
  titulo: string;
  detalhe: string;
  data: string;
  href: string;
}

export interface Investor {
  nome: string;
  email: string;
}

