import type { CSSProperties } from "react";

// Quebra um texto em palavras mascaradas. A animação é CSS puro (globals.css, [data-hero-word]):
// roda no primeiro quadro, sem esperar hidratação, e fica pausada durante a intro de marca.
export function SplitWords({ text, start = 0, className }: { text: string; start?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word-mask">
            <span data-hero-word style={{ "--i": start + i } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
