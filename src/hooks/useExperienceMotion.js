import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function useExperienceMotion(rootRef, ready) {
  const [motionReduced, setMotionReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current,
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)"),
      fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cleanups = [];
    let context;
    const reveal = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
      if (!visible.length) return;
      visible.forEach(el => reveal.unobserve(el));
      context.add(() => {
        gsap.to(visible, {
          opacity: 1, y: 0, duration: 0.72,
          stagger: { each: 0.08, amount: Math.min(0.24, (visible.length - 1) * 0.08) },
          ease: "power3.out", overwrite: "auto",
          onComplete: () => gsap.set(visible, { clearProps: "opacity,transform" }),
        });
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    const seen = new WeakSet();
    // Delegate to the root: drawers and changing controls work immediately,
    // without retaining listeners for controls that have already unmounted.
    const roll = (event, entered) => {
      if (reduced.matches || !fine.matches) return;
      const control = event.target.closest?.("a, button");
      if (!control || !root.contains(control) || control.disabled || control.hasAttribute("data-no-hover") ||
          (event.relatedTarget instanceof window.Node && control.contains(event.relatedTarget))) return;
      const faces = [...control.querySelectorAll(".hover-roll-track")];
      if (!faces.length) return;
      gsap.to(faces, {
        yPercent: entered ? -100 : 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const enter = (event) => roll(event, true), leave = (event) => roll(event, false);
    root.addEventListener("pointerover", enter);
    root.addEventListener("pointerout", leave);
    cleanups.push(() => {
      root.removeEventListener("pointerover", enter);
      root.removeEventListener("pointerout", leave);
      const faces = [...root.querySelectorAll(".hover-roll-track")];
      if (faces.length) {
        gsap.killTweensOf(faces);
        gsap.set(faces, { yPercent: 0 });
      }
    });
    context = gsap.context(() => {
      const register = () => {
        root.querySelectorAll("[data-reveal]").forEach((el) => {
          // Pinned service choreography owns its transforms. Never reveal a
          // nested target twice, or move a whole section containing a pin.
          if (seen.has(el) || el.closest("#services, .horizontal-services") ||
              el.parentElement.closest("[data-reveal]")) return;
          seen.add(el);
          if (!reduced.matches) {
            gsap.set(el, { opacity: 0, y: 24 });
            reveal.observe(el);
          }
        });

      };
      register();
      const observer = new MutationObserver(() => context.add(register));
      observer.observe(root, { childList: true, subtree: true });
      cleanups.push(() => observer.disconnect());
      if (!reduced.matches && window.innerWidth > 767) {
        root.querySelectorAll("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });
      }
    }, root);
    let refreshFrame = 0;
    const images = [...root.querySelectorAll("img")];
    const refresh = () => {
      if (!refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
    };
    images.forEach((img) =>
      img.addEventListener("load", refresh, { once: true }),
    );
    return () => {
      cancelAnimationFrame(refreshFrame);
      reveal.disconnect();
      cleanups.forEach((fn) => fn());
      context.revert();
      images.forEach((img) => img.removeEventListener("load", refresh));
    };
  }, [rootRef, ready, motionReduced]);
}
