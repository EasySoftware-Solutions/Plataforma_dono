// Fonte única de curvas e tempos. Valores vêm da skill do Emil Kowalski: nada de
// cubic-bezier inventado nem de ease-in em interface. Mantenha em sincronia com
// --ease-out-expo em globals.css.

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const DURATION = {
  /** Feedback de toque e pressão. */
  press: 0.14,
  /** Menus e popovers: entrada. A saída usa `menuExit`, sempre mais rápida. */
  menu: 0.18,
  menuExit: 0.12,
  /** Troca de conteúdo no mesmo lugar (gráfico/tabela, abas). */
  swap: 0.16,
  /** Navegação do dashboard: usada dezenas de vezes por dia, quase imperceptível. */
  route: 0.14,
  /** Entradas de seção na landing (marketing pode ser mais longo). */
  section: 0.6,
} as const;

/** Spring de layout: indicador que desliza entre abas. Sem bounce perceptível. */
export const SPRING_LAYOUT = { type: "spring", duration: 0.38, bounce: 0.08 } as const;

/** Texto longo na landing, escrito como string completa para aceleração por hardware. */
export const translateY = (px: number) => `translateY(${px}px)`;
