import HoverControl from "./ui/HoverControl";
import { useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const statement =
  "A home is more than architecture. It’s the light in the morning. The space to gather. A landscape that becomes part of you. We bring a local perspective to the places you’ll call home.";
const phrases = [
  ["A home is more than ", false], ["architecture.", true],
  [" It’s the light in the morning. The space to gather. ", false],
  ["A landscape that becomes part of you.", true],
  [" We bring a ", false], ["local perspective", true],
  [" to the places you’ll call home.", false],
];
const words = phrases.flatMap(([text, italic]) =>
  text.trim().split(/\s+/).map((word) => ({ word, italic })),
);
export default function AboutSection({ ready = true, companyPage = false }) {
  const root = useRef(null);
  useEffect(() => {
    if (!ready) return;
    const media = gsap.matchMedia();
    media.add(
      {
        animated: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const words = root.current.querySelectorAll(".description-word-fill");
        if (context.conditions.reduced) {
          gsap.set(words, { clipPath: "inset(0 0% 0 0)" });
          return;
        }
        gsap.fromTo(
          words,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            stagger: 0.1,
            duration: 0.3,
            ease: "none",
            scrollTrigger: {
              id: "description-text-fill",
              trigger: root.current,
              start: "top 55%",
              end: "bottom 65%",
              scrub: 0.5,
            },
          },
        );
      },
      root,
    );
    return () => media.revert();
  }, [ready]);
  return (
    <section ref={root} id="about" className="intro-section scroll-description">
      <div className="description-inner">
        <p className="section-kicker" data-reveal>
          01 / A sense of place
        </p>
        <h2 data-reveal className="description-statement" aria-label={statement}>
          {words.map(({ word, italic }, i) => (
            <span key={i} className={`description-word ${italic ? "description-serif" : ""}`} aria-hidden="true">
              {word}
              <span className="description-word-fill">{word}</span>
            </span>
          ))}
        </h2>
        <HoverControl as="a"
          className="text-link description-experts"
          href={companyPage ? "/#experts" : "/our-perspective"}
          data-reveal
        >
          {companyPage ? "Meet our experts" : "About Us"} <FiArrowRight aria-hidden="true" />
        </HoverControl>
      </div>
    </section>
  );
}
