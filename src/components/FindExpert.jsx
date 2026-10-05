import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from "react-icons/fi";
import { agents } from "../data/agents";
import { partners } from "../data/partners";
import Button from "./ui/Button";
import Container from "./ui/Container";

const CAREER_IMAGE =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80";

function OrbitStack({ agents: list, index, setIndex }) {
  const n = list.length;
  const half = Math.floor(n / 2);

  const styleForOffset = (offset) => {
    const abs = Math.abs(offset);
    const dir = Math.sign(offset);
    return {
      transform: `translateX(${dir * abs * 130}px) scale(${1 - abs * 0.14}) rotate(${-dir * abs * -6}deg)`,
      zIndex: 20 - abs,
      // opacity: abs > 2 ? 0 : 1 - abs * 0.22,
    };
  };

  return (
    <div className="relative mx-auto flex h-[380px] w-full max-w-2xl items-center justify-center md:h-[440px]">
      {list.map((agent, i) => {
        let offset = i - index;
        if (offset > half) offset -= n;
        if (offset < -half) offset += n;
        const isActive = offset === 0;

        return (
          <button
            key={agent.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${agent.name}`}
            aria-current={isActive}
            style={styleForOffset(offset)}
            className="absolute h-[340px] w-[240px] overflow-hidden border-radius rounded-lg bg-secondary shadow-xl transition-all duration-500 ease-cinematic md:h-[400px] md:w-[280px]"
          >
            <img
              src={agent.image}
              alt={agent.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {isActive && (
              <div className="absolute inset-0 bg-black/25">
          <div className="absolute bottom-0 left-0 w-full px-5 py-4 text-left text-white">
                <p className="text-lg font-semibold text-yellow">{agent.name}</p>
                <p className="text-xs uppercase tracking-wider text-white/70">
                  {agent.title}
                </p>
              </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function FindExpert() {
  const [index, setIndex] = useState(0);

  const goTo = (dir) =>
    setIndex((i) => (i + dir + agents.length) % agents.length);

  return (
    <section id="experts" className="bg-light py-[60px] md:py-[60px]">
      <Container className="px-6 md:px-20">
        <h2 className="text-center font-accent-light uppercase text-[60px] md:text-[80px]">
          Find an Expert
        </h2>

        <div className="mt-16">
          <OrbitStack agents={agents} index={index} setIndex={setIndex} />
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="dark" icon={<FiArrowUpRight />}>
            View All Agents
          </Button>
        </div>

        <div className="no-scrollbar mt-24 overflow-hidden">
          <div className="marquee-track items-center gap-16 grayscale">
            {[...partners, ...partners].map((partner, i) => (
              <span
                key={`${partner}-${i}`}
                className="whitespace-nowrap text-2xl font-light uppercase tracking-wide text-dark/40"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        <div
          data-reveal
          className="mt-20 grid gap-8 border border-dark/10 bg-white p-8 md:grid-cols-[280px_1fr] md:items-center md:p-10"
        >
          <img
            src={CAREER_IMAGE}
            alt="Long Realty agents collaborating in the office"
            className="h-[180px] w-full object-cover md:h-[220px]"
            loading="lazy"
          />
          <div>
            <p className="text-sm leading-relaxed text-dark/70">
              Give yourself—and your clients—the advantages of a leading real
              estate company. Long Realty provides the tools, support and
              guidance to succeed while cultivating a culture of top agents
              working together. Let's talk about you becoming part of this
              dynamic team today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="yellow" className="text-xs">
                Join Our Team
              </Button>
              <Button variant="outline-dark" className="text-xs">
                Explore Careers
              </Button>
              <Button variant="outline-dark" className="text-xs">
                Contact Recruiting
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
