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
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
    );
    const seen = new WeakSet();
    const context = gsap.context(() => {
      const register = () => {
        root.querySelectorAll("[data-reveal]").forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          if (!reduced.matches) {
            el.classList.add("is-reveal");
            reveal.observe(el);
          }
        });
        root.querySelectorAll('[data-magnetic="true"]').forEach((el) => {
          if (el.dataset.magnetReady || reduced.matches || !fine.matches)
            return;
          el.dataset.magnetReady = "true";
          const x = gsap.quickTo(el, "x", {
              duration: 0.45,
              ease: "power3.out",
            }),
            y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
          const move = (e) => {
            const b = el.getBoundingClientRect();
            x((e.clientX - b.left - b.width / 2) * 0.1);
            y((e.clientY - b.top - b.height / 2) * 0.1);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            delete el.dataset.magnetReady;
            gsap.killTweensOf(el);
          });
        });
      };
      register();
      const observer = new MutationObserver(register);
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
    const enableReduced = () => {
      if (reduced.matches)
        root
          .querySelectorAll(".is-reveal")
          .forEach((el) => el.classList.add("is-visible"));
    };
    reduced.addEventListener("change", enableReduced);
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
      reduced.removeEventListener("change", enableReduced);
      images.forEach((img) => img.removeEventListener("load", refresh));
      root
        .querySelectorAll(".is-reveal")
        .forEach((el) => el.classList.remove("is-reveal", "is-visible"));
    };
  }, [rootRef, ready, motionReduced]);
}
