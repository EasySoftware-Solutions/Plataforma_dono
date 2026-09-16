import { AlertTriangle, CheckCircle2, Clock, HardHat, Loader, Wrench, Zap } from "lucide-react";
import type { AssetStatus, PaymentStatus } from "@/types";
import { STATUS_ATIVO, STATUS_PAGAMENTO } from "@/lib/constants";

const chip = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset";

export function PaymentStatusBadge({ status, previsto }: { status: PaymentStatus; previsto?: boolean }) {
  const map = {
    pago: { cls: "bg-positive/10 text-positive ring-positive/25", Icon: CheckCircle2 },
    processando: { cls: "bg-white/[0.07] text-ink-muted ring-white/12", Icon: Loader },
    pendente: { cls: "bg-white/[0.04] text-ink-subtle ring-white/10", Icon: Clock },
    atrasado: { cls: "bg-negative/10 text-negative ring-negative/25", Icon: AlertTriangle },
  }[status];
  return (
    <span className={`${chip} ${map.cls}`}>
      <map.Icon aria-hidden className="size-3.5" strokeWidth={2.25} />
      {previsto ? "Previsto" : STATUS_PAGAMENTO[status]}
    </span>
  );
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const map = {
    ativo: { cls: "bg-positive/10 text-positive ring-positive/25", Icon: Zap },
    implantacao: { cls: "bg-white/[0.07] text-ink-muted ring-white/12", Icon: HardHat },
    manutencao: { cls: "bg-negative/10 text-negative ring-negative/25", Icon: Wrench },
  }[status];
  return (
    <span className={`${chip} ${map.cls}`}>
      <map.Icon aria-hidden className="size-3.5" strokeWidth={2.25} />
      {STATUS_ATIVO[status]}
    </span>
  );
}
