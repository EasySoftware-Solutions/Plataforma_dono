import { PageSkeleton } from "@/components/ui/skeleton";

// Exibido instantaneamente ao trocar de rota: o shell (menu e cabeçalho) permanece
// e só o conteúdo vira skeleton até a página responder. Também habilita o
// prefetch parcial das rotas dinâmicas pelos <Link> do menu.
export default function Loading() {
  return <PageSkeleton />;
}
