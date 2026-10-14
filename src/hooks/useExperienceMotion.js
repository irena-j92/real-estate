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
    const groups = new Map();
    const finalOpacity = new WeakMap();
    const play = (targets) => {
      if (!targets.length) return;
      // Keep the fade independent of the overshoot: the text stays translucent
      // during its rise instead of snapping to full opacity halfway through.
      gsap.timeline({ onComplete: () => gsap.set(targets, { clearProps: "opacity,transform" }) })
        .to(targets, { y: -8, duration: 0.72, stagger: 0.16, ease: "power2.inOut", overwrite: "auto" }, 0)
        .to(targets, { y: 0, duration: 0.28, stagger: 0.16, ease: "power2.out", overwrite: "auto" }, 0.72)
        .to(targets, { opacity: (_, el) => finalOpacity.get(el) ?? 1, duration: 0.9, stagger: 0.16, ease: "power1.out", overwrite: "auto" }, 0);
    };
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = groups.get(entry.target);
        if (!group) return;
        group.played = true;
        reveal.unobserve(entry.target);
        context.add(() => play([...group.targets].filter(el => root.contains(el))));
      });
    }, { threshold: 0.01, rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.18)}px 0px` });
    const seen = new WeakSet();
    const imageDrifts = new Map();
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
        groups.forEach((group, anchor) => {
          group.targets.forEach(el => {
            if (!root.contains(el)) { gsap.killTweensOf(el); group.targets.delete(el); }
          });
          if (!root.contains(anchor)) { reveal.unobserve(anchor); groups.delete(anchor); }
        });
        const immediate = new Map();
        root.querySelectorAll("[data-reveal]").forEach(el => {
          if (seen.has(el) || el.closest("#services, .horizontal-services") ||
              el.parentElement.closest("[data-reveal]")) return;
          seen.add(el);
          if (reduced.matches) return;
          // Observe a stationary wrapper. Observing the translated element
          // consumes most of its entrance below the viewport before triggering.
          const anchor = el.closest("[data-reveal-group]") || el.parentElement;
          let group = groups.get(anchor);
          if (!group) { group = { targets: new Set(), played: false }; groups.set(anchor, group); }
          finalOpacity.set(el, Number(gsap.getProperty(el, "opacity")) || 1);
          group.targets.add(el);
          gsap.set(el, { opacity: 0, y: 110 });
          if (group.played) {
            const bounds = anchor.getBoundingClientRect();
            if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
              const targets = immediate.get(anchor) || [];
              targets.push(el);
              immediate.set(anchor, targets);
            } else { group.played = false; reveal.observe(anchor); }
          } else reveal.observe(anchor);
        });
        immediate.forEach(play);

        // Register newly mounted property views, and release their old triggers
        // when the carousel or grid removes them.
        imageDrifts.forEach((tween, el) => {
          if (!root.contains(el)) {
            tween.scrollTrigger?.kill();
            tween.kill();
            imageDrifts.delete(el);
          }
        });
        if (!reduced.matches && window.innerWidth > 767) {
          root.querySelectorAll("[data-image-drift]").forEach(el => {
            if (imageDrifts.has(el) || el.closest("#services")) return;
            const tween = gsap.fromTo(el, { yPercent: 8 }, {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section") || el.parentElement,
                start: "top bottom", end: "bottom top", scrub: 0.65,
                refreshPriority: -20, invalidateOnRefresh: true,
              },
            });
            imageDrifts.set(el, tween);
          });
        }

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
      imageDrifts.clear();
      groups.clear();
      context.revert();
      images.forEach((img) => img.removeEventListener("load", refresh));
    };
  }, [rootRef, ready, motionReduced]);
}
