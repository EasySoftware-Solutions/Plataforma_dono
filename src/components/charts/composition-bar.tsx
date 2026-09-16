import type { AssetType } from "@/types";
import { TIPOS } from "@/lib/constants";
import { brl, pct } from "@/lib/format";

export function CompositionBar({ items }: { items: { tipo: AssetType; valor: number; pct: number }[] }) {
  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label="Composição da carteira por tipo de ativo">
        {items.map((i) => (
          <div key={i.tipo} style={{ width: `${i.pct}%`, background: TIPOS[i.tipo].cor }} title={`${TIPOS[i.tipo].nome}: ${pct(i.pct, { digits: 1 })}`} />
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((i) => (
          <li key={i.tipo} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2.5 text-ink-muted">
              <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: TIPOS[i.tipo].cor }} />
              {TIPOS[i.tipo].nome}
            </span>
            <span className="flex items-baseline gap-3">
              <span className="num text-ink-subtle">{brl(i.valor)}</span>
              <span className="num w-14 text-right font-semibold text-ink">{pct(i.pct, { digits: 1 })}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
