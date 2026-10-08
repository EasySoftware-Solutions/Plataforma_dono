// Tema da área logada (claro por padrão). Guardado em cookie para o servidor já renderizar
// no tema escolhido: sem piscar ao recarregar a página. Sem dependências de Node.
export const THEME_COOKIE = "dono_theme";

export type Theme = "light" | "dark";

export const parseTheme = (v: string | undefined): Theme => (v === "dark" ? "dark" : "light");
