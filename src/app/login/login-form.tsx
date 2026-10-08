"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { DURATION, EASE_OUT } from "@/components/motion/tokens";
import { login, type LoginState } from "./actions";

const field =
  "h-14 w-full rounded-xl bg-white/[0.06] px-4 text-base text-ink placeholder:text-ink-subtle/70 outline-none ring-1 ring-inset ring-white/10 transition-shadow focus:ring-2 focus:ring-dono-blue-bright aria-[invalid=true]:ring-negative";

export function LoginForm({ voltar }: { voltar?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="voltar" value={voltar ?? ""} />
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink-muted">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          defaultValue={state.email}
          placeholder="nome@empresa.com.br"
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-erro" : undefined}
          className={field}
          required
        />
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="senha" className="block text-sm font-semibold text-ink-muted">
            Senha
          </label>
          <span className="text-sm text-ink-subtle">Esqueceu? Fale com seu consultor.</span>
        </div>
        <div className="relative">
          <input
            id="senha"
            name="senha"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Sua senha"
            aria-invalid={!!state.error}
            className={`${field} pr-14`}
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-1.5 my-auto flex size-11 items-center justify-center rounded-lg text-ink-subtle hover:text-ink"
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {state.error && (
          <m.p
            key={state.error}
            id="login-erro"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: DURATION.menu, ease: EASE_OUT } }}
            exit={{ opacity: 0, height: 0, transition: { duration: DURATION.menuExit, ease: EASE_OUT } }}
            className="flex items-start gap-2 overflow-hidden text-sm font-medium text-negative"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </m.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={pending}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-pill bg-dono-blue text-base font-bold text-on-accent shadow-[0_16px_40px_-14px_color-mix(in_srgb,var(--color-dono-blue)_80%,transparent)] transition-[background-color,box-shadow,transform] duration-200 ease-out-expo active:scale-[0.97] hover:-translate-y-[1.5px] hover:bg-dono-blue-hover hover:shadow-[0_20px_44px_-16px_color-mix(in_srgb,var(--color-dono-blue)_90%,transparent)] active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending && <Loader2 aria-hidden className="size-5 animate-spin" />}
        {pending ? "Entrando…" : "Entrar na plataforma"}
      </button>
    </form>
  );
}
