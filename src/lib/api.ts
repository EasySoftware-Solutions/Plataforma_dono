import type { Asset, BankAccount, Investor, MarketMonth, Notice, Payment } from "@/types";
import market from "./market.json";
import { ASSETS, DEMO_BANK, DEMO_INVESTOR, NOTICES, PAYMENTS } from "./mock-data";

// Ponto único de troca para o backend real: substitua o corpo destas funções por chamadas HTTP.
export const api = {
  async getInvestor(): Promise<Investor> {
    return DEMO_INVESTOR;
  },
  async getAssets(): Promise<Asset[]> {
    return ASSETS;
  },
  async getAsset(id: string): Promise<Asset | undefined> {
    return ASSETS.find((a) => a.id === id);
  },
  async getPayments(): Promise<Payment[]> {
    return PAYMENTS;
  },
  async getNotices(): Promise<Notice[]> {
    return NOTICES;
  },
  async getBankAccount(): Promise<BankAccount> {
    return DEMO_BANK;
  },
  // Séries reais: CDI (BCB SGS 4391), Selic (SGS 4390), poupança (SGS 195) e Ibovespa por fechamento mensal.
  async getMarket(): Promise<MarketMonth[]> {
    return market as MarketMonth[];
  },
};
