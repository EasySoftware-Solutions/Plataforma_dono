import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/routes";

export function middleware(req: NextRequest) {
  if (req.cookies.get(SESSION_COOKIE)) return NextResponse.next();
  const url = new URL("/login", req.url);
  url.searchParams.set("voltar", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// O matcher precisa ser literal (analisado em build); mantenha em sincronia com PROTECTED_ROUTES.
export const config = {
  matcher: ["/dashboard/:path*", "/ativos/:path*", "/comparador/:path*", "/relatorios/:path*"],
};
