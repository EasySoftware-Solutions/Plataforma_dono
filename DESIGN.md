# DESIGN

Documento vivo do sistema visual da DONO. Tokens reais em `src/app/globals.css` (`@theme`). Regras vindas das skills instaladas em `.claude/skills/` (Impeccable, Emil Kowalski, Taste).

## Dials (Taste)
| Superfície | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY |
|---|---|---|---|
| Landing | 8 | 7 | 4 |
| Login | 6 | 5 | 3 |
| Dashboard (Operate) | 4 | 3 | 7 |

O Taste cobre landing e login. O dashboard segue Impeccable (Operate) e Emil.

## Marca (manual "23-09 LOGOTIPO DONO - JON MAG NOVA VERSÃO")
- **Logotipo:** wordmark DONO em Downey, em `src/components/brand/wordmark.tsx` (vetor reconstruído do PDF, diferença de subpixel). Sempre no azul da marca, em fundo claro ou escuro. Os prolongamentos do N (haste direita acima, esquerda abaixo) ficam sempre visíveis. Nunca redesenhar com fonte.
- **Arquitetura:** DONO como assinatura principal; qualificadores por frente (Access, Educação, Gestão, Imports). A plataforma de investidores é **DONO Gestão** (`<Logo qualifier="Gestão" />`).
- **Mensagens do manual:** "No banco, seu dinheiro rende. Aqui, ele produz."; "Propriedade. Produção. Autonomia."; "Confiança com atitude"; "Estrutura + personalidade".
- **Favicon:** o N do logotipo com seus prolongamentos, azul sobre a base escura (`src/app/icon.svg`).

## Cor
| Token | Valor | Uso |
|---|---|---|
| `dono-blue` | #27AAE1 | Azul da marca: logotipo, presença, botões e faixas. Texto sobre ele é escuro (`on-accent`, 7:1); branco dá 2,6:1 |
| `dono-base` | #11131B | Base escura: fundo do site e seções escuras |
| `dono-violet` | #482B74 | Violeta de apoio: só ambientação (luzes, brilhos), nunca texto |
| `dono-paper` | #F6F5F2 | Fundo claro: seções de leitura e a área logada |
| `dono-blue-ink` | #0A74A6 | Azul para texto sobre fundo claro (4,7:1); o oficial dá 2,4:1 |
| `dono-blue-bright` | #6CC7EE | Azul para texto/estados sobre fundo escuro |

A área logada usa `.theme-light` (fundo #F6F5F2, cartões brancos); `.theme-dark` restaura o escuro em blocos pontuais.

## Tipografia
- **Logotipo:** Downey, só via SVG.
- **Display:** Archivo com eixo de largura (`font-stretch: 122%`), a alternativa livre mais próxima da Downey: sem serifa, traço robusto, desenho amplo. Títulos de seção em caixa alta, como no manual.
- **Texto e dashboard:** Geist. Números com `tabular-nums` (classe `num`).

## Forma
Estrutura acima de suavidade: cartões com 14px de raio, controles com 10px (`rounded-pill`), selos e avatares redondos. Sombras tingidas da base escura.

## Proibido (resumo das skills)
- Travessão (— e –) em qualquer texto visível.
- Eyebrow/kicker acima de títulos (no máximo 1 a cada 3 seções, e hoje: zero), rótulos "Passo 1/2/3", numeração de seção.
- Pontos de status decorativos, etiquetas sobre imagens, três cards iguais de ícone+título+texto, cabeçalho de seção dividido (título à esquerda, parágrafo flutuando à direita).
- Texto com gradiente, `border-left` colorido acima de 1px, `transition: all`, `scale(0)`, `ease-in` em UI.
- Listener de `scroll` na janela (usar `useScroll`), `useState` para valor contínuo.
- Hero com mais de 4 elementos de texto (título, subtexto de até 20 palavras, CTAs).
- Scroll cue ("role para baixo"), cursor customizado.

## Movimento (Emil + Motion)
- Curvas únicas em `src/components/motion/tokens.ts`: `EASE_OUT = cubic-bezier(0.23, 1, 0.32, 1)`, `EASE_IN_OUT = cubic-bezier(0.77, 0, 0.175, 1)`.
- Durações: toque e pressão 100-160ms, menus 150-250ms, entradas de seção até 600ms (marketing), UI nunca acima de 300ms sem motivo.
- Entradas partem de `scale(0.95)` com opacidade, nunca de `scale(0)`. Saída mais rápida que a entrada.
- Em Motion, usar a string `transform` completa para aceleração por hardware. Apenas `transform`, `opacity` e, quando suave, `clip-path` e `filter`.
- Hover somente em `(hover: hover) and (pointer: fine)`. Movimento reduzido: sem deslocamento, só fades curtos.
- Frequência manda: navegação do dashboard e teclado quase sem animação; intro, manifesto e entradas de seção têm o orçamento de deleite.
- Biblioteca: **Motion** para interface; **anime.js** só na intro de marca, carregada sob demanda. A intro termina com o logotipo real: letras sobem e os prolongamentos do N crescem por último.

## Responsividade
Mobile primeiro, `min-h-dvh`, safe-areas, grid em vez de matemática de flex, tabelas viram cartões abaixo de `md`. Dashboard: barra de abas inferior abaixo de `lg`, barra lateral a partir de `lg`.
