import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { TIPOS, TIPO_ORDEM } from "@/lib/constants";
import { indiceBase100, metricas, retornosDono, retornosMercado } from "@/lib/calc";
import { MESES_HISTORICO } from "@/lib/mock-data";
import { mesLongo, pct } from "@/lib/format";
import { Logo } from "@/components/logo";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroVideo } from "@/components/landing/hero-video";
import { IncomePanel, PortfolioSummary } from "@/components/dashboard/overview";
import { IndexLines } from "@/components/charts/index-lines";
import { AssetShowcase } from "@/components/landing/asset-showcase";
import { SERIES } from "@/lib/series";

const CRP = "https://grupocrp.com.br/";

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
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[640px] items-end overflow-hidden bg-crp-navy-deep pb-16 pt-32 sm:items-center sm:pb-24 lg:min-h-[max(720px,100dvh)]">
          <HeroVideo src="/assets/hero.mp4" poster="/assets/usinas-solares.jpg" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
            <h1 className="max-w-[18ch] text-[38px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[64px]">
              No banco, seu dinheiro rende. <span className="text-crp-blue-bright">Com a DONO, ele produz.</span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-ink-muted sm:text-lg">
              A DONO é a plataforma dos investidores do Grupo CRP. Carregadores elétricos, postos, máquinas Capaxero e usinas solares que são seus, com rendimento, relatórios e pagamentos acompanhados mês a mês.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/login" size="lg">Acessar plataforma</ButtonLink>
              <a href="#manifesto" className={buttonClass("secondary", "lg", "backdrop-blur-sm")}>Conhecer a DONO</a>
            </div>
          </div>
        </section>

        {/* Faixa de resumo */}
        <section aria-label="Em resumo" className="bg-crp-blue text-ink">
          <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:py-12">
            {[
              { t: "4 negócios reais", d: "Energia, mobilidade e serviços" },
              { t: "100% seu", d: "Você é dono do ativo, não de uma cota" },
              { t: "Todo mês", d: "Relatório de rendimento por ativo" },
              { t: "Cada repasse", d: "Do previsto ao pago, com status" },
            ].map((i) => (
              <li key={i.t}>
                <p className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[32px]">{i.t}</p>
                <p className="mt-1 text-[15px] font-medium text-ink/75">{i.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Manifesto */}
        <section id="manifesto" className="scroll-mt-16 bg-crp-light text-ink-dark">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:py-32">
            <h2 className="text-[40px] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]">
              Renda passiva sempre foi sobre ter. A DONO é sobre ver.
            </h2>
            <div className="space-y-6 self-end text-lg leading-relaxed text-ink-dark-muted">
              <p>
                Por anos, o Club Renda Passiva reuniu investidores em torno de uma ideia simples: ser dono de ativos que trabalham no mundo real. Um carregador numa rodovia, uma usina no sertão, uma máquina num estacionamento cheio de motos.
              </p>
              <p>
                <strong className="font-bold text-ink-dark">A DONO é o próximo passo.</strong> Os ativos continuam reais. O que muda é que agora você enxerga cada um deles: quanto rendeu, quando foi pago, como se compara ao que o mercado oferece.
              </p>
              <blockquote className="border-l-2 border-crp-blue pl-5 text-[17px] italic leading-relaxed text-crp-blue">
                DONO não fala de promessa. Fala de propriedade. Não fala de rendimento abstrato. Fala de capital produzindo na economia real.
              </blockquote>
            </div>
          </div>
        </section>

        {/* Ativos */}
        <section id="ativos" className="scroll-mt-16 bg-crp-navy">
          <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-[18ch] text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[48px]">
                Quatro negócios reais do ecossistema Grupo CRP.
              </h2>
              <a href={CRP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink hover:text-crp-blue-bright">
                Conheça o Grupo CRP <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
            <AssetShowcase />
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="scroll-mt-16 bg-crp-light text-ink-dark">
          <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
            <h2 className="max-w-[16ch] text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[48px]">Do ativo ao seu extrato, em três passos.</h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {[
                { t: "Acesse sua conta", d: "Entre com o e-mail cadastrado como investidor. Sua carteira aparece completa, ativo por ativo." },
                { t: "Acompanhe cada ativo", d: "Status de operação, rendimento mensal, documentos e a comparação com CDI, poupança e Ibovespa." },
                { t: "Receba e declare", d: "Veja cada repasse do previsto ao pago e baixe o informe de rendimentos na hora do imposto de renda." },
              ].map((s, i) => (
                <li key={s.t} className="border-t-2 border-ink-dark pt-6">
                  <p className="num text-sm font-bold text-ink-dark-muted">Passo {i + 1}</p>
                  <h3 className="mt-2 text-2xl font-bold">{s.t}</h3>
                  <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-ink-dark-muted">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Plataforma */}
        <section id="plataforma" className="scroll-mt-16 overflow-hidden bg-crp-navy-deep">
          <div className="mx-auto max-w-[1280px] px-5 pt-24 sm:px-8 lg:pt-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-[15ch] text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[48px]">A plataforma, sem maquete.</h2>
              <p className="max-w-[46ch] text-[16px] leading-relaxed text-ink-subtle">
                Abaixo está a tela de visão geral da DONO funcionando, com uma carteira de demonstração. É isso que você vê ao entrar.
              </p>
            </div>

            <div className="product-stage mt-14">
              <div
                inert
                aria-label="Prévia da tela de visão geral com dados de demonstração"
                role="img"
                className="product-frame relative rounded-[24px] bg-crp-navy p-3 shadow-[0_40px_120px_-30px_rgba(50,104,222,0.22)] ring-1 ring-white/10 sm:p-6"
              >
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
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:py-32">
            <div>
              <h2 className="max-w-[14ch] text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[44px]">Compare com o que você já conhece.</h2>
              <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-ink-subtle">
                O comparador coloca a sua carteira lado a lado com CDI, poupança, Ibovespa e Tesouro Selic, no mesmo período e partindo do mesmo ponto.
              </p>
              <dl className="mt-10 space-y-5">
                {(["dono", "cdi", "poupanca"] as const).map((k) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                    <dt className="flex items-center gap-2.5 text-[15px] text-ink-muted">
                      <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: SERIES[k].cor }} />
                      {SERIES[k].nome}
                    </dt>
                    <dd className="num text-2xl font-bold text-ink">{pct(acumulados[k], { digits: 1, sign: true })}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-ink-subtle">
                Acumulado de {mesLongo(meses[0])} a {mesLongo(meses[meses.length - 1])}. Carteira DONO com dados de demonstração; CDI e poupança do Banco Central. Rentabilidade passada não garante rentabilidade futura.
              </p>
            </div>
            <div className="rounded-card bg-crp-navy p-5 sm:p-7">
              <IndexLines rows={indice} series={["dono", "cdi", "poupanca"]} toggle={false} height={380} />
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-crp-blue text-ink">
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:py-24">
            <h2 className="max-w-[18ch] text-[36px] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-[52px]">Seus ativos já estão trabalhando. Venha ver.</h2>
            <div className="flex flex-wrap items-center gap-5">
              <ButtonLink href="/login" variant="dark" size="lg">Acessar plataforma</ButtonLink>
              <a href={CRP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-bold underline decoration-2 underline-offset-4 hover:no-underline">
                Falar com o Grupo CRP <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-crp-navy-deep">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-ink-subtle">A plataforma de acompanhamento de ativos reais dos investidores do Grupo CRP.</p>
            </div>
            <nav aria-label="Plataforma">
              <h2 className="text-sm font-bold text-ink">Plataforma</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-subtle">
                <li><Link href="/login" className="hover:text-ink">Acessar conta</Link></li>
                <li><a href="#ativos" className="hover:text-ink">Ativos</a></li>
                <li><a href="#como-funciona" className="hover:text-ink">Como funciona</a></li>
                <li><a href="#plataforma" className="hover:text-ink">Comparador</a></li>
              </ul>
            </nav>
            <nav aria-label="Grupo CRP">
              <h2 className="text-sm font-bold text-ink">Grupo CRP</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-subtle">
                {TIPO_ORDEM.map((t) => (
                  <li key={t}><a href={CRP} target="_blank" rel="noopener noreferrer" className="hover:text-ink">{TIPOS[t].nome}</a></li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-14 border-t border-white/10 pt-8 text-xs leading-relaxed text-ink-subtle">
            <p className="max-w-[110ch]">
              As informações desta página têm caráter informativo e não constituem oferta ou recomendação de investimento. Rentabilidade passada não garante rentabilidade futura. Os valores exibidos na plataforma de demonstração são fictícios. Vídeo de abertura ilustrativo.
            </p>
            <p className="mt-4">© 2026 Grupo CRP. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
