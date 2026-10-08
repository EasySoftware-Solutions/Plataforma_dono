import Image from "next/image";
import { TIPOS, TIPO_ORDEM } from "@/lib/constants";
import { Reveal } from "@/components/motion/reveal";

// Quatro negócios, quatro células: composição assimétrica no desktop (7+5 / 5+7)
// e carrossel com snap no celular. Categoria e texto ficam abaixo da imagem, nunca sobre ela.
const SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"] as const;

export function AssetBento() {
  return (
    <Reveal className="mt-12" y={32} amount={0.1}>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {TIPO_ORDEM.map((t, i) => {
          const tipo = TIPOS[t];
          return (
            <li key={t} className={`group flex w-[84%] shrink-0 snap-center flex-col overflow-hidden rounded-card bg-dono-surface ring-1 ring-inset ring-white/[0.06] sm:w-[58%] lg:w-auto ${SPAN[i]}`}>
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[300px] lg:flex-1">
                <Image
                  src={tipo.imagem}
                  alt={tipo.nome}
                  fill
                  sizes="(min-width: 1024px) 700px, 84vw"
                  style={{ objectPosition: tipo.foco, filter: tipo.fundoClaro ? "contrast(1.2) saturate(1.1)" : undefined }}
                  className="object-cover transition-transform duration-[700ms] ease-out-expo motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
                />
                {tipo.fundoClaro && <div aria-hidden className="absolute inset-0 bg-dono-base mix-blend-multiply" style={{ opacity: 0.72 }} />}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dono-surface via-transparent to-transparent" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm font-semibold text-ink-subtle">{tipo.categoria}</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-ink">{tipo.nome}</h3>
                <p className="mt-2.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">{tipo.resumo}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
