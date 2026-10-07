import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiMaximize,
  FiHeart,
  FiMapPin,
  FiPause,
  FiPlay,
} from "react-icons/fi";
import { properties } from "../data/properties";
import Button from "./ui/Button";

const SECONDS = 8;
function inquire(property, offer = false) {
  window.dispatchEvent(
    new CustomEvent("realty-inquiry", {
      detail: offer
        ? `I'd like to discuss an offer on ${property.title}, ${property.address}.`
        : `I'd like to arrange a showing of ${property.title}, ${property.address}.`,
    }),
  );
  document.getElementById("contact")?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
function SaveButton({ property, saved, toggle }) {
  return (
    <button
      type="button"
      className="save-property"
      aria-label={`${saved ? "Unsave" : "Save"} ${property.title}`}
      aria-pressed={saved}
      onClick={() => toggle(property.id)}
    >
      <FiHeart size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
function SingleView({ index, setIndex, saved, toggle }) {
  const property = properties[index];
  const progress = useRef(null);
  const root = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (!progress.current) return;
    const animation = gsap.fromTo(
      progress.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: SECONDS,
        ease: "none",
        onComplete: () => setIndex((i) => (i + 1) % properties.length),
      },
    );
    if (paused || hovering || focused || !visible || reduced) animation.pause();
    return () => animation.kill();
  }, [index, setIndex, paused, hovering, focused, visible, reduced]);
  const move = (dir) =>
    setIndex((i) => (i + dir + properties.length) % properties.length);
  return (
    <div
      ref={root}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <article className="featured-property">
        <div className="property-visual" data-image-reveal>
          <img
            key={property.id}
            src={property.image}
            alt={property.title}
            loading="lazy"
          />
          <span className="property-badge">Selected residence</span>
          <SaveButton
            property={property}
            saved={saved.includes(property.id)}
            toggle={toggle}
          />
          <div className="property-photo-caption">
            <span>Southern Arizona</span>
            <span>
              0{index + 1} / 0{properties.length}
            </span>
          </div>
        </div>
        <div key={`${property.id}-info`} className="property-info view-enter">
          <div className="property-summary">
            <p className="eyebrow">{property.tag} / Tucson, Arizona</p>
            <h3 className="property-title">{property.title}</h3>
            <p className="property-address">
              <FiMapPin size={15} />
              {property.address}
            </p>
          </div>
          <div className="property-details">
            <p className="property-price">{property.price}</p>
            <div className="property-specs">
              <div>
                <strong>{property.beds}</strong>
                <span>Bedrooms</span>
              </div>
              <div>
                <strong>{property.baths}</strong>
                <span>Bathrooms</span>
              </div>
              <div>
                <strong>{property.sqft}</strong>
                <span>Square feet</span>
              </div>
            </div>
            <div className="property-actions">
              <Button variant="yellow" onClick={() => inquire(property)}>
                Arrange a private showing
              </Button>
              <button
                className="text-link"
                type="button"
                onClick={() => inquire(property, true)}
              >
                Interested in making an offer?
              </button>
            </div>
          </div>
        </div>
      </article>
      <div className="listing-navigation">
        <div className="nav-track">
          <span className="count">
            <strong>0{index + 1}</strong> / 0{properties.length}
          </span>
          <div className="listing-progress" aria-hidden="true">
            <span ref={progress} />
          </div>
          <button
            type="button"
            aria-label={
              paused ? "Resume property slideshow" : "Pause property slideshow"
            }
            onClick={() => setPaused((p) => !p)}
            className="icon-button"
            style={{ width: 40, height: 40 }}
          >
            {paused || reduced ? <FiPlay size={13} /> : <FiPause size={13} />}
          </button>
        </div>
        <p className="listing-note">
          Considered spaces. Endless possibilities.
        </p>
        <div className="listing-nav-buttons">
          <button
            className="icon-button"
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous property"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => move(1)}
            aria-label="Next property"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
function GridView({ saved, toggle, select }) {
  return (
    <div className="properties-grid view-enter">
      {properties.map((property, i) => (
        <article key={property.id} className="property-grid-card">
          <div className="grid-property-image" data-cursor="EXPLORE">
            <button
              onClick={() => select(i)}
              type="button"
              aria-label={`Explore ${property.title}`}
            >
              <img src={property.image} alt={property.title} loading="lazy" />
            </button>
            <span className="property-badge">{property.tag}</span>
            <SaveButton
              property={property}
              saved={saved.includes(property.id)}
              toggle={toggle}
            />
          </div>
          <div className="grid-property-info">
            <div>
              <h3>
                <button
                  className="text-left"
                  onClick={() => select(i)}
                  type="button"
                >
                  {property.title}
                </button>
              </h3>
              <p>{property.address.split(",")[0]}</p>
            </div>
            <p className="grid-price">{property.price}</p>
          </div>
          <div className="grid-property-meta">
            <span>
              {property.beds} beds · {property.baths} baths · {property.sqft} sq
              ft
            </span>
            <button type="button" onClick={() => select(i)}>
              Explore home
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
export default function TrendingProperties() {
  const [view, setView] = useState("single");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("long-realty-saved") || "[]",
      ).filter((id) => properties.some((p) => p.id === id));
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("long-realty-saved", JSON.stringify(saved));
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, [saved]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [view]);
  const toggle = (id) =>
    setSaved((list) =>
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
    );
  const select = (i) => {
    setIndex(i);
    setView("single");
    requestAnimationFrame(() =>
      document.getElementById("trending")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      }),
    );
  };
  return (
    <section id="trending" className="premium-section listings-section">
      <div className="site-container">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-kicker">02 / The collection</p>
            <h2 className="section-title">
              The residences.
              <br />
              <em>Extraordinary by nature.</em>
            </h2>
          </div>
          <div className="listing-tools">
            <div
              className="view-toggle"
              role="group"
              aria-label="Property display"
            >
              <button
                onClick={() => setView("single")}
                aria-pressed={view === "single"}
                type="button"
              >
                <FiMaximize size={15} />
                Single
              </button>
              <button
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                type="button"
              >
                <FiGrid size={15} />
                Grid
              </button>
            </div>
            <button
              className="text-link"
              type="button"
              onClick={() => setView("grid")}
            >
              Explore all homes
            </button>
          </div>
        </div>
        {view === "single" ? (
          <SingleView
            index={index}
            setIndex={setIndex}
            saved={saved}
            toggle={toggle}
          />
        ) : (
          <GridView saved={saved} toggle={toggle} select={select} />
        )}
        <p className="eyebrow listing-disclosure">
          {saved.length
            ? `${saved.length} ${saved.length === 1 ? "home" : "homes"} saved · `
            : ""}
          A selection of illustrative residences
        </p>
      </div>
    </section>
  );
}
