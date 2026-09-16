import Link from "next/link";

export function Logo({ href = "/", tone = "light", className = "" }: { href?: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="DONO, página inicial"
      className={`inline-flex items-baseline gap-[3px] text-[22px] font-extrabold leading-none tracking-[-0.03em] ${tone === "light" ? "text-ink" : "text-ink-dark"} ${className}`}
    >
      DONO
      <span aria-hidden className="inline-block size-[7px] rounded-[2px] bg-crp-blue" />
    </Link>
  );
}
