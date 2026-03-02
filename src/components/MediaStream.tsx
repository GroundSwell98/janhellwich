"use client";

import { useCallback } from "react";
import type { Project } from "@/data/projects";
import MediaItem from "./MediaItem";

interface MediaStreamProps {
  projects: Project[];
  mediaRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

export default function MediaStream({ projects, mediaRefs }: MediaStreamProps) {
  const setMediaRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) {
        mediaRefs.current.set(key, el);
      } else {
        mediaRefs.current.delete(key);
      }
    },
    [mediaRefs]
  );

  return (
    <div className="flex flex-col">
      {projects.map((project, projectIndex) => (
        <div
          key={project.slug}
          id={`project-${project.slug}`}
          data-project-section={projectIndex}
          className="flex flex-col gap-8 md:gap-10"
          style={{
            paddingTop: projectIndex === 0 ? "8vh" : "15vh",
            paddingBottom: "5vh",
          }}
        >
          {/* Mobile project title */}
          <h2 className="md:hidden text-xl uppercase tracking-[-0.01em] text-fg">
            {project.title}
            <span className="text-[10px] text-muted ml-2 tracking-[0.05em] tabular-nums">
              {project.year}
            </span>
          </h2>

          {project.media.map((item, mediaIndex) => (
            <MediaItem
              key={`${project.slug}-${mediaIndex}`}
              ref={setMediaRef(`${project.slug}-${mediaIndex}`)}
              item={item}
              projectSlug={project.slug}
              index={mediaIndex}
              priority={projectIndex === 0 && mediaIndex === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
