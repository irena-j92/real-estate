import { useEffect } from "react";
import gsap from "gsap";

/**
 * Applies a subtle magnetic pull to any element with [data-magnetic="true"]
 * inside the given container ref. Respects prefers-reduced-motion.
 */
export default function useMagnetic(containerRef) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = containerRef?.current || document;
    const els = root.querySelectorAll('[data-magnetic="true"]');

    const cleanups = [];

    els.forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const handleMove = (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.12);
        yTo(relY * 0.12);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);

      cleanups.push(() => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerRef]);
}
