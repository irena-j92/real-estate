import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function villaScrollDistances(height) { return { playback: height * 2.5, total: height * 4.5 }; }
export default function useVillaScroll(sectionRef, ready, loaded, onProgress) {
  useLayoutEffect(() => {
    if (!ready || !loaded || !sectionRef.current) return;
    const media = gsap.matchMedia();
    media.add({ animated: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      if (context.conditions.reduced) { onProgress(0); return; }
      const root = sectionRef.current, playhead = { value: 0 };
      const timeline = gsap.to(playhead, { value: 1, ease: "none", onUpdate: () => onProgress(Math.min(1, playhead.value * 4.5 / 2.5)), scrollTrigger: {
        id: "long-realty-hero", refreshPriority: 10, trigger: root, start: "top top", end: () => `+=${villaScrollDistances(window.innerHeight).total}`, pin: true, pinSpacing: true, scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true,
      } });
      gsap.to(root.querySelector('.hero-scene-copy'), { opacity: 0, y: -35, ease: "none", scrollTrigger: { refreshPriority: 9, trigger: root, start: "top top", end: () => `+=${villaScrollDistances(window.innerHeight).playback}`, scrub: 0.65, invalidateOnRefresh: true } });
      gsap.timeline({ scrollTrigger: { id: "hero-description-transition", refreshPriority: 9, trigger: root, start: () => `top+=${villaScrollDistances(window.innerHeight).playback} top`, end: () => `top+=${villaScrollDistances(window.innerHeight).total} top`, scrub: 0.65, invalidateOnRefresh: true } })
        .fromTo(root.querySelector('.hero-transition-panel'), { scaleX: 0.07, scaleY: 0 }, { scaleX: 0.07, scaleY: 1, duration: 0.45, ease: "none" }, 0)
        .to(root.querySelector('.hero-transition-panel'), { scaleX: 1, duration: 0.6, ease: "none" }, 0.4);
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { cancelAnimationFrame(frame); timeline.kill(); };
    }, sectionRef);
    return () => media.revert();
  }, [sectionRef, ready, loaded, onProgress]);
}
