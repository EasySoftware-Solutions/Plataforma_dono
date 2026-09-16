import { cookies } from "next/headers";
import type { Investor } from "@/types";
import { DEMO_INVESTOR } from "./mock-data";

export const SESSION_COOKIE = "dono_session";

function nomeDoEmail(email: string) {
  const base = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\d+/g, "").trim();
  return base ? base.replace(/(^|\s)\S/g, (c) => c.toUpperCase()) : DEMO_INVESTOR.nome;
}

export function encodeSession(email: string) {
  return Buffer.from(JSON.stringify({ email, nome: nomeDoEmail(email) })).toString("base64url");
}

export async function getSession(): Promise<Investor | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString()) as Investor;
  } catch {
    return null;
  }
}
