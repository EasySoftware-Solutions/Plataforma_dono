import Image from "next/image";
import { TIPOS, TIPO_ORDEM } from "@/lib/constants";

export function AssetShowcase() {
  return (
    <ul className="mt-12 grid gap-5 md:grid-cols-2">
      {TIPO_ORDEM.map((t, i) => {
        const tipo = TIPOS[t];
        return (
          <li
            key={t}
            className="asset-card group relative overflow-hidden rounded-card bg-crp-surface shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow duration-500"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={tipo.imagem}
                alt={tipo.nome}
                fill
                sizes="(min-width: 768px) 620px, 100vw"
                style={{ objectPosition: tipo.foco, filter: tipo.fundoClaro ? "contrast(1.2) saturate(1.1)" : undefined }}
                className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {tipo.fundoClaro && (
                <div aria-hidden className="absolute inset-0 bg-crp-navy mix-blend-multiply" style={{ opacity: 0.72 }} />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-crp-navy-deep via-crp-navy-deep/75 via-45% to-transparent transition-[background] duration-500 group-hover:from-crp-navy-deep group-hover:via-crp-navy-deep/90"
              />
              <div aria-hidden className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-crp-navy-deep/55 to-transparent" />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                style={{ background: tipo.cor }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-xs font-semibold text-ink-subtle backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  <span aria-hidden className="size-1.5 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ background: tipo.cor }} />
                  {tipo.categoria}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-ink transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">{tipo.nome}</h3>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-muted transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  {tipo.resumo}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
