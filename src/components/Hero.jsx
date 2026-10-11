import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useVideoScrub from "../hooks/useVideoScrub";
import Button from "./ui/Button";

export default function Hero({ ready = false }) {
  const sectionRef = useRef(null),
    videoRef = useRef(null);
  const [metadataReady, setMetadataReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useVideoScrub({ sectionRef, videoRef, ready, metadataReady });
  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: reduced ? 0 : 115, rotate: reduced ? 0 : 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: reduced ? 0.01 : 0.95,
          stagger: reduced ? 0 : 0.08,
          ease: "power3.out",
        },
      );
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
      aria-label="Long Realty Southern Arizona"
    >
      <img
        className="hero-fallback"
        src="/assets/properties-2.jpg"
        alt=""
        fetchPriority="high"
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        data-hero-video
        src="/assets/hero-video.mp4"
        className={`hero-film ${metadataReady && !failed ? "is-ready" : ""}`}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={() => setMetadataReady(true)}
        onError={() => setFailed(true)}
        aria-hidden="true"
      />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-scene-copy">
        <div className="hero-coordinate hero-small">
          <span>Southern Arizona</span>
          <span>32°13′ N / 110°58′ W</span>
        </div>
        <h1 aria-label="A place to belong.">
          <span className="hero-line">
            <span className="hero-word">A place</span>
          </span>
          <span className="hero-line hero-line-second">
            <span className="hero-word">
              to <em>belong.</em>
            </span>
          </span>
        </h1>
        <div className="hero-bottom hero-small">
          <p>
            Exceptional homes.
            <br />
            An unmistakable sense of place.
          </p>
          <Button as="a" href="#trending" variant="yellow">
            Discover the collection
          </Button>
          <p className="hero-edition">
            Long Realty
            <br />
            <span>A different perspective.</span>
          </p>
        </div>
      </div>
      <div className="hero-final-caption">
        <span>A little closer to</span>
        <p>your next chapter.</p>
      </div>
      <div className="hero-frame-meta" aria-hidden="true">
        <span>THE ART OF FEELING AT HOME</span>
        <span>EST. IN SOUTHERN ARIZONA</span>
      </div>
    </section>
  );
}
