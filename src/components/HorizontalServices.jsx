import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    number: "01",
    word: "Search",
    copy: "Browse curated Southern Arizona listings with the filters that actually matter — elevation, view corridor, lot orientation.",
  },
  {
    number: "02",
    word: "Buy",
    copy: "Tour, offer, and close with an agent who knows every foothill and floodplain in the market.",
  },
  {
    number: "03",
    word: "Sell",
    copy: "Pricing strategy, staging, and a marketing plan built for your property's actual buyer pool.",
  },
];

export default function HorizontalServices() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const scrollDistance = track.scrollWidth - window.innerWidth + 160;

        const tween = gsap.to(track, {
          x: () => -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.scrollTrigger?.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-dark py-[80px] text-white md:py-0"
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-16 px-6 md:h-screen md:flex-row md:items-center md:gap-32 md:px-20"
      >
        {ITEMS.map((item) => (
          <article
            key={item.word}
            className="flex flex-shrink-0 flex-col gap-6 md:w-[560px]"
          >
            <div className="flex items-center gap-6">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-white/30 text-sm text-white/70">
                {item.number}
              </span>
              <span className="h-px flex-1 bg-white/20" />
            </div>
            <h3 className="font-accent-italic text-[80px] leading-none md:text-[150px]">
              {item.word}
            </h3>
            <p className="max-w-[420px] text-lg leading-relaxed text-white/60">
              {item.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
