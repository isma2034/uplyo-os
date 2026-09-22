"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%€+-/#";

/**
 * Texte qui se « décode » : des caractères aléatoires se fixent un à un sur
 * le texte final (effet de l'écran d'accueil de Locomotive, ramené ici à
 * une étiquette courte, sans écran de chargement).
 *
 * Le texte final est rendu côté serveur et reste celui qu'annoncent les
 * lecteurs d'écran (texte masqué visuellement) ; seul l'affichage est brouillé.
 */
export default function Scramble({
  text,
  className,
  delay = 0,
  duration = 900,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const [shown, setShown] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;

    const run = () => {
      const start = performance.now() + delay;
      const frame = (now: number) => {
        const p = Math.max(0, Math.min(1, (now - start) / duration));
        const fixed = Math.floor(p * text.length);
        let out = text.slice(0, fixed);
        for (let i = fixed; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setShown(out);
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
