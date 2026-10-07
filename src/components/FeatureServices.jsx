import { useEffect, useRef, useState } from "react";
import ChapterTitle from "./experience/ChapterTitle";
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
      "A new address is only the beginning. From understanding the communities to connecting the right local services, we make your move to Southern Arizona feel a little more familiar.",
    image: "/assets/offerservices-2.jpg",
    alt: "A welcoming interior prepared for a new beginning",
    link: "#offer",
    label: "Discover the support around you",
  },
];
export default function FeatureServices() {
  const [active, setActive] = useState(0);
  const chapters = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number(entry.target.dataset.serviceChapter));
        });
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0 },
    );
    chapters.current.forEach((chapter) => chapter && observer.observe(chapter));
    return () => observer.disconnect();
  }, []);
  const select = (i) => {
    setActive(i);
    const chapter = chapters.current[i];
    if (chapter)
      window.scrollTo({
        top: chapter.getBoundingClientRect().top + window.scrollY - 135,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <section
      id="services"
      className="premium-section services-section service-story"
    >
      <div className="site-container">
        <div className="chapter-topline" data-reveal>
          <p className="section-kicker">03 / A considered approach</p>
          <span className="micro-label">
            From a first conversation to a new beginning.
          </span>
        </div>
        <div className="service-story-layout">
          <div className="service-story-visual">
            <div className="service-image-stack">
              {services.map((service, i) => (
                <img
                  key={service.short}
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  className={active === i ? "is-active" : ""}
                  aria-hidden={active !== i}
                />
              ))}
            </div>
            <div className="service-image-caption">
              <span>0{active + 1} / 03</span>
              <span>{services[active].short}, with perspective.</span>
            </div>
          </div>
          <div className="service-story-content">
            <div className="service-story-heading" data-reveal>
              <ChapterTitle
                lines={[
                  { text: "Your move." },
                  { text: "Our perspective.", italic: true },
                ]}
              />
              <p className="body-copy">
                The right home. The right people. A little clarity at every
                step.
              </p>
            </div>
            <nav className="service-chapter-nav" aria-label="Service chapters">
              {services.map((service, i) => (
                <button
                  key={service.short}
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => select(i)}
                >
                  0{i + 1} / {service.short}
                </button>
              ))}
            </nav>
            {services.map((service, i) => (
              <article
                key={service.short}
                ref={(el) => {
                  chapters.current[i] = el;
                }}
                data-service-chapter={i}
                className={`service-chapter ${active === i ? "is-active" : ""}`}
              >
                <img
                  className="service-mobile-photo"
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                />
                <p className="section-kicker">
                  /0{i + 1} — {service.short}
                </p>
                <h3>{service.title}</h3>
                <p className="body-copy">{service.description}</p>
                <a className="text-link" href={service.link}>
                  {service.label}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
