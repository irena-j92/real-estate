import HoverControl from "./ui/HoverControl";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const statement =
  "A home is more than architecture. It’s the light in the morning. The space to gather. A landscape that becomes part of you. We bring a local perspective to the places you’ll call home.";
export default function AboutSection({ ready = true }) {
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
        <h2 className="description-statement" aria-label={statement}>
          {statement.split(" ").map((word, i) => (
            <span key={i} className="description-word" aria-hidden="true">
              {word}
              <span className="description-word-fill">{word}</span>
            </span>
          ))}
        </h2>
        <HoverControl as="a"
          className="text-link description-experts"
          href="#experts"
          data-reveal
        >
          Meet your local perspective
        </HoverControl>
      </div>
    </section>
  );
}
