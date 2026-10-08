import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

// Assinatura da marca. `qualifier` segue a arquitetura do manual: DONO como marca
// principal e o qualificador da frente (a plataforma de investidores é a frente Gestão).
// No celular o qualificador some para o cabeçalho caber em 360-390px sem cortar o avatar.
export function Logo({ href = "/", className = "", qualifier }: { href?: string; className?: string; qualifier?: string }) {
  return (
    <Link
      href={href}
      aria-label={qualifier ? `DONO ${qualifier}, página inicial` : "DONO, página inicial"}
      className={`relative inline-flex items-center gap-2.5 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[""] ${className}`}
    >
      <Wordmark title={null} className="h-[22px] w-auto shrink-0" />
      {qualifier && (
        <span className="hidden border-l border-ink-subtle/40 pl-2.5 font-display sm:inline text-[11px] font-bold uppercase leading-none tracking-[0.12em] text-ink-subtle">
          {qualifier}
        </span>
      )}
    </Link>
  );
}
