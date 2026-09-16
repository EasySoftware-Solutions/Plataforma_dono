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
      className={`inline-flex rounded-pill p-1 ${tone === "dark" ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}
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
            className={`h-8 rounded-pill px-3.5 text-sm font-semibold transition-colors duration-200 ${
              active
                ? tone === "dark"
                  ? "bg-crp-blue text-ink"
                  : "bg-crp-navy text-ink"
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
