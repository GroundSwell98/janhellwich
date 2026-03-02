"use client";

import type { Project } from "@/data/projects";

interface ProjectTitlesProps {
  projects: Project[];
  activeIndex: number;
}

export default function ProjectTitles({
  projects,
  activeIndex,
}: ProjectTitlesProps) {
  return (
    <div className="flex flex-col gap-1">
      {projects.map((project, i) => {
        const isActive = i === activeIndex;
        return (
          <div key={project.slug} className="flex items-baseline gap-2">
            <span
              className="text-[clamp(1rem,1.8vw,1.5rem)] leading-[1.3] uppercase tracking-[-0.01em] transition-colors duration-500 ease-out"
              style={{
                color: isActive ? "#111111" : "#C8C8C6",
              }}
            >
              {project.title}
            </span>
            <span
              className="text-[10px] tracking-[0.05em] tabular-nums transition-colors duration-500 ease-out"
              style={{
                color: isActive ? "#999" : "#D8D8D6",
              }}
            >
              {project.year}
            </span>
          </div>
        );
      })}
    </div>
  );
}
