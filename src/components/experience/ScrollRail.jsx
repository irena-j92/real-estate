import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const homeChapters = ["top", "about", "trending", "services", "experts", "offer", "history", "journal", "contact"];

export default function ScrollRail({ ready, perspective = false }) {
  const chapters = perspective ? ["perspective-top", "about", "our-values", "our-approach"] : homeChapters;
  const [chapter, setChapter] = useState(0);
  const fill = useRef(null);
  const marker = useRef(null);
  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    let starts = [];
    let distance = 1;
    let measureNeeded = true;
    let trackHeight = 1;
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
      trackHeight = fill.current?.parentElement.clientHeight || 1;
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
      const progress = Math.max(0, Math.min(1, window.scrollY / distance));
      if (fill.current) fill.current.style.transform = `scaleY(${progress})`;
      if (marker.current) marker.current.style.transform = `translate3d(0,${progress * trackHeight}px,0)`;
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
  }, [ready, perspective]);
  if (!ready) return null;
  return (
    <aside className={`scroll-rail ${perspective || chapter === 3 || chapter === 6 || chapter === 7 ? "on-light" : ""}`} data-chapter={chapter} aria-hidden="true">
      <span className="scroll-rail-count">{String(chapter).padStart(2, "0")}</span>
      <span className="scroll-rail-track"><span ref={fill} /><span ref={marker} className="scroll-rail-marker" /></span>
      <span className="scroll-rail-label">Scroll</span>
      <svg className="scroll-rail-arrow" viewBox="0 0 14 76" fill="none">
        <path d="M7 1V73M1 66L7 73L13 66" stroke="currentColor" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" />
      </svg>
    </aside>
  );
}
