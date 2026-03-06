"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import ProjectTitles from "./ProjectTitles";
import MediaStream from "./MediaStream";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const visibleItems = useRef<Set<HTMLDivElement>>(new Set());
  const lastBlurValues = useRef<WeakMap<HTMLDivElement, number>>(new WeakMap());
  const lastScrollY = useRef(-1);
  const rafRef = useRef(0);

  const handleTitleClick = useCallback((index: number) => {
    const project = projects[index];
    const section = document.getElementById(`project-${project.slug}`);
    if (section) {
      const rect = section.getBoundingClientRect();
      const scrollTarget = window.scrollY + rect.top - window.innerHeight * 0.15;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  }, []);

  const applyBlur = useCallback(() => {
    const vh = window.innerHeight;
    const center = vh * 0.5;
    const focusZone = vh * 0.18;
    const falloff = 1 / (vh * 0.4);

    visibleItems.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(itemCenter - center);

      let blur: number;
      if (distance < focusZone) {
        blur = 0;
      } else {
        const n = Math.min((distance - focusZone) * falloff, 1);
        blur = n * n * 14;
      }

      const rounded = blur > 0.5 ? Math.round(blur * 2) * 0.5 : 0;
      const prev = lastBlurValues.current.get(el) ?? -1;
      if (rounded === prev) return;

      lastBlurValues.current.set(el, rounded);
      el.style.filter = rounded > 0 ? `blur(${rounded}px)` : "none";
    });
  }, []);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    projects.forEach((project, index) => {
      const section = document.getElementById(`project-${project.slug}`);
      if (!section) return;

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLDivElement;
          if (entry.isIntersecting) {
            visibleItems.current.add(el);
          } else {
            visibleItems.current.delete(el);
            el.style.filter = "none";
            lastBlurValues.current.delete(el);
          }
        });
      },
      { rootMargin: "100px 0px" }
    );

    mediaRefs.current.forEach((el) => observer.observe(el));

    mediaRefs.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
        visibleItems.current.add(el);
      }
    });
    applyBlur();

    function onScroll() {
      const y = window.scrollY;
      if (y === lastScrollY.current) return;
      lastScrollY.current = y;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(applyBlur);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      triggers.forEach((t) => t.kill());
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyBlur]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="flex flex-col md:flex-row">
        <div className="hidden md:block w-[40%] lg:w-[38%]">
          <div className="sticky top-0 h-screen flex flex-col px-6 lg:px-10">
            <div style={{ paddingTop: "calc(4vh - 0.15 * clamp(1rem, 1.8vw, 1.5rem))" }}>
              <ProjectTitles
                projects={projects}
                activeIndex={activeIndex}
                onTitleClick={handleTitleClick}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-[60%] lg:w-[62%] px-5 md:px-0 md:pr-6 lg:pr-10 pt-16 md:pt-0">
          <MediaStream projects={projects} mediaRefs={mediaRefs} />
          <div className="h-[20vh] md:h-[30vh]" />
        </div>
      </div>
    </div>
  );
}
