import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="mt-10 text-[32px] font-bold leading-tight text-ink sm:text-4xl">Página não encontrada</h1>
      <p className="mt-3 max-w-[44ch] text-[15px] text-ink-subtle">O endereço pode ter mudado ou não existe mais.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/dashboard">Ir para a plataforma</ButtonLink>
        <ButtonLink href="/" variant="secondary">Voltar ao site</ButtonLink>
      </div>
    </main>
  );
}
