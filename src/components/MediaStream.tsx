"use client";

import { useCallback, useState, useRef } from "react";
import type { Project } from "@/data/projects";
import MediaItem from "./MediaItem";
import VideoOverlay from "./VideoOverlay";

interface MediaStreamProps {
  projects: Project[];
  mediaRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

export default function MediaStream({ projects, mediaRefs }: MediaStreamProps) {
  const [activeVimeoId, setActiveVimeoId] = useState<string | null>(null);
  const [preloadVimeoId, setPreloadVimeoId] = useState<string | null>(null);
  const unhoverTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

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

  const handleHoverVideo = useCallback((vimeoId: string | null) => {
    if (unhoverTimerRef.current) clearTimeout(unhoverTimerRef.current);

    if (vimeoId) {
      setPreloadVimeoId(vimeoId);
    } else {
      unhoverTimerRef.current = setTimeout(() => {
        setPreloadVimeoId((current) => {
          if (current && current !== activeVimeoId) return null;
          return current;
        });
      }, 2000);
    }
  }, [activeVimeoId]);

  const handleOpenVideo = useCallback((vimeoId: string) => {
    if (unhoverTimerRef.current) clearTimeout(unhoverTimerRef.current);
    setPreloadVimeoId(vimeoId);
    setActiveVimeoId(vimeoId);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setActiveVimeoId(null);
    setPreloadVimeoId(null);
  }, []);

  const overlayVimeoId = activeVimeoId || preloadVimeoId;

  return (
    <>
      <div className="flex flex-col">
        {projects.map((project, projectIndex) => {
          const item = project.media[0];
          return (
            <div
              key={project.slug}
              id={`project-${project.slug}`}
              data-project-section={projectIndex}
              className="flex flex-col"
              style={{
                paddingTop: projectIndex === 0 ? "4vh" : "4.2vh",
                paddingBottom: "1.75vh",
              }}
            >
              <h2 className="md:hidden text-xl uppercase tracking-[-0.01em] text-fg mb-4">
                {project.title}
                <span className="text-[10px] text-muted ml-2 tracking-[0.05em] tabular-nums">
                  {project.year}
                </span>
              </h2>

              <div className="w-[85%] ml-auto">
                <MediaItem
                  ref={setMediaRef(`${project.slug}-0`)}
                  item={item}
                  projectSlug={project.slug}
                  index={0}
                  priority={projectIndex === 0}
                  previewVideo={project.previewVideo}
                  vimeoId={project.vimeoId}
                  onOpenVideo={handleOpenVideo}
                  onHoverVideo={handleHoverVideo}
                />
              </div>
            </div>
          );
        })}
      </div>

      {overlayVimeoId && (
        <VideoOverlay
          vimeoId={overlayVimeoId}
          visible={!!activeVimeoId}
          onClose={handleCloseVideo}
        />
      )}
    </>
  );
}
