import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "dono_session";

export function middleware(req: NextRequest) {
  if (req.cookies.get(SESSION_COOKIE)) return NextResponse.next();
  const url = new URL("/login", req.url);
  url.searchParams.set("voltar", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/ativos/:path*", "/comparador/:path*", "/relatorios/:path*", "/pagamentos/:path*"],
};
