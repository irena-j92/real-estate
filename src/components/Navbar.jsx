import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiPlus, FiX } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";
const links = [
  ["01", "The residences", "#trending"],
  ["02", "Our perspective", "#about"],
  ["03", "Your people", "#experts"],
  ["04", "The local edit", "#journal"],
  ["05", "Let’s talk", "#contact"],
];
export default function Navbar({ ready = true }) {
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const panel = useRef(null),
    toggle = useRef(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const toggleElement = toggle.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector("a");
    first?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = [
          toggle.current,
          ...panel.current.querySelectorAll("a[href],button"),
        ];
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      toggleElement?.focus();
    };
  }, [open]);
  useEffect(() => {
    if (!open || !panel.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".menu-link-text",
        { yPercent: reduced ? 0 : 110 },
        {
          yPercent: 0,
          duration: reduced ? 0.01 : 0.75,
          stagger: reduced ? 0 : 0.07,
          ease: "power3.out",
        },
      );
    }, panel);
    return () => ctx.revert();
  }, [open]);
  return (
    <>
      <header
        className={`experience-nav ${scrolled ? "is-scrolled" : ""} ${ready ? "is-ready" : ""}`}
      >
        <a className="nav-wordmark" href="#top" aria-label="Long Realty home">
          Long<span>Realty</span>
          <small>SOUTHERN ARIZONA</small>
        </a>
        <div className="nav-controls">
          <LanguageSelector />
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="main-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="architecture-mark" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            {open ? <FiX size={19} /> : <FiPlus size={19} />}
          </button>
        </div>
      </header>
      {open && (
        <div
          id="main-menu"
          ref={panel}
          className="experience-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="menu-index">
            <span className="micro-label">A different perspective.</span>
            <nav aria-label="Full navigation">
              {links.map(([num, label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>
                  <small>{num}</small>
                  <span className="menu-link-mask">
                    <span className="menu-link-text">{label}</span>
                  </span>
                </a>
              ))}
            </nav>
            <div className="menu-footer">
              <span>Tucson / Southern Arizona</span>
              <span>Home begins with a conversation.</span>
            </div>
          </div>
          <div className="menu-image">
            <img
              src="/assets/properties-4.jpg"
              alt="An architectural residence with an outdoor terrace"
            />
            <p>
              Some places
              <br />
              <em>change everything.</em>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
