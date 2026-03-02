"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState(projects[0]?.slug || "");

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
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={trackRef}
        className="flex items-center h-screen will-change-transform"
      >
        {projects.map((project, pIdx) => (
          <div key={project.slug} className="contents">
            {/* Intertitle */}
            <div
              data-intertitle={project.slug}
              className="shrink-0 flex items-center justify-center h-screen"
              style={{
                width: pIdx === 0 ? "100vw" : "60vw",
              }}
            >
              <div className="flex flex-col items-center gap-3 px-12">
                <span className="text-[clamp(2.5rem,5vw,5rem)] uppercase tracking-[-0.02em] leading-[1.05] text-fg text-center">
                  {project.title}
                </span>
                <span className="text-[11px] tracking-[0.15em] text-muted tabular-nums">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Media items */}
            {project.media.map((item, mIdx) => {
              const aspectRatio = item.width / item.height;
              const imgH = 0.75;
              const imgW = imgH * 100 * aspectRatio;

              return (
                <div
                  key={`${project.slug}-${mIdx}`}
                  className="shrink-0 flex items-center"
                  style={{
                    height: "100vh",
                    paddingLeft: mIdx === 0 ? "4vw" : "3vw",
                    paddingRight:
                      mIdx === project.media.length - 1 ? "4vw" : "3vw",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: `${imgH * 100}vh`,
                      width: `${imgW}vh`,
                      maxWidth: "85vw",
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
            })}
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

      {/* Current project label */}
      <div className="fixed bottom-5 left-6 lg:left-10 z-40">
        <span className="text-[10px] tracking-[0.15em] uppercase text-fg/40 transition-opacity duration-300">
          {currentProject &&
            projects.find((p) => p.slug === currentProject)?.title}
        </span>
      </div>
    </div>
  );
}
