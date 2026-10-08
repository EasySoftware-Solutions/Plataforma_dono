import type { Metadata } from "next";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { ULTIMO_MES_FECHADO } from "@/lib/constants";
import { mesLongo } from "@/lib/format";
import { AssetList, IncomePanel, PortfolioSummary, TopPerformers } from "@/components/dashboard/overview";
import { PageHeader } from "@/components/ui/panel";

export const metadata: Metadata = { title: "Visão geral" };

export default async function DashboardPage() {
  const [session, assets] = await Promise.all([getSession(), api.getAssets()]);
  const primeiroNome = session?.nome.split(" ")[0] ?? "investidor";

  return (
    <>
      <PageHeader title={`Olá, ${primeiroNome}`} description={`Posição fechada em ${mesLongo(ULTIMO_MES_FECHADO)}.`} />
      <div className="space-y-4">
        <PortfolioSummary assets={assets} />
        <IncomePanel assets={assets} />
        <TopPerformers assets={assets} />
        <AssetList assets={assets} />
      </div>
    </>
  );
}
