import { EmptyState } from "@/components/ui/panel";
import { ButtonLink } from "@/components/ui/button";

export default function AtivoNaoEncontrado() {
  return (
    <section className="card-elev rounded-card">
      <EmptyState title="Ativo não encontrado" action={<ButtonLink href="/ativos" variant="secondary">Ver meus ativos</ButtonLink>}>
        Este endereço não corresponde a nenhuma posição da sua carteira.
      </EmptyState>
    </section>
  );
}
