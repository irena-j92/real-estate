import HoverControl from "./ui/HoverControl";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { agents } from "../data/agents";
import Button from "./ui/Button";
const specialties = [
  "Distinctive architecture & luxury homes",
  "City living & first homes",
  "Neighborhoods & family living",
  "Relocation & new beginnings",
  "Seller representation & estates",
];

const firstExpert = Math.max(
  0,
  agents.findIndex((agent) => agent.id === "helena-marsh"),
);

function OrbitStack({ index, setIndex }) {
  return (
    <div className="expert-stage" data-reveal aria-label="Choose your adviser">
      {agents.map((agent, i) => {
        let offset = i - index;
        if (offset > 2) offset -= agents.length;
        if (offset < -2) offset += agents.length;
        const active = offset === 0;
        return (
          <HoverControl as="button"
            key={agent.id}
            onClick={() => setIndex(i)}
            type="button"
            className="expert-portrait-card"
            aria-label={`Select ${agent.name}`}
            aria-pressed={active}
            style={{
              transform: `translateX(calc(${offset} * var(--expert-card-step))) translateY(${Math.abs(offset) * 13}px) rotate(${offset * 7}deg) scale(${1 - Math.abs(offset) * 0.09})`,
              zIndex: 10 - Math.abs(offset),
              filter: active ? "none" : "brightness(.62)",
              opacity: Math.abs(offset) > 1 ? 0.5 : 1,
            }}
          >
            <div className="motion-image expert-motion-image">
              <div className="motion-image-drift" data-image-drift>
                <div
                  className="expert-portrait"
                  role="img"
                  aria-label={`Illustrative portrait of ${agent.name}`}
                  style={{ backgroundPosition: `${i * 25}% 15%` }}
                />
              </div>
            </div>
          </HoverControl>
        );
      })}
    </div>
  );
}

export default function FindExpert() {
  const [index, setIndex] = useState(firstExpert);
  const agent = agents[index];
  const goTo = (dir) =>
    setIndex((i) => (i + dir + agents.length) % agents.length);
  const connect = () => {
    window.dispatchEvent(
      new CustomEvent("realty-inquiry", {
        detail: `I'd like to connect with ${agent.name} about my next move.`,
      }),
    );
    document.getElementById("contact")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <section id="experts" className="premium-section experts-section">
      <div className="site-container">
        <div className="experts-layout">
          <div data-reveal-group className="expert-intro">
            <p className="section-kicker" data-reveal>04 / The human connection</p>
            <h2 className="expert-headline" data-reveal>FIND AN EXPERT</h2>
            <p className="body-copy expert-description" data-reveal>
              The best advice comes from someone who knows the streets, the
              stories, and what makes a place feel like home. Find the person
              who sees your vision.
            </p>
            <Button data-reveal className="mt-7" variant="yellow" onClick={connect}>
              Let’s connect
            </Button>
            <div className="expert-career" data-reveal>
              <HoverControl as="a"
                className="text-link career-link"
                href="#contact"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("realty-inquiry", {
                      detail:
                        "I'd like to learn more about joining the Sunter Realty team.",
                    }),
                  )
                }
              >
                Explore a career with Sunter Realty
              </HoverControl>
            </div>
          </div>
          <div data-reveal-group className="expert-gallery">
            <OrbitStack index={index} setIndex={setIndex} />
            <div className="expert-selection" data-reveal>
              <HoverControl as="button"
                type="button"
                className="icon-button"
                aria-label="Previous adviser"
                onClick={() => goTo(-1)}
              >
                <FiChevronLeft />
              </HoverControl>
              <div className="expert-current" aria-live="polite">
                <strong>{agent.name}</strong>
                <p>{specialties[index]}</p>
              </div>
              <HoverControl as="button"
                type="button"
                className="icon-button"
                aria-label="Next adviser"
                onClick={() => goTo(1)}
              >
                <FiChevronRight />
              </HoverControl>
            </div>
            <p className="expert-count" data-reveal>
              0{((index - firstExpert + agents.length) % agents.length) + 1}{" "}
              <span className="mx-3">/</span> 0{agents.length}
            </p>
          </div>
        </div>
        <div className="partner-band" data-reveal>
          <ul
            className="partner-placeholder-logos"
            aria-label="Placeholder partner logos"
          >
            {[
              { name: "NORTH", mark: "M6 31L20 7L34 31M12 23H28" },
              {
                name: "arc",
                mark: "M8 32V20C8 4 32 4 32 20V32M14 32V20C14 12 26 12 26 20V32",
              },
              {
                name: "HOME & CO.",
                mark: "M6 20L20 7L34 20M10 17V33H30V17M17 33V24H23V33",
              },
              {
                name: "SOLSTICE",
                mark: "M20 2V8M20 32V38M2 20H8M32 20H38M7 7L11 11M29 29L33 33M7 33L11 29M29 11L33 7M20 12A8 8 0 1 0 20 28A8 8 0 1 0 20 12",
              },
              {
                name: "field",
                mark: "M7 8V32M14 8V32M21 8V32M28 8V32M35 8V32",
              },
            ].map(({ name, mark }) => (
              <li key={name} aria-label={`Placeholder logo: ${name}`}>
                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <path d={mark} stroke="currentColor" strokeWidth="1.25" />
                </svg>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
