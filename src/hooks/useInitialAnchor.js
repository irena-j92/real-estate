import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Cross-page section links wait for the cinematic hero's scroll spacer.
export default function useInitialAnchor(ready, perspective) {
  useEffect(() => {
    if (!ready || perspective || !window.location.hash || window.location.hash === "#top") return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    let frame = 0, done = false;
    const cancel = () => { done = true; cancelAnimationFrame(frame); };
    const align = () => {
      if (done) return;
      if (!ScrollTrigger.getById("long-realty-hero") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 100, behavior: "instant" });
        done = true;
      });
    };
    ScrollTrigger.addEventListener("refresh", align);
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("pointerdown", cancel, { once: true });
    align();
    return () => { cancel(); ScrollTrigger.removeEventListener("refresh", align); window.removeEventListener("wheel", cancel); window.removeEventListener("pointerdown", cancel); };
  }, [ready, perspective]);
}
