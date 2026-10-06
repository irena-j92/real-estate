import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { offerServices } from "../data/offerServices";
export default function WhatWeOffer() {
  const [index, setIndex] = useState(0);
  const service = offerServices[index];
  return (
    <section id="offer" className="premium-section offer-section">
      <div className="site-container offer-layout">
        <div data-reveal className="offer-image" data-image-reveal>
          <img
            key={service.number}
            className="view-enter"
            src={service.image}
            alt={
              service.title === "OnePoint"
                ? "Professionals collaborating around a table"
                : service.title
            }
            loading="lazy"
          />
          <span className="relative z-10">The details, taken care of.</span>
        </div>
        <div data-reveal>
          <p className="section-kicker">05 / Every detail, considered</p>
          <h2 className="section-title">
            Beyond the keys.
            <br />
            <em>Before the beginning.</em>
          </h2>
          <p className="body-copy mt-6">
            There’s a lot that goes into feeling at home. We connect the right
            people, services, and support around you.
          </p>
          <div className="offer-options">
            {offerServices.map((s, i) => (
              <div key={s.number} className="offer-option">
                <button
                  type="button"
                  aria-expanded={index === i}
                  aria-controls={`offer-${i}`}
                  onClick={() => setIndex(i)}
                >
                  <span>
                    <small>{s.number}</small>
                    <strong>
                      {s.title === "OnePoint"
                        ? "One point of contact"
                        : s.title === "Networks"
                          ? "Connected around the world"
                          : s.title}
                    </strong>
                  </span>
                  {index === i ? <FiMinus /> : <FiPlus />}
                </button>
                {index === i && (
                  <div id={`offer-${i}`} className="offer-answer view-enter">
                    <p>{s.description}</p>
                    <a href="#contact" className="text-link">
                      Find out more
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
