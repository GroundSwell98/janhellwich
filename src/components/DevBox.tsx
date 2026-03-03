"use client";

import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

const OPTIONS = [1, 2] as const;

export default function DevBox() {
  const { active, setActive, transitioning } = useLayout();

  return (
    <div className="fixed bottom-6 left-6 lg:left-10 z-[100] flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] tracking-[0.2em] uppercase text-fg">
          dev
        </span>
        <div className="flex items-center rounded-full bg-fg text-bg overflow-hidden">
          {OPTIONS.map((opt) => {
            const isActive = active === opt;
            return (
              <button
                key={opt}
                onClick={() => setActive(opt)}
                disabled={transitioning}
                className={`relative w-9 h-9 flex items-center justify-center text-[11px] tracking-[0.05em] tabular-nums transition-all duration-200 cursor-pointer ${
                  isActive ? "bg-bg text-fg" : "text-bg/70 hover:text-bg"
                }`}
              >
                <span className="relative z-10">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
        >
          Work
        </Link>
        <Link
          href="/info"
          className="text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
        >
          Info
        </Link>
      </div>
    </div>
  );
}
