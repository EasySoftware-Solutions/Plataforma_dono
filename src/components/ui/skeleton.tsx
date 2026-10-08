export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-lg ${className}`} />;
}

export function PanelSkeleton({ bodyHeight = "h-48", className = "" }: { bodyHeight?: string; className?: string }) {
  return (
    <div aria-hidden className={`card-elev rounded-card p-5 sm:p-6 ${className}`}>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2.5 h-3 w-64 max-w-full" />
      <Skeleton className={`mt-6 w-full ${bodyHeight}`} />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando…</span>
      <div className="mb-8">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <PanelSkeleton bodyHeight="h-28" />
          <PanelSkeleton bodyHeight="h-28" />
        </div>
        <PanelSkeleton bodyHeight="h-[300px]" />
      </div>
    </div>
  );
}
