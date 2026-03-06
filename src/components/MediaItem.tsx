"use client";

import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { MediaItem as MediaItemType } from "@/data/projects";

const SKELETON_BG = "#DDDDDB";
const HOVER_DWELL_MS = 150;
const TOUCH_HOLD_MS = 200;

interface MediaItemProps {
  item: MediaItemType;
  projectSlug: string;
  index: number;
  priority?: boolean;
  previewVideo?: string;
  vimeoId?: string;
  onOpenVideo?: (vimeoId: string) => void;
  onHoverVideo?: (vimeoId: string | null) => void;
}

const MediaItem = forwardRef<HTMLDivElement, MediaItemProps>(
  function MediaItem(
    { item, projectSlug, index, priority = false, previewVideo, vimeoId, onOpenVideo, onHoverVideo },
    ref
  ) {
    const aspectRatio = item.width / item.height;
    const imgRef = useRef<HTMLImageElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [videoActive, setVideoActive] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [shouldRenderVideo, setShouldRenderVideo] = useState(false);

    const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const touchHoldTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const touchStartedRef = useRef(false);
    const touchMovedRef = useRef(false);
    const playingListenerRef = useRef<(() => void) | null>(null);

    useEffect(() => {
      setIsTouchDevice("ontouchstart" in window);
    }, []);

    const imageLoadedRef = useRef(false);

    useLayoutEffect(() => {
      const img = imgRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        imageLoadedRef.current = true;
        img.style.opacity = "1";
        if (placeholderRef.current)
          placeholderRef.current.style.opacity = "0";
      }
    }, []);

    useEffect(() => {
      if (!previewVideo) return;
      const el = wrapperRef.current;
      if (!el) return;

      const slow =
        typeof navigator !== "undefined" &&
        "connection" in navigator &&
        ["slow-2g", "2g"].includes(
          (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType ?? ""
        );
      if (slow) return;

      const margin = isTouchDevice ? "200px" : "600px";
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldRenderVideo(true);
            observer.disconnect();
          }
        },
        { rootMargin: margin }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [previewVideo, isTouchDevice]);

    const playVideo = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      const startCrossfade = () => {
        requestAnimationFrame(() => {
          setVideoActive(true);
        });
      };

      if (playingListenerRef.current) {
        video.removeEventListener("playing", playingListenerRef.current);
        playingListenerRef.current = null;
      }

      const onPlaying = () => {
        video.removeEventListener("playing", onPlaying);
        playingListenerRef.current = null;
        startCrossfade();
      };

      if (!video.paused && video.readyState >= 3) {
        startCrossfade();
      } else {
        playingListenerRef.current = onPlaying;
        video.addEventListener("playing", onPlaying);
        video.play().catch(() => {
          video.removeEventListener("playing", onPlaying);
          playingListenerRef.current = null;
        });
      }
    }, []);

    const pauseVideo = useCallback(() => {
      const video = videoRef.current;
      if (video) {
        if (playingListenerRef.current) {
          video.removeEventListener("playing", playingListenerRef.current);
          playingListenerRef.current = null;
        }
        if (!video.paused) video.pause();
      }
      setVideoActive(false);
    }, []);

    const handleClick = useCallback(() => {
      if (vimeoId && onOpenVideo) {
        pauseVideo();
        onOpenVideo(vimeoId);
      }
    }, [vimeoId, onOpenVideo, pauseVideo]);

    const handleMouseEnter = useCallback(() => {
      if (isTouchDevice) return;
      if (vimeoId && onHoverVideo) onHoverVideo(vimeoId);
      if (!previewVideo || !shouldRenderVideo) return;
      hoverTimerRef.current = setTimeout(playVideo, HOVER_DWELL_MS);
    }, [isTouchDevice, previewVideo, shouldRenderVideo, playVideo, vimeoId, onHoverVideo]);

    const handleMouseLeave = useCallback(() => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (onHoverVideo) onHoverVideo(null);
      pauseVideo();
    }, [pauseVideo, onHoverVideo]);

    const handleTouchStart = useCallback(() => {
      if (!isTouchDevice) return;
      touchStartedRef.current = true;
      touchMovedRef.current = false;

      if (previewVideo && shouldRenderVideo) {
        touchHoldTimerRef.current = setTimeout(() => {
          if (touchStartedRef.current && !touchMovedRef.current) {
            playVideo();
          }
        }, TOUCH_HOLD_MS);
      }
    }, [isTouchDevice, previewVideo, shouldRenderVideo, playVideo]);

    const handleTouchMove = useCallback(() => {
      touchMovedRef.current = true;
      if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
    }, []);

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
        const wasHolding = videoActive;
        touchStartedRef.current = false;

        if (wasHolding) {
          e.preventDefault();
          pauseVideo();
        } else if (!touchMovedRef.current) {
          handleClick();
        }
      },
      [videoActive, pauseVideo, handleClick]
    );

    useEffect(() => {
      const img = imgRef.current;
      if (!img || !imageLoadedRef.current) return;
      img.style.opacity = videoActive ? "0" : "1";
    }, [videoActive]);

    const hasVideo = !!previewVideo && shouldRenderVideo;
    const showCursor = vimeoId ? "cursor-pointer" : "";

    return (
      <div
        ref={(el) => {
          (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        data-media-item
        data-project={projectSlug}
        data-index={index}
        data-video-active={videoActive || undefined}
        className={`w-full ${showCursor}`}
        style={{ aspectRatio }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={!isTouchDevice ? handleClick : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            {/* Layer 1: skeleton placeholder */}
            <div
              ref={placeholderRef}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ backgroundColor: SKELETON_BG, zIndex: 1 }}
            />

            {/* Layer 2: preview video (hidden until hover/hold) */}
            {hasVideo && (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  zIndex: 5,
                  opacity: videoActive ? 1 : 0,
                  transition: "opacity 300ms ease",
                }}
                muted
                loop
                playsInline
                preload={isTouchDevice ? "metadata" : "auto"}
              >
                <source src={previewVideo} type="video/mp4" />
              </video>
            )}

            {/* Layer 3: hero image (fades out to reveal video) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={item.src}
              alt={item.alt || ""}
              className="w-full h-full object-cover absolute inset-0 text-transparent transition-opacity duration-500"
              style={{ opacity: 0, zIndex: 10 }}
              loading={priority ? "eager" : "lazy"}
              onLoad={(e) => {
                imageLoadedRef.current = true;
                if (!videoActive) e.currentTarget.style.opacity = "1";
                if (placeholderRef.current)
                  placeholderRef.current.style.opacity = "0";
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
