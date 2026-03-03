"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LayoutOption = 1 | 2;

interface LayoutContextValue {
  active: LayoutOption;
  setActive: (option: LayoutOption) => void;
  transitioning: boolean;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [active, setActiveRaw] = useState<LayoutOption>(1);
  const [transitioning, setTransitioning] = useState(false);

  const setActive = useCallback(
    (option: LayoutOption) => {
      if (option === active || transitioning) return;
      setTransitioning(true);

      setTimeout(() => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        ScrollTrigger.clearScrollMemory();
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);

        setActiveRaw(option);

        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = "";
          ScrollTrigger.refresh();
          setTransitioning(false);
        });
      }, 300);
    },
    [active, transitioning]
  );

  return (
    <LayoutContext.Provider value={{ active, setActive, transitioning }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
