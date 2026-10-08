import { HardHat, Wrench, Zap } from "lucide-react";
import type { AssetStatus } from "@/types";
import { STATUS_ATIVO } from "@/lib/constants";

const chip = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset";

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
