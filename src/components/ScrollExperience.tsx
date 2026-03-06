"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { projects } from "@/data/projects";
import ProjectTitles from "./ProjectTitles";
import MediaStream from "./MediaStream";

export default function ScrollExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const visibleItems = useRef<Set<HTMLDivElement>>(new Set());
  const lastBlurValues = useRef<WeakMap<HTMLDivElement, number>>(new WeakMap());
  const lastScrollY = useRef(-1);
  const rafRef = useRef(0);

  const titlesWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function alignTitles() {
      const wrap = titlesWrapRef.current;
      if (!wrap) return;
      const span = wrap.querySelector("button span") as HTMLElement;
      const thumb = document.querySelector("[data-media-item]") as HTMLElement;
      if (!span || !thumb) return;

      wrap.style.transform = "";

      const cs = getComputedStyle(span);
      const fontSize = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.1;
      const halfLeading = (lineHeight - fontSize) / 2;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let ascenderAboveCap = fontSize * 0.4;
      if (ctx) {
        ctx.font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
        const m = ctx.measureText("ABCDEFGHIJKLM");
        if (m.fontBoundingBoxAscent !== undefined && m.actualBoundingBoxAscent !== undefined) {
          ascenderAboveCap = m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
        }
      }

      const renderingCorrection = fontSize * -0.10;
      const invisibleAboveCap = halfLeading + ascenderAboveCap + renderingCorrection;
      const spanTop = span.getBoundingClientRect().top;
      const thumbTop = thumb.getBoundingClientRect().top;
      const shift = thumbTop - (spanTop + invisibleAboveCap);

      wrap.style.transform = `translateY(${shift}px)`;
    }

    document.fonts.ready.then(alignTitles);
    window.addEventListener("resize", () => document.fonts.ready.then(alignTitles));
    return () => window.removeEventListener("resize", alignTitles);
  }, []);

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
      if (el.hasAttribute("data-video-active")) {
        const prev = lastBlurValues.current.get(el) ?? -1;
        if (prev !== 0) {
          lastBlurValues.current.set(el, 0);
          el.style.filter = "none";
        }
        return;
      }

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

  const updateActiveIndex = useCallback(() => {
    const triggerLine = window.innerHeight * 0.4;
    let active = 0;
    for (let i = 0; i < projects.length; i++) {
      const section = document.getElementById(`project-${projects[i].slug}`);
      if (!section) continue;
      if (section.getBoundingClientRect().top <= triggerLine) {
        active = i;
      }
    }
    setActiveIndex(active);
  }, []);

  useEffect(() => {
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
    updateActiveIndex();

    function onScroll() {
      const y = window.scrollY;
      if (y === lastScrollY.current) return;
      lastScrollY.current = y;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        applyBlur();
        updateActiveIndex();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyBlur, updateActiveIndex]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <div className="flex flex-col md:flex-row">
        <div className="hidden md:block w-[40%] lg:w-[38%]">
          <div className="sticky top-0 h-screen flex flex-col px-6 lg:px-10">
            <div ref={titlesWrapRef} style={{ paddingTop: "4vh" }}>
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
