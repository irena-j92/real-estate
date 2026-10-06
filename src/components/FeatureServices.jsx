import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ChapterTitle from "./experience/ChapterTitle";
const services = [
  {
    title: "Find your place",
    description:
      "For the way you live, and the way you want to live. A considered collection of homes and a guide who understands what matters.",
    image: "/assets/properties-2.jpg",
    link: "#trending",
    label: "Buying, with perspective",
  },
  {
    title: "Make your move",
    description:
      "Thoughtful preparation. A confident presentation. A personal plan for the home you are ready to share with someone new.",
    image: "/assets/properties-4.jpg",
    link: "#contact",
    label: "Selling, thoughtfully",
  },
  {
    title: "Feel at home",
    description:
      "From the first conversation to the final details, we connect the people and services that make a new beginning feel familiar.",
    image: "/assets/offerservices-2.jpg",
    link: "#offer",
    label: "Moving, made personal",
  },
];
export default function FeatureServices() {
  const [active, setActive] = useState(0);
  return (
    <section id="services" className="premium-section services-section">
      <div className="site-container">
        <div className="chapter-topline" data-reveal>
          <p className="section-kicker">03 / The way forward</p>
          <span className="micro-label">
            Every move deserves a different perspective.
          </span>
        </div>
        <div className="services-layout">
          <div className="services-visual" data-reveal data-image-reveal>
            <img
              key={active}
              className="view-enter"
              src={services[active].image}
              alt={services[active].label}
              loading="lazy"
            />
            <span>0{active + 1} / A considered approach</span>
          </div>
          <div className="services-intro" data-reveal>
            <ChapterTitle
              lines={[
                { text: "Life moves." },
                { text: "Move well.", italic: true },
              ]}
            />
            <div className="service-index">
              {services.map((service, i) => (
                <article
                  className={`service-row ${active === i ? "is-active" : ""}`}
                  key={service.title}
                >
                  <button
                    type="button"
                    className="service-select"
                    aria-expanded={active === i}
                    aria-controls={`service-copy-${i}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="service-number">0{i + 1}</span>
                    <span>{service.title}</span>
                    <FiPlus className={active === i ? "is-open" : ""} />
                  </button>
                  {active === i && (
                    <div
                      id={`service-copy-${i}`}
                      className="service-description view-enter"
                    >
                      <p>{service.description}</p>
                      <a className="text-link" href={service.link}>
                        {service.label}
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
