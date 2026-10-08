"use client";

import { useEffect, useRef, useState } from "react";
import { WORDMARK_PARTS, WORDMARK_VIEWBOX } from "@/components/brand/wordmark";

const SEEN_KEY = "dono:intro";

// Intro de marca: "Club Renda Passiva" sai letra a letra, o logotipo DONO entra e os
// prolongamentos do N crescem por último (o traço que o manual define como assinatura).
// Depois o logo voa até o cabeçalho. O script do <head> (layout.tsx) decide se ela toca,
// marcando html[data-intro="play"]; fora disso a anime.js nem é baixada.
// Pular: botão, Esc ou toque no fundo.
export function BrandIntro() {
  const bgRef = useRef<HTMLDivElement>(null);
  const oldRef = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "play") {
      setDone(true);
      return;
    }

    let finished = false;
    let stop = () => {};

    const finish = () => {
      if (finished) return;
      finished = true;
      stop();
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(watchdog);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      // Remover o atributo revela o logo real do cabeçalho e libera a entrada do hero.
      html.removeAttribute("data-intro");
      setDone(true);
    };
    finishRef.current = finish;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    const watchdog = window.setTimeout(finish, 8000);

    (async () => {
      try {
        const [{ createTimeline }, { splitText }, { stagger }] = await Promise.all([
          import("animejs/timeline"),
          import("animejs/text"),
          import("animejs/utils"),
          document.fonts.ready,
        ]);
        if (finished) return;

        const old = oldRef.current!;
        const mark = markRef.current!;
        const wrap = wrapRef.current!;
        const tag = tagRef.current!;
        const bg = bgRef.current!;
        const siteLogo = document.querySelector<SVGElement>("[data-site-logo] svg");
        if (!siteLogo) return finish();

        const part = (k: keyof typeof WORDMARK_PARTS) => mark.querySelector<SVGPathElement>(`[data-part="${k}"]`)!;
        const letters = [part("D"), part("O1"), part("N"), part("O2")];

        // Voo até o cabeçalho, medido antes de animar (o logo da intro está em repouso aqui).
        const from = wrap.getBoundingClientRect();
        const to = siteLogo.getBoundingClientRect();

        const split = splitText(old, { chars: true, includeSpaces: true });
        split.chars.forEach((c: HTMLElement) => {
          c.style.display = "inline-block";
          c.style.whiteSpace = "pre";
          c.style.opacity = "0";
        });
        old.style.opacity = "1";

        const tl = createTimeline({ defaults: { ease: "outExpo" } });

        // 1. O nome antigo entra.
        tl.add(split.chars, { opacity: [0, 1], y: ["0.45em", "0em"], filter: ["blur(8px)", "blur(0px)"], duration: 620, delay: stagger(22) }, 0);
        // 2. Pausa para ler, e ele sai por cima.
        tl.add(split.chars, { opacity: 0, y: "-0.35em", filter: "blur(6px)", duration: 420, ease: "inQuad", delay: stagger(14) }, 1250);
        // 3. As letras do logotipo sobem no lugar.
        tl.add(letters, { opacity: [0, 1], y: ["14%", "0%"], duration: 640, delay: stagger(70) }, 1600);
        // 4. Os prolongamentos do N crescem a partir da linha: a assinatura da marca.
        tl.add([part("Ntop"), part("Nbottom")], { opacity: [1, 1], scaleY: [0, 1], duration: 520, ease: "inOutQuart" }, 2080);
        tl.add(tag, { opacity: [0, 1], y: ["8px", "0px"], duration: 460 }, 2300);

        // 5. O logo voa até o cabeçalho enquanto o fundo recua de baixo para cima.
        tl.add(tag, { opacity: 0, duration: 220, ease: "outQuad" }, 2950);
        tl.add(wrap, { x: to.left - from.left, y: to.top - from.top, scale: [1, to.width / from.width], duration: 720, ease: "inOutQuart" }, 2950);
        tl.add(bg, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"], duration: 760, ease: "inOutQuart" }, 3010);
        tl.call(finish, 3750);

        stop = () => tl.pause();
        // Só em desenvolvimento: permite inspecionar a timeline (seek) em testes.
        if (process.env.NODE_ENV !== "production") (window as unknown as { __introTl?: unknown }).__introTl = tl;
      } catch {
        finish();
      }
    })();

    return () => {
      finished = true;
      stop();
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(watchdog);
    };
  }, []);

  if (done) return null;

  return (
    <div className="intro" role="presentation">
      <div ref={bgRef} className="intro-bg" onPointerDown={() => finishRef.current()} />
      <div className="intro-center">
        <p ref={oldRef} className="intro-old">
          Club Renda Passiva
        </p>
        <div ref={wrapRef} className="intro-mark-wrap">
          <svg ref={markRef} viewBox={WORDMARK_VIEWBOX} className="intro-mark" aria-hidden focusable="false">
            {(Object.keys(WORDMARK_PARTS) as (keyof typeof WORDMARK_PARTS)[]).map((k) => (
              <path key={k} data-part={k} d={WORDMARK_PARTS[k]} fillRule="evenodd" />
            ))}
          </svg>
        </div>
      </div>
      <p ref={tagRef} className="intro-tag">
        Seus ativos. Seu controle.
      </p>
      <button type="button" className="intro-skip" autoFocus onClick={() => finishRef.current()}>
        Pular animação
      </button>
    </div>
  );
}
