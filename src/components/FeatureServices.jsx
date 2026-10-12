import HoverControl from "./ui/HoverControl";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const services = [
  {
    title: "A place that feels like you.",
    short: "Buying",
    description:
      "The morning light. The right neighborhood. A home that makes room for your life. We help you see the possibilities, understand the details, and choose with confidence.",
    image: "/assets/properties-2.jpg",
    alt: "A bright residence framed by desert landscape",
    link: "#trending",
    label: "Explore the residences",
  },
  {
    title: "Your home. Its next chapter.",
    short: "Selling",
    description:
      "Every home has a story. We find yours, shape a thoughtful presentation, and bring it to the people ready to begin their next chapter. Personal guidance, from preparation to closing.",
    image: "/assets/properties-4.jpg",
    alt: "Contemporary architecture with an open outdoor terrace",
    link: "#contact",
    label: "Talk about your next move",
  },
  {
    title: "Arrive. Settle. Belong.",
    short: "Relocating",
    description:
      "A new address is only the beginning. From understanding the communities to connecting the right local services, we make your move to a new community feel a little more familiar.",
    image: "/assets/offerservices-2.jpg",
    alt: "A welcoming interior prepared for a new beginning",
    link: "#offer",
    label: "Discover the support around you",
  },
];
export default function FeatureServices({ ready = true }) {
  const root = useRef(null),
    viewport = useRef(null),
    track = useRef(null),
    scroll = useRef(null);
  const [active, setActive] = useState(0),
    [pinned, setPinned] = useState(false);
  // Chapter positions follow the compact strip rather than viewport-sized slides.
  const chapterOffset = (index) => {
    const panels = track.current?.children;
    if (!panels?.length || !viewport.current) return 0;
    const distance = Math.max(
      0,
      track.current.scrollWidth - viewport.current.clientWidth,
    );
    return Math.min(
      distance,
      Math.max(0, panels[index].offsetLeft - panels[0].offsetLeft),
    );
  };
  const chapterAt = (position) => {
    let closest = 0,
      difference = Infinity;
    services.forEach((_, index) => {
      const delta = Math.abs(position - chapterOffset(index));
      if (delta < difference) {
        closest = index;
        difference = delta;
      }
    });
    return closest;
  };
  useLayoutEffect(() => {
    if (!ready) return;
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const viewportElement = viewport.current;
        let refreshFrame = 0;
        let disposed = false;
        setPinned(true);
        setActive(0);
        viewport.current.scrollLeft = 0;
        const tween = gsap.to(track.current, {
          x: () => -(track.current.scrollWidth - viewport.current.clientWidth),
          ease: "none",
          scrollTrigger: {
            id: "horizontal-services",
            // The hero pin is created later as its media becomes ready.
            // Measure this lower section after that upstream spacer exists.
            refreshPriority: -10,
            trigger: root.current,
            start: "top top",
            end: () =>
              `+=${track.current.scrollWidth - viewport.current.clientWidth}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(
                chapterAt(
                  self.progress *
                    (track.current.scrollWidth - viewport.current.clientWidth),
                ),
              ),
          },
        });
        scroll.current = tween.scrollTrigger;
        // At entry the two halves overlap by 15% of the photograph's width.
        // Their transforms settle at zero, leaving the exact 80px layout gap.
        [...track.current.children].forEach((panel, i) => {
          const copy = panel.querySelector(".horizontal-service-copy");
          const photo = panel.querySelector("figure");
          const offset = () => 40 + photo.offsetWidth * 0.075;
          const sequence = gsap.timeline({
            scrollTrigger: i === 0 ? {
              id: `service-separation-${i + 1}`,
              refreshPriority: -11,
              trigger: root.current,
              start: "top 85%",
              end: "top top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            } : {
              id: `service-separation-${i + 1}`,
              refreshPriority: -11,
              trigger: panel,
              containerAnimation: tween,
              start: "left 85%",
              end: "left 15%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          sequence.fromTo(copy, { x: offset }, { x: 0, ease: "none" }, 0)
            .fromTo(photo, { x: () => -offset() }, { x: 0, ease: "none" }, 0);
        });
        const refresh = () => {
          if (disposed || refreshFrame) return;
          refreshFrame = requestAnimationFrame(() => {
            refreshFrame = 0;
            if (!disposed) ScrollTrigger.refresh();
          });
        };
        // Wait until React's later effects have installed the hero pin.
        refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener("load", refresh, { once: true });
        return () => {
          disposed = true;
          cancelAnimationFrame(refreshFrame);
          scroll.current = null;
          setPinned(false);
          setActive(0);
          viewportElement.scrollLeft = 0;
          window.removeEventListener("load", refresh);
        };
      },
      root,
    );
    return () => media.revert();
  }, [ready]);
  return (
    <section
      ref={root}
      id="services"
      className={`horizontal-services ${pinned ? "is-pinned" : ""}`}
      aria-label="Buying, selling and relocating"
    >
      <div className="horizontal-services-top">
        <p>03 / A considered approach</p>

      </div>
      <div
        ref={viewport}
        className="horizontal-services-viewport"
        onScroll={() => {
          if (!scroll.current && viewport.current.clientWidth)
            setActive(chapterAt(viewport.current.scrollLeft));
        }}
      >
        <div ref={track} className="horizontal-services-track">
          {services.map((service, i) => (
            <article
              key={service.short}
              className="horizontal-service-panel"
            >
              <div className="horizontal-service-copy">
                <p className="service-category">{service.short}</p>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <HoverControl as="a" className="text-link" href={service.link}>
                  {service.label}
                </HoverControl>
              </div>
              <figure>
                <img src={service.image} alt={service.alt} loading="lazy" />
              </figure>
            </article>
          ))}
        </div>
      </div>
      <div className="horizontal-services-bottom">
        <span aria-live="polite">0{active + 1} / 03</span>
      </div>
    </section>
  );
}
