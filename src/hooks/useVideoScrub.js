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
      !Number.isFinite(video.duration)
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
        if (disposed || document.hidden || video.error) return;
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
        video.currentTime = Math.min(
          video.duration - 0.045,
          video.duration * 0.65,
        );
        return () => document.removeEventListener("visibilitychange", resume);
      }
      const tween = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          target = videoTimeAt(
            playhead.progress,
            video.duration,
            window.innerHeight,
          );
          queue();
        },
        scrollTrigger: {
          id: "long-realty-hero",
          trigger: section,
          start: "top top",
          end: () =>
            `+=${videoDistances(video.duration, window.innerHeight).total}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: () => {
            target = videoTimeAt(
              playhead.progress,
              video.duration,
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
            `+=${videoDistances(video.duration, window.innerHeight).total * 0.6}`,
          scrub: 0.65,
        },
      });
      gsap.fromTo(
        ".hero-final-caption",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: () =>
              `top+=${videoDistances(video.duration, window.innerHeight).playback * 0.85} top`,
            end: () =>
              `top+=${videoDistances(video.duration, window.innerHeight).playback * 1.05} top`,
            scrub: 0.65,
          },
        },
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
  }, [sectionRef, videoRef, ready, metadataReady, motionReduced]);
}
