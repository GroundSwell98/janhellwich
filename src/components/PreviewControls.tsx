"use client";

import { useEffect, useRef, useCallback } from "react";

interface PreviewControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  visible: boolean;
}

export default function PreviewControls({
  videoRef,
  visible,
}: PreviewControlsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const hiddenTimerRef = useRef(0);
  const showRef = useRef(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    const fill = fillRef.current;
    if (video && fill && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      fill.style.width = `${pct}%`;
    }
    if (showRef.current) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [videoRef]);

  useEffect(() => {
    showRef.current = visible;
    if (visible) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, updateProgress]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      const track = trackRef.current;
      if (!video || !track || !video.duration) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = pct * video.duration;
    },
    [videoRef]
  );

  return (
    <div
      ref={controlsRef}
      className="preview-controls"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={trackRef}
        className="preview-controls__track"
        onClick={handleSeek}
      >
        <div ref={fillRef} className="preview-controls__fill" />
      </div>
    </div>
  );
}
