import { AlertTriangle, CheckCircle2, Clock, HardHat, Loader, Wrench, Zap } from "lucide-react";
import type { AssetStatus, PaymentStatus } from "@/types";
import { STATUS_ATIVO, STATUS_PAGAMENTO } from "@/lib/constants";

const chip = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";

export function PaymentStatusBadge({ status, previsto }: { status: PaymentStatus; previsto?: boolean }) {
  const map = {
    pago: { cls: "bg-positive/12 text-positive", Icon: CheckCircle2 },
    processando: { cls: "bg-white/10 text-ink-muted", Icon: Loader },
    pendente: { cls: "bg-white/[0.06] text-ink-subtle", Icon: Clock },
    atrasado: { cls: "bg-negative/12 text-negative", Icon: AlertTriangle },
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
    ativo: { cls: "bg-positive/12 text-positive", Icon: Zap },
    implantacao: { cls: "bg-white/10 text-ink-muted", Icon: HardHat },
    manutencao: { cls: "bg-negative/12 text-negative", Icon: Wrench },
  }[status];
  return (
    <span className={`${chip} ${map.cls}`}>
      <map.Icon aria-hidden className="size-3.5" strokeWidth={2.25} />
      {STATUS_ATIVO[status]}
    </span>
  );
}
