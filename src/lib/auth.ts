import { cache } from "react";
import { cookies } from "next/headers";
import type { Investor } from "@/types";
import { DEMO_INVESTOR } from "./mock-data";
import { SESSION_COOKIE } from "./routes";

export { SESSION_COOKIE };

// A carteira de demonstração é a do cliente Magno Borges: qualquer login entra como ele.
export function encodeSession(email: string) {
  return Buffer.from(JSON.stringify({ email, nome: DEMO_INVESTOR.nome })).toString("base64url");
}

// Memoizado por request: layout e páginas leem a sessão sem decodificar o cookie de novo.
export const getSession = cache(async (): Promise<Investor | null> => {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString()) as Investor;
  } catch {
    return null;
  }
});
