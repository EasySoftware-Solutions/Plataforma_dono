"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduce(mq.matches);
      if (mq.matches) {
        ref.current?.pause();
        setPlaying(false);
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Pausa o vídeo quando o herói sai da tela: economiza GPU durante a rolagem
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (playing && !reduce) {
            v.play().catch(() => {});
          }
        } else {
          v.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [playing, reduce]);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover object-[65%_center]"
        src={src}
        poster={poster}
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}
        className="absolute bottom-6 right-5 z-10 flex size-10 items-center justify-center rounded-full bg-black/50 text-ink-muted backdrop-blur-sm transition-colors hover:text-ink sm:right-8"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </>
  );
}
