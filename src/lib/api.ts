import { cache } from "react";
import type { Asset, Investor, MarketMonth, Notice } from "@/types";
import market from "./market.json";
import { ASSETS, DEMO_INVESTOR, NOTICES } from "./mock-data";

// Ponto único de troca para o backend real: substitua o corpo destas funções por chamadas HTTP.
// Cada função é envolvida em `cache` para que layout, página e generateMetadata
// compartilhem o mesmo resultado dentro de um request, sem chamadas duplicadas.
export const api = {
  getInvestor: cache(async (): Promise<Investor> => DEMO_INVESTOR),
  getAssets: cache(async (): Promise<Asset[]> => ASSETS),
  getAsset: cache(async (id: string): Promise<Asset | undefined> => ASSETS.find((a) => a.id === id)),
  getNotices: cache(async (): Promise<Notice[]> => NOTICES),
  // Séries reais de mercado, geradas por scripts/update-market.mjs (npm run market:update):
  // CDI e poupança (BCB), Tesouro Selic (Tesouro Transparente), ITUB4 e BBAS3 (Yahoo Finance).
  getMarket: cache(async (): Promise<MarketMonth[]> => market as MarketMonth[]),
};
