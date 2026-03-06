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
  const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(null);
  const [preloadVideoSrc, setPreloadVideoSrc] = useState<string | null>(null);
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

  const handleHoverVideo = useCallback((videoSrc: string | null) => {
    if (unhoverTimerRef.current) clearTimeout(unhoverTimerRef.current);

    if (videoSrc) {
      setPreloadVideoSrc(videoSrc);
    } else {
      unhoverTimerRef.current = setTimeout(() => {
        setPreloadVideoSrc((current) => {
          if (current && current !== activeVideoSrc) return null;
          return current;
        });
      }, 2000);
    }
  }, [activeVideoSrc]);

  const handleOpenVideo = useCallback((videoSrc: string) => {
    if (unhoverTimerRef.current) clearTimeout(unhoverTimerRef.current);
    setPreloadVideoSrc(videoSrc);
    setActiveVideoSrc(videoSrc);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setActiveVideoSrc(null);
    setPreloadVideoSrc(null);
  }, []);

  const overlayVideoSrc = activeVideoSrc || preloadVideoSrc;

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
                  videoSrc={project.videoSrc}
                  onOpenVideo={handleOpenVideo}
                  onHoverVideo={handleHoverVideo}
                />
              </div>
            </div>
          );
        })}
      </div>

      {overlayVideoSrc && (
        <VideoOverlay
          videoSrc={overlayVideoSrc}
          visible={!!activeVideoSrc}
          onClose={handleCloseVideo}
        />
      )}
    </>
  );
}
