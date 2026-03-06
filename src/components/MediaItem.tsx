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
import PreviewControls from "./PreviewControls";

const SKELETON_BG = "#DDDDDB";
const HOVER_DWELL_MS = 150;
const TOUCH_HOLD_MS = 200;
const CONTROLS_DELAY_MS = 600;
const CONTROLS_AUTOHIDE_MS = 2000;

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
    const [controlsVisible, setControlsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [shouldRenderVideo, setShouldRenderVideo] = useState(false);

    const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const autohideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const touchHoldTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const touchStartedRef = useRef(false);
    const touchMovedRef = useRef(false);

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
        setVideoActive(true);
        controlsTimerRef.current = setTimeout(() => {
          if (!isTouchDevice) setControlsVisible(true);
        }, CONTROLS_DELAY_MS);
      };

      video.play().catch(() => {});

      if (video.readyState >= 2) {
        startCrossfade();
      } else {
        const onReady = () => {
          video.removeEventListener("loadeddata", onReady);
          startCrossfade();
        };
        video.addEventListener("loadeddata", onReady);
      }
    }, [isTouchDevice]);

    const pauseVideo = useCallback(() => {
      const video = videoRef.current;
      if (video && !video.paused) video.pause();
      setVideoActive(false);
      setControlsVisible(false);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      if (autohideTimerRef.current) clearTimeout(autohideTimerRef.current);
    }, []);

    const resetAutohide = useCallback(() => {
      if (!videoActive) return;
      setControlsVisible(true);
      if (autohideTimerRef.current) clearTimeout(autohideTimerRef.current);
      autohideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, CONTROLS_AUTOHIDE_MS);
    }, [videoActive]);

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

    const handleMouseMove = useCallback(() => {
      if (videoActive && !isTouchDevice) resetAutohide();
    }, [videoActive, isTouchDevice, resetAutohide]);

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
        onMouseMove={handleMouseMove}
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
                style={{ zIndex: 5, opacity: videoActive ? 1 : 0 }}
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

            {/* Layer 4: preview controls (desktop only) */}
            {hasVideo && !isTouchDevice && (
              <div className="absolute inset-0" style={{ zIndex: 20 }}>
                <PreviewControls
                  videoRef={videoRef}
                  visible={controlsVisible}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default MediaItem;
