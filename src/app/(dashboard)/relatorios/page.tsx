import type { Metadata } from "next";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/panel";
import { Reports } from "./reports";

export const metadata: Metadata = { title: "Relatórios" };

export default async function RelatoriosPage() {
  const [assets, investidor] = await Promise.all([api.getAssets(), getSession()]);
  return (
    <>
      <PageHeader title="Relatórios" description="Escolha o período e baixe em PDF para ler ou em Excel para trabalhar os números." />
      <Reports assets={assets} investidor={investidor?.nome ?? "Investidor"} />
    </>
  );
}
