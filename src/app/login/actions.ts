"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encodeSession, SESSION_COOKIE } from "@/lib/auth";

export type LoginState = { error?: string; email?: string };

const ROTAS = ["/dashboard", "/ativos", "/comparador", "/relatorios", "/pagamentos"];

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const senha = String(form.get("senha") ?? "");
  const voltar = String(form.get("voltar") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Digite um e-mail válido, como nome@empresa.com.br.", email };
  if (senha.length < 4) return { error: "A senha precisa ter pelo menos 4 caracteres.", email };

  (await cookies()).set(SESSION_COOKIE, encodeSession(email), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect(ROTAS.some((r) => voltar.startsWith(r)) ? voltar : "/dashboard");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
