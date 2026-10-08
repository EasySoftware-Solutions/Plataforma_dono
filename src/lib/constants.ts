import type { AssetStatus, AssetType } from "@/types";
import { mesesAte } from "./months";

export const HOJE = "2026-09-13";
export const ULTIMO_MES_FECHADO = "2026-08";

/** Janela de histórico exibida na plataforma: 24 meses até o último fechamento. */
export const MESES_HISTORICO: readonly string[] = mesesAte(ULTIMO_MES_FECHADO, 24);
export const ULTIMOS_12: readonly string[] = MESES_HISTORICO.slice(-12);

export const TIPOS: Record<AssetType, { nome: string; categoria: string; cor: string; imagem: string; foco: string; fundoClaro?: boolean; resumo: string }> = {
  charge: {
    nome: "CRP Charge",
    categoria: "Mobilidade elétrica",
    cor: "#3FB9A4",
    imagem: "/assets/crp-charge.jpg",
    foco: "center",
    fundoClaro: true,
    resumo: "Estações de carregamento para veículos elétricos: equipamento, infraestrutura, instalação, operação e gestão.",
  },
  tank: {
    nome: "CRP Tank",
    categoria: "Infraestrutura",
    cor: "#8B6CC8",
    imagem: "/assets/crp-tank.jpg",
    foco: "center",
    resumo: "Infraestrutura e soluções para postos de combustível: modernização, estruturação e operações de abastecimento.",
  },
  capaxero: {
    nome: "Capaxero",
    categoria: "Serviços",
    cor: "#E0607E",
    imagem: "/assets/capaxero.jpg",
    foco: "center 20%",
    resumo: "Máquinas de higienização de capacetes como fonte de receita em locais com grande circulação de motociclistas.",
  },
  solar: {
    nome: "Usinas Solares",
    categoria: "Energia solar",
    cor: "#27AAE1",
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

