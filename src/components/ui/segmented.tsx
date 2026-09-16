"use client";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  tone = "dark",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`flex w-full rounded-pill p-1 sm:inline-flex sm:w-auto ${tone === "dark" ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`h-8 flex-1 rounded-pill px-3.5 text-sm font-semibold transition-all duration-200 sm:flex-none ${
              active
                ? "bg-ink text-ink-dark shadow-[0_6px_18px_-8px_rgba(220,228,255,0.35)]"
                : tone === "dark"
                  ? "text-ink-subtle hover:text-ink"
                  : "text-ink-dark-muted hover:text-ink-dark"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
