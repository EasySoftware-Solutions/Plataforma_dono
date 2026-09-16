import type { Metadata } from "next";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/panel";
import { AssetsTable } from "./assets-table";

export const metadata: Metadata = { title: "Meus ativos" };

export default async function AtivosPage() {
  const assets = await api.getAssets();
  return (
    <>
      <PageHeader title="Meus ativos" description="Cada posição da sua carteira, com status de operação e o rendimento que ela gerou no período." />
      <AssetsTable assets={assets} />
    </>
  );
}
