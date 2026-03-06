"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import "plyr/dist/plyr.css";

interface VideoOverlayProps {
  videoSrc: string;
  visible: boolean;
  onClose: () => void;
}

export default function VideoOverlay({
  videoSrc,
  visible,
  onClose,
}: VideoOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const plyrInstanceRef = useRef<unknown>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const handleClose = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      if (plyrInstanceRef.current && typeof (plyrInstanceRef.current as { destroy: () => void }).destroy === "function") {
        (plyrInstanceRef.current as { destroy: () => void }).destroy();
        plyrInstanceRef.current = null;
      }
      onClose();
    }, 500);
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      const player = plyrInstanceRef.current as { muted: boolean } | null;
      if (player) player.muted = false;
      requestAnimationFrame(() => setFadeIn(true));
    } else {
      setFadeIn(false);
    }
    return () => {
      if (visible) document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible, handleClose]);

  useEffect(() => {
    let cancelled = false;

    async function initPlayer() {
      const { default: Plyr } = await import("plyr");

      if (cancelled || !playerRef.current) return;

      const video = document.createElement("video");
      video.playsInline = true;

      const source = document.createElement("source");
      source.src = videoSrc;
      source.type = "video/mp4";
      video.appendChild(source);

      playerRef.current.appendChild(video);

      const instance = new Plyr(video, {
        controls: ["play", "progress", "mute", "fullscreen"],
        clickToPlay: true,
        autoplay: true,
        muted: true,
      });

      plyrInstanceRef.current = instance;

      instance.on("ready", () => {
        if (!cancelled) {
          instance.muted = true;
          instance.play();
        }
      });

      instance.on("playing", () => {
        if (!cancelled) setPlayerReady(true);
      });
    }

    initPlayer();

    return () => {
      cancelled = true;
      if (plyrInstanceRef.current && typeof (plyrInstanceRef.current as { destroy: () => void }).destroy === "function") {
        (plyrInstanceRef.current as { destroy: () => void }).destroy();
        plyrInstanceRef.current = null;
      }
    };
  }, [videoSrc]);

  const isShown = visible && fadeIn;

  return createPortal(
    <div
      ref={containerRef}
      className="video-overlay"
      style={{
        opacity: isShown ? 1 : 0,
        pointerEvents: isShown ? "auto" : "none",
      }}
      onClick={(e) => {
        if (e.target === containerRef.current) handleClose();
      }}
    >
      <button
        className="video-overlay__close"
        style={{ opacity: isShown && playerReady ? 1 : 0 }}
        onClick={handleClose}
        aria-label="Close video"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="2" y1="2" x2="18" y2="18" />
          <line x1="18" y1="2" x2="2" y2="18" />
        </svg>
      </button>

      {isShown && !playerReady && (
        <div className="video-overlay__loader">
          <div className="video-overlay__spinner" />
        </div>
      )}

      <div
        className="video-overlay__player"
        style={{ opacity: isShown && playerReady ? 1 : 0 }}
      >
        <div ref={playerRef} />
      </div>
    </div>,
    document.body
  );
}
