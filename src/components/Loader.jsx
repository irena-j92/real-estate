import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const wrapRef = useRef(null);
  const lineRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    });

    tl.to(counter, {
      value: 100,
      duration: reduced ? 0.01 : 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        if (pctRef.current) {
          pctRef.current.textContent = String(Math.floor(counter.value));
        }
        if (lineRef.current) {
          lineRef.current.style.transform = `scaleX(${counter.value / 100})`;
        }
      },
    }).to(wrapRef.current, {
      yPercent: reduced ? 0 : -100,
      opacity: reduced ? 0 : 1,
      duration: reduced ? 0.01 : 0.7,
      ease: "power4.inOut",
      delay: 0.15,
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark"
      aria-hidden="true"
    >
      <div className="flex items-baseline gap-1 text-white">
        <span ref={pctRef} className="text-5xl font-light tabular-nums">
          0
        </span>
        <span className="text-2xl font-light">%</span>
      </div>
      <div className="mt-8 h-[1px] w-[220px] overflow-hidden bg-white/15">
        <div
          ref={lineRef}
          className="h-full w-full origin-left bg-yellow"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">
        Long Realty
      </p>
    </div>
  );
}
