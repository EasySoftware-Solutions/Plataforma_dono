import type { Metadata } from "next";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/panel";
import { Comparator } from "./comparator";

export const metadata: Metadata = { title: "Comparador" };

export default async function ComparadorPage() {
  const [assets, market] = await Promise.all([api.getAssets(), api.getMarket()]);
  return (
    <>
      <PageHeader
        title="Comparador"
        description="Acompanhe o rendimento mensal da Carteira DONO e compare a performance com CDI, Tesouro Selic, Poupança e as ações do Itaú e do Banco do Brasil."
      />
      <Comparator assets={assets} market={market} />
    </>
  );
}
