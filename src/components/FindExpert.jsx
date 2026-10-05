import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { agents } from "../data/agents";
import Button from "./ui/Button";
const specialties = [
  "Catalina Foothills & luxury homes",
  "Central Tucson & first homes",
  "Oro Valley & family living",
  "Relocation & desert communities",
  "Seller representation & estates",
];

function OrbitStack({ index, setIndex }) {
  return (
    <div className="expert-stage" aria-label="Choose your adviser">
      {agents.map((agent, i) => {
        let offset = i - index;
        if (offset > 2) offset -= agents.length;
        if (offset < -2) offset += agents.length;
        const active = offset === 0;
        return (
          <button
            key={agent.id}
            onClick={() => setIndex(i)}
            type="button"
            className="expert-portrait-card"
            aria-label={`Select ${agent.name}`}
            aria-pressed={active}
            style={{
              transform: `translateX(${offset * 91}px) translateY(${Math.abs(offset) * 13}px) rotate(${offset * 7}deg) scale(${1 - Math.abs(offset) * 0.09})`,
              zIndex: 10 - Math.abs(offset),
              filter: active ? "none" : "brightness(.62)",
              opacity: Math.abs(offset) > 1 ? 0.5 : 1,
            }}
          >
            <div
              className="expert-portrait"
              role="img"
              aria-label={`Illustrative portrait of ${agent.name}`}
              style={{ backgroundPosition: `${i * 25}% 15%` }}
            />
            {active && (
              <span className="expert-card-name">
                {agent.name}
                <small>YOUR LOCAL PERSPECTIVE</small>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function FindExpert() {
  const [index, setIndex] = useState(0);
  const agent = agents[index];
  const goTo = (dir) =>
    setIndex((i) => (i + dir + agents.length) % agents.length);
  const connect = () => {
    window.dispatchEvent(
      new CustomEvent("realty-inquiry", {
        detail: `I'd like to connect with ${agent.name} about my next move.`,
      }),
    );
    document
      .getElementById("contact")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <section id="experts" className="premium-section experts-section">
      <div className="site-container">
        <div className="experts-layout">
          <div data-reveal>
            <p className="section-kicker">04 / Your people, your place</p>
            <h2 className="section-title">
              Local knowledge.
              <br />
              <em>Human connection.</em>
            </h2>
            <p className="body-copy expert-description">
              The best advice comes from someone who knows the streets, the
              stories, and what makes a place feel like home. Find the person
              who sees your vision.
            </p>
            <div className="expert-selection">
              <button
                type="button"
                className="icon-button"
                aria-label="Previous adviser"
                onClick={() => goTo(-1)}
              >
                <FiChevronLeft />
              </button>
              <div className="expert-current" aria-live="polite">
                <strong>{agent.name}</strong>
                <p>{specialties[index]}</p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Next adviser"
                onClick={() => goTo(1)}
              >
                <FiChevronRight />
              </button>
            </div>
            <Button className="mt-7" variant="yellow" onClick={connect}>
              Let’s connect
            </Button>
          </div>
          <div data-reveal>
            <OrbitStack index={index} setIndex={setIndex} />
            <p className="expert-count">
              0{index + 1} <span className="mx-3">/</span> 0{agents.length}
            </p>
          </div>
        </div>
        <div className="partner-band" data-reveal>
          <span>Local roots. Global reach.</span>
          <div className="partner-names">
            <span>HomeServices of America</span>
            <span>LeadingRE</span>
            <span>Long Realty</span>
          </div>
        </div>
        <div className="career-line" data-reveal>
          <p>
            Good people make a great company. Build your next chapter with us.
          </p>
          <a
            className="text-link"
            href="#contact"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("realty-inquiry", {
                  detail:
                    "I'd like to learn more about joining the Long Realty team.",
                }),
              )
            }
          >
            Explore a career with Long Realty
          </a>
        </div>
      </div>
    </section>
  );
}
