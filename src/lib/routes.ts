// Fonte única para sessão e rotas protegidas. Sem dependências de Node:
// é importado pelo middleware (edge), por Server Actions e por componentes.

export const SESSION_COOKIE = "dono_session";

export const PROTECTED_ROUTES = ["/dashboard", "/ativos", "/comparador", "/relatorios"] as const;

/** Destino seguro pós-login: só aceita caminhos internos da área logada. */
export function destinoPosLogin(voltar: string) {
  return PROTECTED_ROUTES.some((r) => voltar === r || voltar.startsWith(`${r}/`)) ? voltar : "/dashboard";
}
