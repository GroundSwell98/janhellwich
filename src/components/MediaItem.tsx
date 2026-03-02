"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { MediaItem as MediaItemType } from "@/data/projects";

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  "international-klein-blue": "linear-gradient(135deg, #003DA5 0%, #001B60 100%)",
  "dolce-gabbana": "linear-gradient(135deg, #C4A265 0%, #8B6914 100%)",
  "ball-on-ice": "linear-gradient(135deg, #B5D8E8 0%, #6BA3BE 100%)",
  "the-altar": "linear-gradient(135deg, #8B2500 0%, #5C1800 100%)",
  "turkish-oil-wrestling": "linear-gradient(135deg, #A68B5B 0%, #6B5A3A 100%)",
  "le-sage-solange": "linear-gradient(135deg, #D4A5A5 0%, #B57878 100%)",
};

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
    const gradient =
      PLACEHOLDER_GRADIENTS[projectSlug] ||
      "linear-gradient(135deg, #888 0%, #555 100%)";

    useEffect(() => {
      const img = imgRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        img.style.opacity = "1";
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
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: gradient }}
          >
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
