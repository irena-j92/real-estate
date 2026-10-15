import { sitePath } from "../lib/sitePath.js";
import HoverControl from "./ui/HoverControl";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useVideoScrub from "../hooks/useVideoScrub";
import useHeroFrames, { HERO_DURATION } from "../hooks/useHeroFrames";
import LiquidSquareGrid from "./experience/LiquidSquareGrid";

export default function Hero({ ready = false }) {
  const sectionRef = useRef(null),
    videoRef = useRef(null),
    canvasRef = useRef(null);
  const [metadataReady, setMetadataReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const film = useHeroFrames(canvasRef);
  useVideoScrub({
    sectionRef,
    videoRef,
    ready,
    metadataReady: metadataReady || film.ready,
    duration: HERO_DURATION,
    onTimeChange: film.seek,
  });
  useEffect(() => {
    // Cached media can become ready before React attaches its event handlers.
    const video = videoRef.current;
    if (video?.readyState >= 1 && Number.isFinite(video.duration))
      setMetadataReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-small",
        { opacity: 0, y: reduced ? 0 : 16 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.01 : 0.65,
          stagger: 0.06,
          delay: reduced ? 0 : 0.25,
          ease: "power3.out",
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);
  return (
    <section
      id="top"
      ref={sectionRef}
      className="cinematic-hero"
      aria-label="Sunter Realty — remarkable homes, personal guidance"
    >
      <img
        className="hero-fallback"
        src={sitePath("/assets/hero-poster.webp")}
        alt=""
        fetchPriority="high"
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        data-hero-video
        src={sitePath("/assets/hero-video.mp4")}
        className={`hero-film ${failed ? "has-error" : "is-ready"}`}
        poster={sitePath("/assets/hero-poster.webp")}
        muted
        playsInline
        preload="none"
        onLoadedMetadata={() => setMetadataReady(true)}
        onLoadedData={() => setMetadataReady(true)}
        onError={() => setFailed(true)}
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className={`hero-frame-canvas ${film.ready ? "is-ready" : ""}`}
        aria-hidden="true"
      />
      <div className="hero-scrim" aria-hidden="true" />
      <LiquidSquareGrid surfaceRef={sectionRef} enabled={ready} />
      <div className="hero-scene-copy">
        <div className="hero-bottom hero-small">
          <HoverControl as="a"
            className="collection-orbit"
            href="#trending"
            aria-label="View our collection"
          >
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle className="orbit-track" cx="100" cy="100" r="98" />
              <circle
                className="orbit-progress"
                cx="100"
                cy="100"
                r="98"
                pathLength="100"
              />
            </svg>
            <span>
              View our
              <br />
              collection
            </span>
          </HoverControl>
        </div>
        <div className="hero-contact-actions hero-small">
          <HoverControl as="a"
            className="hero-call-button"
            href="#contact"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("realty-inquiry", {
                  detail: "I'd like to book a call with Sunter Realty about my next move.",
                }),
              )
            }
          >
            Book a call
          </HoverControl>
          <HoverControl as="a" className="hero-contact-link" href="#contact">
            Contact
          </HoverControl>
        </div>
      </div>
      <div className="hero-transition" aria-hidden="true">
        <div className="hero-transition-panel" />
      </div>
    </section>
  );
}
