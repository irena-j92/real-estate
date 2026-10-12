import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export const milestones = [
  { year: "2008", title: "A more personal beginning", detail: "Sunter begins as an independent property studio with a simple belief: finding a home should start with understanding the person. A small team builds the practice around careful listening and considered advice." },
  { year: "2012", title: "Our circle grows", detail: "Our perspective expands from individual homes to the neighborhoods around them. A network of local advisers brings deeper knowledge of the places, people, and daily rhythms that make a community." },
  { year: "2017", title: "Design becomes part of the conversation", detail: "Architecture, light, and the way a home feels become central to our collection. Editorial photography and thoughtful property storytelling help buyers see beyond a floor plan." },
  { year: "2021", title: "One team, from beginning to belonging", detail: "Buying, selling, and relocation come together under one approach. Clients receive a clear point of contact and guidance that continues through each step of their next chapter." },
  { year: "2024", title: "A collection shaped around you", detail: "Our digital experience brings considered property discovery and personal advice closer together, with curated homes and a clearer way to connect with the right expert." },
  { year: "Present", title: "Still personal. Always looking forward.", detail: "Today, Sunter Realty brings independent thinking, an eye for architecture, and a human approach to every move. Our next chapter follows the same principle as our first: remarkable places, understood through the lives of the people who call them home." },
];
export default function HistorySection() {
  const viewport = useRef(null), progress = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const measure = () => {
    const element = viewport.current;
    if (!element) return;
    const distance = element.scrollWidth - element.clientWidth;
    const ratio = distance > 0 ? Math.max(0, Math.min(1, element.scrollLeft / distance)) : 1;
    setEdges(previous => {
      const next = { start: element.scrollLeft <= 2, end: distance <= 2 || element.scrollLeft >= distance - 2 };
      return previous.start === next.start && previous.end === next.end ? previous : next;
    });
    if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
  };
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const move = direction => {
    const element = viewport.current, card = element.querySelector("article");
    element.scrollTo({ left: element.scrollLeft + direction * (card?.offsetWidth || element.clientWidth), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section className="history-section" id="history" aria-labelledby="history-title">
    <div className="history-shell">
      <div className="history-heading" data-reveal>
        <h2 id="history-title">Our History</h2>
        <div className="history-controls">
          <button type="button" aria-label="Previous history milestone" disabled={edges.start} onClick={() => move(-1)}><FiArrowLeft strokeWidth={1} /></button>
          <button type="button" aria-label="Next history milestone" disabled={edges.end} onClick={() => move(1)}><FiArrowRight strokeWidth={1} /></button>
        </div>
      </div>
      <div ref={viewport} className="history-viewport" onScroll={measure} tabIndex={0} role="region" aria-label="Company milestones, scroll to explore">
        <div className="history-track">
          {milestones.map(milestone => <article className="history-milestone" key={milestone.year}>
            <h3>{milestone.year}</h3>
            <p className="history-milestone-title">{milestone.title}</p>
            <div className="history-ticks" aria-hidden="true" />
            <p className="history-milestone-detail">{milestone.detail}</p>
          </article>)}
        </div>
      </div>
      <div className="history-progress" aria-hidden="true"><span ref={progress} /></div>
      <p className="history-note">Illustrative company history · Sunter Realty portfolio concept</p>
    </div>
  </section>;
}
