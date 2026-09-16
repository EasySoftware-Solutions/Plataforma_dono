import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`card-elev min-w-0 rounded-card ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold text-ink">{title}</h2>}
            {description && <p className="mt-1 text-sm text-ink-subtle">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={`px-5 pb-5 pt-4 sm:px-6 sm:pb-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold leading-tight text-ink sm:text-[34px]">{title}</h1>
        {description && <p className="mt-2 max-w-[62ch] text-[15px] text-ink-subtle">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <p className="text-base font-semibold text-ink">{title}</p>
      {children && <p className="mt-2 max-w-[44ch] text-sm text-ink-subtle">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className={`num inline-flex items-center gap-0.5 text-sm font-semibold ${up ? "text-positive" : "text-negative"}`}>
      {up ? <ArrowUpRight aria-hidden className="size-4" strokeWidth={2.5} /> : <ArrowDownRight aria-hidden className="size-4" strokeWidth={2.5} />}
      <span className="sr-only">{up ? "Alta de" : "Queda de"}</span>
      {Math.abs(value).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      {suffix}
    </span>
  );
}
