"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

// Isola falhas de uma página: o menu continua utilizável e o usuário pode tentar de novo.
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="card-elev rounded-card">
      <EmptyState
        title="Não foi possível carregar esta página"
        action={
          <Button variant="secondary" onClick={reset}>
            <RotateCcw aria-hidden className="size-4" />
            Tentar de novo
          </Button>
        }
      >
        Pode ter sido uma instabilidade momentânea. Seus dados não foram alterados.
      </EmptyState>
    </section>
  );
}
