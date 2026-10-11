import HoverControl from "./ui/HoverControl";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { offerServices } from "../data/offerServices";

function OfferCard({ service }) {
  const [flipped, setFlipped] = useState(false);
  const hasHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return (
    <article
      className={`offer-flip-card ${flipped ? "is-flipped" : ""}`}
      onMouseEnter={() => {
        if (hasHover()) setFlipped(true);
      }}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          setFlipped(false);
      }}
      onFocusCapture={() => {
        if (hasHover()) setFlipped(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFlipped(false);
      }}
    >
      <div className="offer-card-rotor">
        <div className="offer-card-face offer-card-front">
          <span className="offer-card-number" aria-hidden="true">
            /{service.number}
          </span>
          <h3 id={`offer-title-${service.number}`}>{service.title}</h3>
          <p>{service.description}</p>
        </div>
        <div className="offer-card-face offer-card-back" aria-hidden="true">
          <img src={service.image} alt="" loading="lazy" />
          <span className="offer-card-number">/{service.number}</span>
          <span className="offer-photo-title">{service.title}</span>
        </div>
      </div>
      <HoverControl as="button"
        className="offer-card-toggle"
        type="button"
        aria-label={`Reveal property image for ${service.title}`}
        aria-pressed={flipped}
        onClick={() => setFlipped((current) => !current)}
      >
        <span className="sr-only">{service.imageAlt}</span>
      </HoverControl>
      <HoverControl as="a"
        className="offer-card-cta"
        href="#contact"
        aria-label={`Get started with ${service.title}`}
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("realty-inquiry", { detail: service.inquiry }),
          )
        }
      >
        <span>Get started</span>
        <FiArrowRight aria-hidden="true" />
      </HoverControl>
    </article>
  );
}

export default function WhatWeOffer() {
  return (
    <section
      id="offer"
      className="premium-section offer-section offer-gallery"
      aria-labelledby="offer-heading"
    >
      <img
        className="offer-scene"
        src="/assets/properties-1.jpg"
        alt=""
        loading="lazy"
        aria-hidden="true"
      />
      <div className="offer-gallery-inner">
        <h2 id="offer-heading" className="offer-heading" data-reveal>
          What We <em>Offer</em>
        </h2>
        <div className="offer-card-grid" data-reveal>
          {offerServices.map((service) => (
            <OfferCard key={service.number} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
