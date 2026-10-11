import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function CustomCursor() {
  const ring = useRef(null),
    dot = useRef(null),
    label = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)"),
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const circle = ring.current,
      point = dot.current;
    const x = gsap.quickTo(circle, "x", { duration: 0.4, ease: "power3.out" }),
      y = gsap.quickTo(circle, "y", { duration: 0.4, ease: "power3.out" });
    const move = (e) => {
      if (!fine.matches || reduced.matches) return;
      document.body.dataset.cursorReady = "true";
      point.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      x(e.clientX);
      y(e.clientY);
      circle.style.opacity = circle.dataset.active === "true" ? "1" : "0";
      point.style.opacity = circle.dataset.active === "true" ? "0" : "1";
    };
    const over = (e) => {
      const target = e.target.closest("[data-cursor],a,button,input,textarea,select");
      const text = target?.dataset.cursor || "";
      circle.dataset.active = target ? "true" : "false";
      circle.dataset.label = text ? "true" : "false";
      label.current.textContent = text;
      point.style.opacity = target ? "0" : "1";
      circle.style.opacity = target ? "1" : "0";
    };
    const leave = () => {
      circle.style.opacity = "0";
      point.style.opacity = "0";
      delete document.body.dataset.cursorReady;
    };
    const changed = () => {
      if (!fine.matches || reduced.matches) leave();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    fine.addEventListener("change", changed);
    reduced.addEventListener("change", changed);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      fine.removeEventListener("change", changed);
      reduced.removeEventListener("change", changed);
      leave();
      gsap.killTweensOf(circle);
    };
  }, []);
  return (
    <div aria-hidden="true" className="custom-cursor">
      <div ref={ring} className="cursor-ring">
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
