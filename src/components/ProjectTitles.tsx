"use client";

import type { Project } from "@/data/projects";

interface ProjectTitlesProps {
  projects: Project[];
  activeIndex: number;
  onTitleClick?: (index: number) => void;
}

export default function ProjectTitles({
  projects,
  activeIndex,
  onTitleClick,
}: ProjectTitlesProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={project.slug}
            onClick={() => onTitleClick?.(i)}
            className="flex items-baseline gap-2 text-left bg-transparent border-none p-0 cursor-pointer"
            style={{ lineHeight: "1.65" }}
          >
            <span
              className="text-[clamp(1rem,1.8vw,1.5rem)] uppercase tracking-[-0.01em] transition-all duration-500 ease-out"
              style={{
                color: isActive ? "#111111" : "#C8C8C6",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {project.title}
            </span>
            <span
              className="text-[10px] tracking-[0.05em] tabular-nums transition-colors duration-500 ease-out whitespace-nowrap"
              style={{
                color: isActive ? "#999" : "#D8D8D6",
              }}
            >
              {project.year}
            </span>
          </button>
        );
      })}
    </div>
  );
}
