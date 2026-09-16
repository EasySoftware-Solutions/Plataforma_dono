export type AssetType = "charge" | "tank" | "capaxero" | "solar";
export type AssetStatus = "ativo" | "implantacao" | "manutencao";
export type PaymentStatus = "pago" | "processando" | "pendente" | "atrasado";

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

export interface Payment {
  id: string;
  assetId: string;
  competencia: string;
  data: string;
  valor: number;
  status: PaymentStatus;
  previsto?: boolean;
}

export interface MarketMonth {
  mes: string;
  cdi: number;
  selic: number;
  poupanca: number;
  ibovespa: number;
  btc?: number;
  eth?: number;
}

export interface Notice {
  id: string;
  tipo: "pagamento" | "relatorio" | "ativo";
  titulo: string;
  detalhe: string;
  data: string;
  href: string;
}

export interface Investor {
  nome: string;
  email: string;
}

export interface BankAccount {
  banco: string;
  agencia: string;
  conta: string;
  titular: string;
  pix: string;
}
