import type { Metadata } from "next";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui/panel";
import { PaymentsView } from "./payments-view";

export const metadata: Metadata = { title: "Pagamentos" };

export default async function PagamentosPage() {
  const [assets, payments, bank] = await Promise.all([api.getAssets(), api.getPayments(), api.getBankAccount()]);
  return (
    <>
      <PageHeader title="Pagamentos" description="Tudo o que você já recebeu, o que está a caminho e para onde o dinheiro vai." />
      <PaymentsView assets={assets} payments={payments} bank={bank} />
    </>
  );
}
