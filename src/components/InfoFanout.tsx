"use client";

import { useEffect, useRef, useState } from "react";

const BIO_PARAGRAPHS = [
  "As a son of a photographer, Jan grew up with a passion for the arts. After studying film in Cologne, Germany, he quickly rose to the role of lead art director at the esteemed production company BWGTBLD GmbH. Seeking to further refine his distinct visual style, he continued honing his craft at the prestigious Filmakademie, Germany.",
  "As creative assistant to the illustrious Gordon von Steiner, Jan collaborates closely with von Steiner on projects for iconic brands like Chanel, Calvin Klein, Louis Vuitton, and musician Troye Sivan.",
  "Drawn to strong visual narratives, Jan's work explores culturally significant themes. Recently, he has contributed to high-profile projects with Dua Lipa for Chanel, as well as a cinematic exploration of Turkish oil wrestling, bringing his distinctive aesthetic to each. The latter winning Gold at the 2025 Young Director Award in Cannes.",
];

export default function InfoFanout() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 z-50 px-6 py-5 md:px-10 md:py-8 pointer-events-none"
    >
      <div className="flex flex-col items-start gap-5 md:gap-6 pointer-events-auto">
        <div
          className="flex flex-col gap-4 max-w-[20rem] md:max-w-[22rem]"
          aria-hidden={!open}
        >
          {BIO_PARAGRAPHS.map((text, i) => (
            <p
              key={i}
              className="text-[10px] md:text-[11px] leading-[1.55] uppercase tracking-[0.04em] text-fg/85 transition-all ease-out"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
                transitionDuration: "500ms",
                transitionDelay: open
                  ? `${80 + i * 90}ms`
                  : `${(BIO_PARAGRAPHS.length - 1 - i) * 40}ms`,
                pointerEvents: open ? "auto" : "none",
              }}
            >
              {text}
            </p>
          ))}

          <div
            className="flex flex-col gap-1 mt-2 transition-all ease-out"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(8px)",
              transitionDuration: "500ms",
              transitionDelay: open
                ? `${80 + BIO_PARAGRAPHS.length * 90}ms`
                : "0ms",
              pointerEvents: open ? "auto" : "none",
            }}
          >
            <a
              href="mailto:janlucahellwich@gmail.com"
              className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
            >
              janlucahellwich@gmail.com
            </a>
            <a
              href="tel:+4917680826844"
              className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
            >
              +49 176 808 268 44
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close info" : "Open info"}
          className="text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300 bg-transparent border-0 p-0 cursor-pointer"
        >
          Info
        </button>
      </div>
    </div>
  );
}
