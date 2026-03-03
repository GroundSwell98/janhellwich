"use client";

import ScrollExperience from "@/components/ScrollExperience";
import HorizontalReel from "@/components/HorizontalReel";
import DevBox from "@/components/DevBox";
import { LayoutProvider, useLayout } from "@/contexts/LayoutContext";

function ActiveLayout() {
  const { active, transitioning } = useLayout();

  return (
    <div
      className={transitioning ? "layout-exit" : "layout-enter"}
      key={active}
    >
      {active === 1 && <ScrollExperience />}
      {active === 2 && <HorizontalReel />}
    </div>
  );
}

export default function Home() {
  return (
    <LayoutProvider>
      <div className="animate-fade-in">
        <ActiveLayout />
      </div>
      <DevBox />
    </LayoutProvider>
  );
}
