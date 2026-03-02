"use client";

import Nav from "@/components/Nav";
import ScrollExperience from "@/components/ScrollExperience";
import HorizontalReel from "@/components/HorizontalReel";
import EditorialGrid from "@/components/EditorialGrid";
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
      {active === 3 && <EditorialGrid />}
    </div>
  );
}

export default function Home() {
  return (
    <LayoutProvider>
      <div className="animate-fade-in">
        <Nav />
        <ActiveLayout />
      </div>
      <DevBox />
    </LayoutProvider>
  );
}
