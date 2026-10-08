import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { MESES_HISTORICO, TIPOS, TIPO_ORDEM } from "@/lib/constants";
import { indiceBase100, metricas, retornosDono, retornosMercado } from "@/lib/calc";
import { mesLongo } from "@/lib/format";
import { SERIES } from "@/lib/series";
import { Logo } from "@/components/logo";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { BrandIntro } from "@/components/intro/brand-intro";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroVideo } from "@/components/landing/hero-video";
import { SplitWords } from "@/components/landing/split-words";
import { ManifestoScroll } from "@/components/landing/manifesto-scroll";
import { AssetBento } from "@/components/landing/asset-bento";
import { StepsSticky } from "@/components/landing/steps-sticky";
import { ProductFrame } from "@/components/landing/product-frame";
import { IncomePanel, PortfolioSummary } from "@/components/dashboard/overview";
import { IndexLines } from "@/components/charts/index-lines";

const CRP = "https://grupocrp.com.br/";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const RESUMO = [
  { t: "4 negócios reais", d: "Energia, mobilidade e serviços" },
  { t: "100% seu", d: "Você é dono do ativo, não de uma cota" },
  { t: "Todo mês", d: "Relatório de rendimento por ativo" },
  { t: "Lado a lado", d: "Compare com CDI, Tesouro Selic e poupança" },
];

const ETAPAS = [
  { t: "Entre com seu e-mail", d: "Sua carteira aparece completa, ativo por ativo." },
  { t: "Acompanhe cada ativo", d: "Status de operação, rendimento mensal, documentos e a comparação com CDI, Tesouro Selic e poupança." },
  { t: "Baixe e declare", d: "Gere relatórios em PDF ou Excel e o informe de rendimentos na hora do imposto de renda." },
];

