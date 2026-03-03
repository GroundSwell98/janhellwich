"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastBlurValues = useRef<Map<HTMLElement, number>>(new Map());
  const [currentProject, setCurrentProject] = useState(projects[0]?.slug || "");

  const applyBlur = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = track.querySelectorAll<HTMLElement>("[data-reel-media]");
    const vw = window.innerWidth;
    const center = vw * 0.5;
    const focusZone = vw * 0.12;
    const falloff = 1 / (vw * 0.4);

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right < -200 || rect.left > vw + 200) return;

      const itemCenter = rect.left + rect.width * 0.5;
      const distance = Math.abs(itemCenter - center);

      let blur: number;
      if (distance < focusZone) {
        blur = 0;
      } else {
        const n = Math.min((distance - focusZone) * falloff, 1);
        blur = n * n * 16;
      }

      const rounded = blur > 0.5 ? Math.round(blur * 2) * 0.5 : 0;
      const prev = lastBlurValues.current.get(el) ?? -1;
      if (rounded === prev) return;

      lastBlurValues.current.set(el, rounded);
      el.style.filter = rounded > 0 ? `blur(${rounded}px)` : "none";
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let ctx: gsap.Context | null = null;

    const initTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      ctx = gsap.context(() => {
        const totalWidth = track.scrollWidth - window.innerWidth;
        if (totalWidth <= 0) return;

        const tween = gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              applyBlur();
            },
          },
        });

        const titleEls = track.querySelectorAll<HTMLElement>("[data-intertitle]");
        titleEls.forEach((el) => {
          const slug = el.dataset.intertitle!;
          ScrollTrigger.create({
            trigger: el,
            containerAnimation: tween,
            start: "left 80%",
            end: "right 20%",
            onEnter: () => setCurrentProject(slug),
            onEnterBack: () => setCurrentProject(slug),
          });
        });
      }, container);
    }, 500);

    return () => {
      clearTimeout(initTimeout);
      ctx?.revert();
    };
  }, [applyBlur]);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={trackRef}
        className="flex items-center h-screen will-change-transform"
      >
        {projects.map((project, pIdx) => (
          <div key={project.slug} className="contents">
            <div
              data-intertitle={project.slug}
              className="shrink-0 flex items-center justify-center h-screen"
              style={{
                width: pIdx === 0 ? "100vw" : "45vw",
              }}
            >
              <div className="flex flex-col items-center gap-3 px-12">
                <span className="text-[clamp(2rem,4vw,4rem)] uppercase tracking-[-0.02em] leading-[1.05] text-fg text-center">
                  {project.title}
                </span>
                <span className="text-[11px] tracking-[0.15em] text-muted tabular-nums">
                  {project.year}
                </span>
              </div>
            </div>

            {(() => {
              const item = project.media[0];
              const aspectRatio = item.width / item.height;
              const imgH = 0.62;
              const imgW = imgH * 100 * aspectRatio;

              return (
                <div
                  className="shrink-0 flex items-center"
                  style={{
                    height: "100vh",
                    paddingLeft: "3vw",
                    paddingRight: "3vw",
                  }}
                >
                  <div
                    data-reel-media
                    className="relative overflow-hidden"
                    style={{
                      height: `${imgH * 100}vh`,
                      width: `${imgW}vh`,
                      maxWidth: "75vw",
                    }}
                  >
                    {item.type === "video" ? (
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                      >
                        <source src={item.src} />
                      </video>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt={item.alt || ""}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        ))}

        <div className="shrink-0 w-[50vw]" />
      </div>

      {/* Progress scrubber */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-[2px] bg-fg/[0.08]">
        <div
          ref={progressRef}
          className="h-full bg-fg/40 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Current project label — bottom right to avoid overlap with DevBox */}
      <div className="fixed bottom-5 right-6 lg:right-10 z-40">
        <span className="text-[10px] tracking-[0.15em] uppercase text-fg/40 transition-opacity duration-300">
          {currentProject &&
            projects.find((p) => p.slug === currentProject)?.title}
        </span>
      </div>
    </div>
  );
}
