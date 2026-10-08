// Logotipo DONO (wordmark em Downey), reconstruído em vetor a partir do manual
// "23-09 LOGOTIPO DONO - JON MAG NOVA VERSÃO". Diferença contra o PDF: subpixel.
// Regras do manual: sempre no azul da marca (#27AAE1), em fundo claro ou escuro, e os
// prolongamentos do N (haste direita acima, haste esquerda abaixo) sempre visíveis.
//
// O N é desenhado em três partes (núcleo + dois prolongamentos) só para a intro poder animar
// os prolongamentos; visualmente o resultado é idêntico ao desenho original.

export const WORDMARK_VIEWBOX = "0 0 1330.54 367.74";
export const WORDMARK_RATIO = 1330.54 / 367.74;

export const WORDMARK_PARTS = {
  D: "M0 44.19L156.87 44.19C236.47 44.19 294.35 103.35 294.35 184.71C294.35 266.08 236.47 325.24 156.87 325.24L0 325.24ZM65.6 100.4L149.27 100.4C195.45 100.4 226.24 133.99 226.24 184.38C226.24 234.76 195.45 268.35 149.27 268.35L65.6 268.35Z",
  O1: "M489.78 44.19C576.56 44.19 642.03 104.62 642.03 184.72C642.03 264.82 576.56 325.25 489.78 325.25C403 325.25 337.53 264.82 337.53 184.72C337.53 104.62 403 44.19 489.78 44.19ZM489.77 104.58C539.17 104.58 576.13 138.76 576.13 184.43C576.13 230.1 539.17 264.28 489.77 264.28C440.37 264.28 403.41 230.1 403.41 184.43C403.41 138.76 440.37 104.58 489.77 104.58Z",
  N: "M685.06 44.19L750.44 44.19L917.52 241.96L917.52 44.19L983.41 44.19L983.41 325.24L917.68 325.24L751.11 136.26L751.11 325.24L685.06 325.24Z",
  Ntop: "M917.52 0L983.41 0L983.41 44.69L917.52 44.69Z",
  Nbottom: "M685.06 324.74L751.11 324.74L751.11 367.74L685.06 367.74Z",
  O2: "M1178.78 44.19C1265.56 44.19 1331.03 104.62 1331.03 184.72C1331.03 264.82 1265.56 325.25 1178.78 325.25C1092 325.25 1026.53 264.82 1026.53 184.72C1026.53 104.62 1092 44.19 1178.78 44.19ZM1178.78 104.58C1228.17 104.58 1265.12 138.76 1265.12 184.43C1265.12 230.1 1228.17 264.28 1178.78 264.28C1129.39 264.28 1092.44 230.1 1092.44 184.43C1092.44 138.76 1129.39 104.58 1178.78 104.58Z",
} as const;

export function Wordmark({ className = "", title = "DONO" }: { className?: string; title?: string | null }) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={`fill-dono-blue ${className}`}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {(Object.keys(WORDMARK_PARTS) as (keyof typeof WORDMARK_PARTS)[]).map((k) => (
        <path key={k} data-part={k} d={WORDMARK_PARTS[k]} fillRule="evenodd" />
      ))}
    </svg>
  );
}