export default async function Home() {
  const [assets, market] = await Promise.all([api.getAssets(), api.getMarket()]);
  const meses = MESES_HISTORICO;
  const indice = indiceBase100(market, assets, meses);
  const acumulados = {
    dono: metricas(retornosDono(assets, meses)).acumulado,
    cdi: metricas(retornosMercado(market, meses, "cdi")).acumulado,
    poupanca: metricas(retornosMercado(market, meses, "poupanca")).acumulado,
  };

  return (
    <>
      <BrandIntro />
      <SiteHeader />
      <main>
        {/* Hero: título, subtexto e chamadas. Nada além disso. */}
        <section className="relative flex min-h-dvh items-end overflow-hidden bg-dono-deep pb-14 pt-28 sm:items-center sm:pb-24">
          <HeroVideo src="/assets/hero.mp4" poster="/assets/usinas-solares.jpg" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
            <h1 className="font-display text-[clamp(2.25rem,6vw,4.75rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink">
              <span className="block">
                <SplitWords text="No banco, seu dinheiro rende." />
              </span>
              <span className="block text-dono-blue">
                <SplitWords text="Aqui, ele produz." start={5} />
              </span>
            </h1>
            <p data-hero-in style={delay(520)} className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink-muted sm:text-lg">
              Carregadores elétricos, postos, máquinas Capaxero e usinas solares que são seus, com rendimento e relatórios à vista.
            </p>
            <div data-hero-in style={delay(640)} className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/login" size="lg">Abra sua conta</ButtonLink>
              <a href="#manifesto" className={buttonClass("secondary", "lg", "backdrop-blur-sm")}>Conhecer a DONO</a>
            </div>
          </div>
        </section>

        {/* Faixa de resumo */}
        <section aria-label="Em resumo" className="bg-dono-blue text-on-accent">
          <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:py-12">
            {RESUMO.map((i) => (
              <li key={i.t}>
                <p className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.02em]">{i.t}</p>
                <p className="mt-1 text-[15px] font-medium text-on-accent/80">{i.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Manifesto: o texto acende palavra a palavra conforme a rolagem */}
        <section id="manifesto" className="scroll-mt-16 bg-dono-paper text-ink-dark">
          <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-36">
            <ManifestoScroll
              text="Renda passiva sempre foi sobre ter. A DONO é sobre ver."
              className="max-w-[20ch] font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
            />
            <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <ul aria-label="O que a marca representa" className="space-y-1 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold uppercase leading-[1.12] tracking-[-0.01em] text-dono-blue-ink">
                  <li>Propriedade</li>
                  <li>Produção</li>
                  <li>Autonomia</li>
                </ul>
              </Reveal>
              <Reveal className="space-y-6 text-lg leading-relaxed text-ink-dark-muted lg:col-span-6 lg:col-start-6" delay={0.08}>
                <p>
                  Por anos, o Club Renda Passiva reuniu investidores em torno de uma ideia simples: ser dono de ativos que trabalham no mundo real. Um carregador numa rodovia, uma usina no sertão, uma máquina num estacionamento cheio de motos.
                </p>
                <p>
                  <strong className="font-bold text-ink-dark">A DONO é o próximo passo.</strong> Os ativos continuam reais. O que muda é que agora você enxerga cada um deles: quanto rendeu, mês a mês, e como se compara ao que o mercado oferece.
                </p>
                <p className="pt-2 font-display text-[clamp(1.375rem,2.4vw,1.75rem)] font-bold leading-snug tracking-[-0.02em] text-ink-dark">
                  DONO não fala de promessa. Fala de propriedade. Não fala de rendimento abstrato. Fala de capital produzindo na economia real.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Ativos */}
        <section id="ativos" className="scroll-mt-16 bg-dono-base">
          <div className="mx-auto max-w-[1280px] px-4 py-24 sm:px-8 lg:py-32">
            <Reveal>
              <h2 className="max-w-[22ch] text-[clamp(1.75rem,3.8vw,2.75rem)] font-display font-extrabold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
                Quatro negócios reais do ecossistema Grupo CRP.
              </h2>
              <a href={CRP} target="_blank" rel="noopener noreferrer" className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors duration-150 hover:text-dono-blue-bright">
                Conheça o Grupo CRP <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
            <AssetBento />
          </div>
        </section>

        {/* Como funciona: título fixo e etapas que acendem na rolagem */}
        <section id="como-funciona" className="scroll-mt-16 bg-dono-paper text-ink-dark">
          <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
            <StepsSticky title="Do ativo ao seu relatório, em três passos." steps={ETAPAS} />
          </div>
        </section>

        {/* Plataforma */}
        <section id="plataforma" className="scroll-mt-16 overflow-hidden bg-dono-deep">
          <div className="mx-auto max-w-[1280px] px-4 pt-24 sm:px-8 lg:pt-32">
            <Reveal>
              <h2 className="max-w-[18ch] text-[clamp(1.75rem,3.8vw,2.75rem)] font-display font-extrabold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
                A plataforma, sem maquete.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink-subtle">
                Abaixo está a tela de visão geral da DONO funcionando, com uma carteira de demonstração. É isso que você vê ao entrar.
              </p>
            </Reveal>

            <ProductFrame label="Prévia da tela de visão geral com dados de demonstração">
              <div className="mb-4 flex items-center justify-between px-2 sm:mb-6">
                <Logo href="#plataforma" />
                <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-ink-muted">Dados de demonstração</span>
              </div>
              <div className="space-y-4">
                <PortfolioSummary assets={assets} preview />
                <div className="hidden sm:block">
                  <IncomePanel assets={assets} toggle={false} />
                </div>
              </div>
            </ProductFrame>
          </div>

          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:py-32">
            <Reveal>
              <h2 className="max-w-[16ch] text-[clamp(1.6rem,3.2vw,2.25rem)] font-display font-extrabold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
                Compare com o que você já conhece.
              </h2>
              <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-ink-subtle">
                O comparador coloca a sua carteira lado a lado com CDI, Tesouro Selic, poupança e ações de bancos da B3, no mesmo período e partindo do mesmo ponto.
              </p>
              <dl className="mt-10 space-y-5">
                {(["dono", "cdi", "poupanca"] as const).map((k) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                    <dt className="flex items-center gap-2.5 text-[15px] text-ink-muted">
                      <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: SERIES[k].cor }} />
                      {SERIES[k].nome}
                    </dt>
                    <dd className="num font-display text-2xl font-bold text-ink">
                      <CountUp value={acumulados[k]} kind="pct" digits={1} sign />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-ink-subtle">
                Acumulado de {mesLongo(meses[0])} a {mesLongo(meses[meses.length - 1])}. Carteira DONO com dados de demonstração; CDI e poupança do Banco Central. Rentabilidade passada não garante rentabilidade futura.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="min-w-0 rounded-card bg-dono-base p-4 sm:p-7">
              <IndexLines rows={indice} series={["dono", "cdi", "poupanca"]} toggle={false} height={380} />
            </Reveal>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-dono-blue text-on-accent">
          <Reveal className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:py-24" amount={0.3}>
            <h2 className="max-w-[20ch] text-[clamp(1.75rem,4vw,2.875rem)] font-display font-extrabold uppercase leading-[1.04] tracking-[-0.01em]">Seus ativos já estão trabalhando. Venha ver.</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/login" variant="dark" size="lg">Abra sua conta</ButtonLink>
              <a href={CRP} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-bold underline decoration-2 underline-offset-4 hover:no-underline">
                Falar com o Grupo CRP <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="bg-dono-deep">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-ink-subtle">A plataforma de acompanhamento de ativos reais dos investidores do Grupo CRP.</p>
            </div>
            <nav aria-label="Plataforma">
              <h2 className="text-sm font-bold text-ink">Plataforma</h2>
              <ul className="mt-4 space-y-1 text-[15px] text-ink-subtle">
                <li><Link href="/login" className="inline-flex min-h-11 min-w-11 items-center hover:text-ink">Acessar conta</Link></li>
                <li><a href="#ativos" className="inline-flex min-h-11 min-w-11 items-center hover:text-ink">Ativos</a></li>
                <li><a href="#como-funciona" className="inline-flex min-h-11 min-w-11 items-center hover:text-ink">Como funciona</a></li>
                <li><a href="#plataforma" className="inline-flex min-h-11 min-w-11 items-center hover:text-ink">Comparador</a></li>
              </ul>
            </nav>
            <nav aria-label="Grupo CRP">
              <h2 className="text-sm font-bold text-ink">Grupo CRP</h2>
              <ul className="mt-4 space-y-1 text-[15px] text-ink-subtle">
                {TIPO_ORDEM.map((t) => (
                  <li key={t}><a href={CRP} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center hover:text-ink">{TIPOS[t].nome}</a></li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-14 border-t border-white/10 pt-8 text-xs leading-relaxed text-ink-subtle">
            <p className="max-w-[110ch]">
              As informações desta página têm caráter informativo e não constituem oferta ou recomendação de investimento. Rentabilidade passada não garante rentabilidade futura. Os valores exibidos na plataforma de demonstração são mockados. Vídeo de abertura ilustrativo.
            </p>
            <p className="mt-4">© 2026 Grupo CRP. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
