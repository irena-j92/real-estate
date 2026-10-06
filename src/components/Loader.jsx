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
        ).padStart(3, "0");
        gsap.set("[data-loader-line]", { scaleX: progress.value / 100 });
      };
      if (reduced) {
        gsap.to(scope, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => complete.current?.(),
        });
        return;
      }
      gsap.set(".loader-word", { yPercent: 110, rotate: 3 });
      gsap.set(".loader-meta", { opacity: 0 });
      const opening = gsap.timeline({ defaults: { ease: "power3.out" } });
      opening
        .to(
          ".loader-word",
          { yPercent: 0, rotate: 0, stagger: 0.12, duration: 0.8 },
          0,
        )
        .to(".loader-meta", { opacity: 1, stagger: 0.08, duration: 0.4 }, 0.15)
        .to(
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
          .to(
            ".loader-word",
            { yPercent: -115, rotate: -3, stagger: 0.06, duration: 0.5 },
            0.2,
          )
          .to(".loader-meta", { opacity: 0, duration: 0.25 }, 0.2)
          .to(
            ".loader-shutter",
            { yPercent: -105, stagger: 0.065, duration: 0.7 },
            0.4,
          )
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
      <div className="loader-shutters">
        <div className="loader-shutter" />
        <div className="loader-shutter" />
        <div className="loader-shutter" />
      </div>
      <div className="loader-top loader-meta">
        <span>LONG REALTY</span>
        <span>Southern Arizona / A new perspective</span>
      </div>
      <div className="loader-type">
        <span className="loader-mask">
          <span className="loader-word">A new</span>
        </span>
        <span className="loader-mask">
          <em className="loader-word">perspective.</em>
        </span>
      </div>
      <div className="loader-bottom">
        <div className="loader-meta">
          <span>Opening a world of possibility</span>
          <span className="loader-count">
            <span data-loader-count>000</span>
            <small> / 100</small>
          </span>
        </div>
        <div className="loader-track">
          <span data-loader-line />
        </div>
      </div>
    </div>
  );
}
