"use client";

import { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { projects, type Project } from "@/data/projects";

type ViewState = { mode: "overview" } | { mode: "detail"; slug: string };

const GRID_LAYOUTS: { area: string }[] = [
  { area: "1 / 1 / 3 / 9" },
  { area: "1 / 9 / 2 / 13" },
  { area: "2 / 9 / 3 / 13" },
  { area: "3 / 1 / 4 / 6" },
  { area: "3 / 6 / 5 / 10" },
  { area: "3 / 10 / 4 / 13" },
];

const SPREAD_LAYOUTS = [
  { hero: "65%", supporting: ["35%", "35%"] },
  { hero: "55%", supporting: ["45%", "45%"] },
  { hero: "60%", supporting: ["40%", "40%"] },
  { hero: "70%", supporting: ["30%", "30%"] },
  { hero: "50%", supporting: ["50%", "50%"] },
  { hero: "58%", supporting: ["42%", "42%"] },
];

export default function EditorialGrid() {
  const [view, setView] = useState<ViewState>({ mode: "overview" });
  const gridRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const navigateTo = useCallback((slug: string) => {
    window.scrollTo(0, 0);
    setView({ mode: "detail", slug });
  }, []);

  const openProject = useCallback((slug: string) => {
    const grid = gridRef.current;
    if (!grid) return;

    const tl = gsap.timeline({
      onComplete: () => {
        window.scrollTo(0, 0);
        setView({ mode: "detail", slug });
      },
    });

    const allThumbs = grid.querySelectorAll("[data-grid-item]");
    allThumbs.forEach((el) => {
      if ((el as HTMLElement).dataset.gridItem !== slug) {
        tl.to(el, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in" }, 0);
      }
    });

    const titleEls = grid.querySelectorAll("[data-grid-title]");
    titleEls.forEach((el) => {
      tl.to(el, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" }, 0);
    });

    const thumb = thumbRefs.current.get(slug);
    if (thumb) {
      tl.to(thumb, { opacity: 0, duration: 0.15 }, 0.25);
    }
  }, []);

  const closeProject = useCallback(() => {
    if (!detailRef.current) {
      setView({ mode: "overview" });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        window.scrollTo(0, 0);
        setView({ mode: "overview" });
      },
    });

    tl.to(detailRef.current, { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" });
  }, []);

  useEffect(() => {
    if (view.mode === "overview" && gridRef.current) {
      const items = gridRef.current.querySelectorAll("[data-grid-item]");
      const titles = gridRef.current.querySelectorAll("[data-grid-title]");

      gsap.set([...items, ...titles], { clearProps: "all" });

      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.45 }
      );

      gsap.fromTo(
        titles,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out", delay: 0.55 }
      );
    }

    if (view.mode === "detail" && detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      const images = detailRef.current.querySelectorAll("[data-spread-image]");
      gsap.fromTo(
        images,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.15 }
      );
    }
  }, [view]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (view.mode === "detail") {
        if (e.key === "Escape") {
          closeProject();
          return;
        }
        const currentIdx = projects.findIndex((p) => p.slug === view.slug);
        if (e.key === "ArrowRight" && currentIdx < projects.length - 1) {
          navigateTo(projects[currentIdx + 1].slug);
        } else if (e.key === "ArrowLeft" && currentIdx > 0) {
          navigateTo(projects[currentIdx - 1].slug);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, closeProject, navigateTo]);

  if (view.mode === "detail") {
    const project = projects.find((p) => p.slug === view.slug)!;
    const projectIdx = projects.findIndex((p) => p.slug === view.slug);
    const layout = SPREAD_LAYOUTS[projectIdx % SPREAD_LAYOUTS.length];
    return (
      <DetailSpread
        ref={detailRef}
        project={project}
        projectIdx={projectIdx}
        layout={layout}
        onClose={closeProject}
        onNavigate={navigateTo}
      />
    );
  }

  return (
    <div ref={gridRef} className="min-h-screen px-6 lg:px-10 pt-24 pb-16">
      <div
        className="grid gap-3 md:gap-4"
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "repeat(4, minmax(18vh, auto))",
        }}
      >
        {projects.map((project, i) => {
          const gridPos = GRID_LAYOUTS[i % GRID_LAYOUTS.length];
          return (
            <div
              key={project.slug}
              style={{ gridArea: gridPos.area }}
              className="relative group cursor-pointer"
              onClick={() => openProject(project.slug)}
            >
              <div
                ref={(el) => {
                  if (el) thumbRefs.current.set(project.slug, el);
                  else thumbRefs.current.delete(project.slug);
                }}
                data-grid-item={project.slug}
                className="w-full h-full overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.thumbnail.src}
                  alt={project.thumbnail.alt || project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div
                data-grid-title
                className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex items-end justify-between"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
                }}
              >
                <span className="text-[clamp(0.7rem,1.2vw,1rem)] uppercase tracking-[0.02em] text-white/90 leading-tight">
                  {project.title}
                </span>
                <span className="text-[9px] tracking-[0.1em] text-white/50 tabular-nums">
                  {project.year}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DetailSpreadProps {
  project: Project;
  projectIdx: number;
  layout: (typeof SPREAD_LAYOUTS)[number];
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

const DetailSpread = forwardRef<HTMLDivElement, DetailSpreadProps>(
  function DetailSpread({ project, projectIdx, layout, onClose, onNavigate }, ref) {
    const heroMedia = project.media[0];
    const supportingMedia = project.media.slice(1);
    const isEven = projectIdx % 2 === 0;

    return (
      <div ref={ref} className="min-h-screen px-6 lg:px-10 pt-20 pb-16">
        <button
          onClick={onClose}
          className="fixed top-5 left-6 lg:left-10 z-50 text-[11px] tracking-[0.15em] uppercase text-fg/60 hover:text-fg transition-colors duration-300 cursor-pointer"
        >
          Back
        </button>

        <div
          className="mb-8 md:mb-12"
          style={{
            paddingLeft: isEven ? "0" : "15%",
            paddingRight: isEven ? "15%" : "0",
          }}
        >
          <h2 className="text-[clamp(2rem,6vw,5rem)] uppercase tracking-[-0.03em] leading-[0.95] text-fg">
            {project.title}
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-[11px] tracking-[0.15em] text-muted tabular-nums">
              {project.year}
            </span>
            {project.client && (
              <span className="text-[11px] tracking-[0.15em] text-muted uppercase">
                {project.client}
              </span>
            )}
          </div>
        </div>

        <div
          data-spread-image
          className="mb-4 md:mb-6"
          style={{
            width: layout.hero,
            marginLeft: isEven ? "0" : "auto",
          }}
        >
          <div style={{ aspectRatio: heroMedia.width / heroMedia.height }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroMedia.src}
              alt={heroMedia.alt || ""}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        <div
          className="flex gap-4 md:gap-6"
          style={{
            flexDirection: isEven ? "row" : "row-reverse",
            justifyContent: isEven ? "flex-end" : "flex-start",
          }}
        >
          {supportingMedia.map((item, idx) => (
            <div
              key={idx}
              data-spread-image
              style={{
                width: layout.supporting[idx % layout.supporting.length],
                maxWidth: "48%",
              }}
            >
              <div style={{ aspectRatio: item.width / item.height }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt || ""}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12 md:mt-16 pt-6 border-t border-fg/[0.08]">
          {projectIdx > 0 ? (
            <button
              onClick={() => onNavigate(projects[projectIdx - 1].slug)}
              className="text-[11px] tracking-[0.15em] uppercase text-fg/40 hover:text-fg transition-colors duration-300 cursor-pointer"
            >
              {projects[projectIdx - 1].title}
            </button>
          ) : (
            <span />
          )}
          <span className="text-[10px] tracking-[0.1em] text-fg/20 tabular-nums">
            {projectIdx + 1} / {projects.length}
          </span>
          {projectIdx < projects.length - 1 ? (
            <button
              onClick={() => onNavigate(projects[projectIdx + 1].slug)}
              className="text-[11px] tracking-[0.15em] uppercase text-fg/40 hover:text-fg transition-colors duration-300 cursor-pointer"
            >
              {projects[projectIdx + 1].title}
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    );
  }
);
