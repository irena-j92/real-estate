import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const wrapRef = useRef(null);
  const lineRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    });

    tl.to(counter, {
      value: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (pctRef.current) {
          pctRef.current.textContent = String(Math.floor(counter.value));
        }
        if (lineRef.current) {
          lineRef.current.style.width = `${counter.value}%`;
        }
      },
    }).to(wrapRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      delay: 0.15,
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#141721]"
      aria-hidden="true"
    >
      <div className="flex items-baseline gap-1 text-white">
        <span ref={pctRef} className="text-5xl font-light tabular-nums">
          0
        </span>
        <span className="text-2xl font-light">%</span>
      </div>
      <div className="mt-8 h-[1px] w-[220px] overflow-hidden bg-white/15">
        <div ref={lineRef} className="h-full w-0 bg-white" />
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">
        Long Realty
      </p>
    </div>
  );
}
