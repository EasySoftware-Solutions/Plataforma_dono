import type { AssetStatus, AssetType, PaymentStatus } from "@/types";

export const HOJE = "2026-09-13";
export const ULTIMO_MES_FECHADO = "2026-08";

export const TIPOS: Record<AssetType, { nome: string; categoria: string; cor: string; imagem: string; foco: string; fundoClaro?: boolean; resumo: string }> = {
  charge: {
    nome: "CRP Charge",
    categoria: "Mobilidade elétrica",
    cor: "#1C96A8",
    imagem: "/assets/crp-charge.jpg",
    foco: "center",
    fundoClaro: true,
    resumo: "Estações de carregamento para veículos elétricos: equipamento, infraestrutura, instalação, operação e gestão.",
  },
  tank: {
    nome: "CRP Tank",
    categoria: "Infraestrutura",
    cor: "#9B5EE8",
    imagem: "/assets/crp-tank.jpg",
    foco: "center",
    resumo: "Infraestrutura e soluções para postos de combustível: modernização, estruturação e operações de abastecimento.",
  },
  capaxero: {
    nome: "Capaxero",
    categoria: "Serviços",
    cor: "#D9538F",
    imagem: "/assets/capaxero.jpg",
    foco: "center 20%",
    resumo: "Máquinas de higienização de capacetes como fonte de receita em locais com grande circulação de motociclistas.",
  },
  solar: {
    nome: "Usinas Solares",
    categoria: "Energia solar",
    cor: "#C0851E",
    imagem: "/assets/usinas-solares.jpg",
    foco: "30% center",
    resumo: "Usinas solares de investimento: geração de energia e eficiência energética.",
  },
};

export const TIPO_ORDEM: AssetType[] = ["charge", "tank", "capaxero", "solar"];

export const STATUS_ATIVO: Record<AssetStatus, string> = {
  ativo: "Em operação",
  implantacao: "Em implantação",
  manutencao: "Em manutenção",
};

export const STATUS_PAGAMENTO: Record<PaymentStatus, string> = {
  pago: "Pago",
  processando: "Processando",
  pendente: "Previsto",
  atrasado: "Atrasado",
};
