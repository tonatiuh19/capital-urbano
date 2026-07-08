import { useEffect, useRef, useState } from "react";

const HERO_VIDEO_SRC = "/assets/videos/capital-hero-section.mp4";

/** Visible footage + subtle cool grade + enough contrast for white hero copy. */
const VIDEO_GRADE = "brightness-[0.92] saturate-[0.9] contrast-[1.04]";

type HeroBackgroundProps = {
  /** Fired when the cinematic video layer is visible (for hero typography theming). */
  onVideoActive?: (active: boolean) => void;
};

/** Square-grid fallback with optional muted background video overlay. */
export function HeroBackground({ onVideoActive }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;
    setUseVideo(true);
  }, []);

  useEffect(() => {
    if (!useVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => setUseVideo(false));
    };

    if (video.readyState >= 2) play();
    else {
      video.addEventListener("loadeddata", play, { once: true });
      return () => video.removeEventListener("loadeddata", play);
    }
  }, [useVideo]);

  const handleVideoError = () => {
    setUseVideo(false);
    setVideoReady(false);
  };

  const videoActive = useVideo && videoReady;

  useEffect(() => {
    onVideoActive?.(videoActive);
  }, [videoActive, onVideoActive]);

  const gridOnVideoStyle = {
    backgroundImage:
      "linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
    backgroundSize: "100px 100px",
  };

  return (
    <>
      {/* Default: gradient + architectural grid (always shown; visible when video off or loading) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cu-warm-white to-white" />
      <div className="absolute inset-0 opacity-[0.35] pointer-events-none cu-urban-pattern" aria-hidden />

      {/* Background video — falls back to grid above on error or reduced motion */}
      {useVideo && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        >
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover ${VIDEO_GRADE}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onError={handleVideoError}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          {/* Balanced grade: video stays visible; cool tint + bottom scrim for typography */}
          <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950/15 via-transparent to-slate-900/25 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 85% 55% at 50% 42%, rgba(15,23,42,0.28) 0%, transparent 72%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cu-black/55 via-cu-black/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <div className="absolute inset-0" style={gridOnVideoStyle} />
          </div>
        </div>
      )}

      {!videoActive && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cu-orange/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cu-orange/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        </>
      )}
    </>
  );
}
