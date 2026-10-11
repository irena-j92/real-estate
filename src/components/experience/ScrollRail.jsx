import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const chapters = ["top", "about", "trending", "services", "experts", "offer", "journal", "contact"];

export default function ScrollRail({ ready }) {
  const [chapter, setChapter] = useState(0);
  const fill = useRef(null);
  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    let starts = [];
    let distance = 1;
    let measureNeeded = true;
    const measure = () => {
      starts = chapters.map((id) => {
        const section = document.getElementById(id);
        if (!section) return Infinity;
        // Pinned sections keep their layout position on the outer spacer.
        const anchor = section.parentElement?.classList.contains("pin-spacer")
          ? section.parentElement
          : section;
        return anchor.getBoundingClientRect().top + window.scrollY;
      });
      distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      measureNeeded = false;
    };
    const update = () => {
      frame = 0;
      if (measureNeeded) measure();
      const readingPosition = window.scrollY + window.innerHeight * 0.35;
      let current = 0;
      starts.forEach((start, i) => {
        if (readingPosition >= start) current = i;
      });
      setChapter((previous) => previous === current ? previous : current);
      if (fill.current)
        fill.current.style.transform = `scaleY(${Math.max(0, Math.min(1, window.scrollY / distance))})`;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const refresh = () => {
      measureNeeded = true;
      queue();
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);
    ScrollTrigger.addEventListener("refresh", refresh);
    queue();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refresh", refresh);
    };
  }, [ready]);
  if (!ready) return null;
  return (
    <aside className={`scroll-rail ${chapter === 3 || chapter === 6 ? "on-light" : ""}`} aria-hidden="true">
      <span className="scroll-rail-count">{String(chapter).padStart(2, "0")}</span>
      <span className="scroll-rail-track"><span ref={fill} /></span>
      <span className="scroll-rail-label">Scroll</span>
      <svg className="scroll-rail-arrow" viewBox="0 0 14 76" fill="none">
        <path d="M7 1V73M1 66L7 73L13 66" stroke="currentColor" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" />
      </svg>
    </aside>
  );
}
