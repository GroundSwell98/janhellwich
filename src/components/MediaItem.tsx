"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { MediaItem as MediaItemType } from "@/data/projects";

const SKELETON_BG = "#DDDDDB";
const SKELETON_SHIMMER =
  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)";

interface MediaItemProps {
  item: MediaItemType;
  projectSlug: string;
  index: number;
  priority?: boolean;
}

const MediaItem = forwardRef<HTMLDivElement, MediaItemProps>(
  function MediaItem({ item, projectSlug, index, priority = false }, ref) {
    const aspectRatio = item.width / item.height;
    const imgRef = useRef<HTMLImageElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const img = imgRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        img.style.opacity = "1";
        if (placeholderRef.current)
          placeholderRef.current.style.opacity = "0";
      }
    }, []);

    return (
      <div
        ref={ref}
        data-media-item
        data-project={projectSlug}
        data-index={index}
        className="w-full"
        style={{ aspectRatio }}
      >
        {item.type === "video" ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? "auto" : "none"}
            poster={item.poster}
          >
            <source src={item.src} />
          </video>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <div
              ref={placeholderRef}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ backgroundColor: SKELETON_BG }}
            >
              <div
                className="absolute inset-0 animate-skeleton-shimmer"
                style={{
                  backgroundImage: SKELETON_SHIMMER,
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={item.src}
              alt={item.alt || ""}
              className="w-full h-full object-cover absolute inset-0 z-10 text-transparent transition-opacity duration-500"
              style={{ opacity: 0 }}
              loading={priority ? "eager" : "lazy"}
              onLoad={(e) => {
                e.currentTarget.style.opacity = "1";
                const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                if (placeholder) placeholder.style.opacity = "0";
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

export default MediaItem;
