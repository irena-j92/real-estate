import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const VIDEO_FRAME_STEP = 1 / 24;
export function videoDistances(duration, viewportHeight) {
  const playback = Math.max(duration * 180, viewportHeight * 1.5);
  return { playback, total: playback + viewportHeight * 2 };
}
export function videoTimeAt(progress, duration, viewportHeight) {
  const { playback, total } = videoDistances(duration, viewportHeight);
  return Math.max(
    0,
    Math.min(duration - 0.045, ((progress * total) / playback) * duration),
  );
}

/** Preserve the original pinned playback + two-viewport hold. */
export default function useVideoScrub({
  sectionRef,
  videoRef,
  ready,
  metadataReady,
  duration,
  onTimeChange,
}) {
  const [motionReduced, setMotionReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const section = sectionRef.current,
      video = videoRef.current;
    if (
      !ready ||
      !metadataReady ||
      !section ||
      !video ||
      !Number.isFinite(duration)
    )
      return;
    let frame = 0,
      refreshFrame = 0,
      disposed = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = gsap.context(() => {
      const playhead = { progress: 0 };
      let target = 0;
      let lastSeek = -1;
      const syncFrame = () => {
        frame = 0;
        if (disposed || document.hidden) return;
        onTimeChange?.(target);
        if (disposed || document.hidden || video.error) return;
        if (video.readyState < 2 || !Number.isFinite(video.duration)) return;
        const delta = Math.abs(video.currentTime - target);
        if (
          !video.seeking &&
          delta >= VIDEO_FRAME_STEP &&
          target !== lastSeek
        ) {
          video.currentTime = target;
          lastSeek = target;
        }
        if (
          Math.abs(video.currentTime - target) >= VIDEO_FRAME_STEP ||
          video.seeking
        )
          frame = requestAnimationFrame(syncFrame);
      };
      const queue = () => {
        if (!frame && !document.hidden)
          frame = requestAnimationFrame(syncFrame);
      };
      const resume = () => {
        if (!document.hidden) queue();
      };
      document.addEventListener("visibilitychange", resume);
      video.pause();
      if (media.matches) {
        target = Math.min(duration - 0.045, duration * 0.65);
        onTimeChange?.(target);
        if (video.readyState >= 2 && Number.isFinite(video.duration))
          video.currentTime = target;
        return () => document.removeEventListener("visibilitychange", resume);
      }
      const tween = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          target = videoTimeAt(playhead.progress, duration, window.innerHeight);
          queue();
        },
        scrollTrigger: {
          id: "long-realty-hero",
          trigger: section,
          start: "top top",
          end: () => `+=${videoDistances(duration, window.innerHeight).total}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: () => {
            target = videoTimeAt(
              playhead.progress,
              duration,
              window.innerHeight,
            );
            queue();
          },
        },
      });
      gsap.to(".hero-scene-copy", {
        opacity: 0,
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${videoDistances(duration, window.innerHeight).playback}`,
          scrub: 0.65,
        },
      });
      gsap
        .timeline({
          scrollTrigger: {
            id: "hero-description-transition",
            trigger: section,
            start: () =>
              `top+=${videoDistances(duration, window.innerHeight).playback} top`,
            end: () =>
              `top+=${videoDistances(duration, window.innerHeight).total} top`,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          ".hero-transition-panel",
          { scaleX: 0.07, scaleY: 0 },
          { scaleX: 0.07, scaleY: 1, duration: 0.45, ease: "none" },
          0,
        )
        .to(
          ".hero-transition-panel",
          { scaleX: 1, duration: 0.6, ease: "none" },
          0.4,
        );
      const refresh = () => {
        if (!disposed) ScrollTrigger.refresh();
      };
      if (document.fonts?.ready) document.fonts.ready.then(refresh);
      refreshFrame = requestAnimationFrame(refresh);
      return () => {
        tween.kill();
        document.removeEventListener("visibilitychange", resume);
      };
    }, section);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [
    sectionRef,
    videoRef,
    ready,
    metadataReady,
    motionReduced,
    duration,
    onTimeChange,
  ]);
}
