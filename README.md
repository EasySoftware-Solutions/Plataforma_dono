# DONO

Plataforma dos investidores do Grupo CRP (antes Club Renda Passiva): landing pública e área logada com carteira, ativos, comparador e relatórios. Next.js 15 (App Router) + React 19 + Tailwind 4 + Motion, publicada na Cloudflare via OpenNext.

```bash
npm run dev       # desenvolvimento (Turbopack)
npm run build     # build de produção
npm run deploy    # build OpenNext + deploy na Cloudflare
```

## Contexto de design

- [PRODUCT.md](PRODUCT.md): público, tom de marca, superfícies e restrições.
- [DESIGN.md](DESIGN.md): dials, cor, tipografia, forma, lista do que é proibido e regras de movimento.
- `.claude/skills/`: skills de design usadas na reestruturação, instaladas só como texto (Impeccable, Emil Kowalski, Taste). O binário auxiliar do Impeccable não é usado.

## Arquitetura

```
src/
├─ app/
│  ├─ page.tsx                 landing (estática) + intro de marca
│  ├─ login/                   formulário + Server Actions de login/logout
│  └─ (dashboard)/             área logada
│     ├─ layout.tsx            shell persistente (sidebar, barra de abas, avisos, conta)
│     ├─ template.tsx          fade curto a cada navegação
│     ├─ loading.tsx           skeleton instantâneo ao trocar de rota
│     ├─ error.tsx             falha isolada por página, com "tentar de novo"
│     └─ <rota>/page.tsx       Server Component busca dados → Client Component interativo
├─ components/
│  ├─ motion/                  tokens, provider, Reveal, CountUp (ver abaixo)
│  ├─ intro/                   brand-intro.tsx (anime.js)
│  ├─ landing/                 hero, manifesto, bento, etapas fixas, moldura do produto
│  ├─ charts/                  wrappers leves + recharts carregado sob demanda (lazy.tsx)
│  └─ dashboard/ ui/
├─ lib/
│  ├─ api.ts                   ÚNICO ponto de acesso a dados (hoje mock, amanhã HTTP)
│  ├─ auth.ts / routes.ts      sessão por cookie e rotas protegidas (usado pelo middleware)
│  ├─ calc.ts                  regras de negócio puras (rendimento, yield, índices)
│  ├─ constants.ts / months.ts datas de referência, janela de histórico, aritmética de meses
│  ├─ format.ts / exports.ts   formatação pt-BR e geração de PDF/Excel/CSV no cliente
│  └─ mock-data.ts             dados de demonstração (só no servidor, via api.ts)
└─ middleware.ts               redireciona para /login sem sessão
```

### Movimento

- **Motion** (`motion/react`) para toda a interface. `MotionProvider` usa `LazyMotion strict`: só `<m.*>`, nunca `<motion.*>`. O dashboard troca para `DashboardMotion`, que carrega `domMax` (layout animations) em chunk à parte.
- **Curvas e tempos em um só lugar**: `components/motion/tokens.ts`, espelhado em `--ease-out-expo` no CSS. Sem `ease-in`, sem `transition: all`, sem partir de `scale(0)`. Em props animadas usar a string `transform` completa.
- **A frequência manda.** Navegação do dashboard é só um fade de 140 ms. Intro, manifesto, bento e contagens ficam na landing, que é vista poucas vezes.
- **Scroll sempre via `useScroll`** (nada de listener de `scroll` na janela nem estado React para valor contínuo).
- **Hero** anima por CSS (`[data-hero-in]`, `[data-word]` em `globals.css`): roda no primeiro quadro e fica pausado enquanto a intro toca.
- **Movimento reduzido**: `MotionConfig reducedMotion="user"` mantém fades e remove deslocamentos; a intro nem toca.

### Intro de marca (anime.js)

`html[data-intro="play"]` é decidido por um script inline no `<head>` antes da primeira pintura: só na home, 1x por sessão (`sessionStorage["dono:intro"]`) e sem movimento reduzido. Só então `brand-intro.tsx` importa `animejs` (sub-módulos `timeline`, `text`, `utils`), então quem não vê a intro não baixa a biblioteca. "Pular animação", Esc ou toque no fundo encerram. Uma regra CSS esconde a intro sozinha após 7 s se o JS falhar.

### Regras que mantêm a navegação fluida

- **Componentes de cliente não importam `mock-data.ts`.** Dados chegam por props a partir de `api.ts`.
- **recharts só via `components/charts/lazy.tsx`**, com skeleton do mesmo tamanho (sem layout shift).
- **Toda rota da área logada tem `loading.tsx` acima dela.**
- **Cache do roteador (`staleTimes.dynamic = 30`)**: voltar para uma aba visitada há pouco não vai ao servidor. Login e logout invalidam esse cache.
- **`api.ts` e `getSession` usam `cache()` do React**: layout, página e `generateMetadata` compartilham o resultado no mesmo request.

### Trocar o mock pelo backend real

Substitua o corpo das funções em `src/lib/api.ts` por chamadas HTTP mantendo as assinaturas. O resto da aplicação não precisa mudar.
