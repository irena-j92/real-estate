import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Branded opening sequence. The percentage measures the sequence, not bytes. */
export default function Loader({ onComplete }) {
  const root = useRef(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  useEffect(() => {
    const scope = root.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let alive = true;
    let timeout;
    let finish;
    const controller = new AbortController();
    const context = gsap.context(() => {
      const progress = { value: 0 };
      const update = () => {
        scope.querySelector("[data-loader-count]").textContent = String(
          Math.round(progress.value),
        ).padStart(2, "0");
      };
      if (reduced) {
        progress.value = 100;
        update();
        gsap.to(scope, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => complete.current?.(),
        });
        return;
      }
      const opening = gsap.timeline({ defaults: { ease: "power3.out" } });
      opening.to(
        progress,
        { value: 94, duration: 1.3, ease: "power2.inOut", onUpdate: update },
        0.1,
      );
      const leave = () => {
        if (!alive || finish) return;
        clearTimeout(timeout);
        finish = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            if (alive) complete.current?.();
          },
        });
        finish
          .to(progress, { value: 100, duration: 0.22, onUpdate: update })
          .to(scope, { opacity: 0, duration: 0.5 }, "+=0.18")
          .set(scope, { visibility: "hidden" });
      };
      opening.eventCallback("onComplete", () => {
        const video = document.querySelector("[data-hero-video]");
        if (!video || video.readyState >= 2 || video.error) leave();
        else {
          video.addEventListener("loadeddata", leave, {
            once: true,
            signal: controller.signal,
          });
          video.addEventListener("error", leave, {
            once: true,
            signal: controller.signal,
          });
          timeout = setTimeout(leave, 400);
        }
      });
    }, root);
    return () => {
      alive = false;
      clearTimeout(timeout);
      controller.abort();
      context.revert();
      finish?.kill();
    };
  }, []);
  return (
    <div ref={root} className="opening-loader" aria-hidden="true">
      <div className="loader-lockup">
        <img
          className="loader-logo"
          src="/assets/sun-logo.svg"
          alt=""
          width="105.5"
          height="105.125"
        />
        <div className="loader-rule" />
        <span className="loader-counter" data-loader-count>
          00
        </span>
      </div>
    </div>
  );
}
