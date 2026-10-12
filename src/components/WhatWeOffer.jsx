import { useState } from "react";
import { offerServices } from "../data/offerServices";

function OfferCard({ service }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <article className={`offer-flip-card ${flipped ? "is-flipped" : ""}`}
      onPointerEnter={() => { if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setFlipped(true); }}
      onPointerLeave={() => { if (!document.activeElement || !document.activeElement.closest(`#offer-card-${service.number}`)) setFlipped(false); }}
      onFocusCapture={() => setFlipped(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFlipped(false); }}
      id={`offer-card-${service.number}`}>
      <div className="offer-card-rotor" aria-hidden="true">
        <div className="offer-card-face offer-card-front" />
        <div className="offer-card-face offer-card-back">
          <img src={service.image} alt="" loading="lazy" />
        </div>
      </div>
      <div className="offer-card-content">
        <span className="offer-card-number" aria-hidden="true">/{service.number}</span>
        <h3 id={`offer-title-${service.number}`}>{service.title}</h3>
        <p id={`offer-description-${service.number}`}>{service.description}</p>
      </div>
      <button className="offer-card-toggle" type="button" data-no-hover
        aria-label={`Reveal property image for ${service.title}`}
        aria-describedby={`offer-description-${service.number}`}
        aria-pressed={flipped} onClick={() => setFlipped(current => !current)} />
    </article>
  );
}
export default function WhatWeOffer() {
  return (
    <section id="offer" className="premium-section offer-section offer-gallery" aria-labelledby="offer-heading">
      <img className="offer-scene" src="/assets/properties-1.jpg" alt="" loading="lazy" aria-hidden="true" />
      <div className="offer-gallery-inner">
        <h2 id="offer-heading" className="offer-heading" data-reveal>What We Offer</h2>
        <div className="offer-card-grid" data-reveal>
          {offerServices.map(service => <OfferCard key={service.number} service={service} />)}
        </div>
      </div>
    </section>
  );
}
