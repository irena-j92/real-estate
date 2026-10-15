import { sitePath } from "../lib/sitePath.js";
import HoverControl from "./ui/HoverControl";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import gsap from "gsap";
import SearchOverlay from "./SearchOverlay";
import AccountMenu from "./AccountMenu";
const links = [
  ["01", "Our perspective", sitePath("/our-perspective")],
  ["02", "The properties", sitePath("/#trending")],
  ["03", "Our experts", sitePath("/#experts")],
  ["04", "The local edit", sitePath("/#journal")],
  ["05", "Contact", sitePath("/#contact")],
];

function MenuLink({ num, label, href, navigate }) {
  const roll = useRef(null);
  useEffect(() => {
    const track = roll.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reset = () => {
      if (reduced.matches) {
        gsap.killTweensOf(track);
        gsap.set(track, { yPercent: 0 });
      }
    };
    reduced.addEventListener("change", reset);
    return () => {
      reduced.removeEventListener("change", reset);
      gsap.killTweensOf(track);
    };
  }, []);
  const hover = (entered) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const yPercent = entered ? -50 : 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(roll.current, {
      yPercent,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };
  return (
    <a
      href={href}
      aria-label={`${num} ${label}`}
      onPointerEnter={() => hover(true)}
      onPointerLeave={() => hover(false)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      <small>{num}</small>
      <span className="menu-roll-mask" aria-hidden="true">
        <span className="menu-roll-track" ref={roll}>
          <span className="menu-roll-face">{label}</span>
          <span className="menu-roll-face">{label}</span>
        </span>
      </span>
    </a>
  );
}
export default function Navbar({ ready = true, light = false }) {
  const [active, setActive] = useState(null),
    [scrolled, setScrolled] = useState(false);
  const drawer = useRef(null),
    menuToggle = useRef(null),
    searchToggle = useRef(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!active) return;
    const dialog = drawer.current,
      opener = active === "menu" ? menuToggle.current : searchToggle.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const focusFrame = requestAnimationFrame(() =>
      dialog.querySelector(active === "search" ? "input" : "nav a")?.focus(),
    );
    return () => {
      cancelAnimationFrame(focusFrame);
      dialog.close();
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [active]);
  const navigate = (href) => {
    setActive(null);
    const destination = new URL(href, window.location.href);
    if (destination.pathname !== window.location.pathname || !destination.hash) {
      window.location.assign(destination.pathname + destination.hash);
      return;
    }
    requestAnimationFrame(() => {
      const target = document.getElementById(destination.hash.slice(1));
      if (target)
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 90,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
    });
  };
  const backdrop = (e) => {
    if (e.target !== e.currentTarget) return;
    const b = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < b.left ||
      e.clientX > b.right ||
      e.clientY < b.top ||
      e.clientY > b.bottom
    )
      setActive(null);
  };
  return (
    <>
      <header
        className={`experience-nav ${scrolled || light ? "is-scrolled" : ""} ${ready ? "is-ready" : ""}`}
      >
        <HoverControl as="button"
          ref={menuToggle}
          type="button"
          className="menu-toggle"
          onClick={() => setActive("menu")}
          aria-expanded={active === "menu"}
          aria-controls="main-menu"
          aria-label="Open menu"
        >
          <span className="architecture-mark" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </HoverControl>
        <a className="nav-wordmark" data-no-hover href={sitePath("/#top")} aria-label="Sunter Realty home">
          Sunter<span>Realty</span>
        </a>
        <div className="header-right">
          <HoverControl as="button"
            ref={searchToggle}
            className="header-search-button"
            type="button"
            aria-label="Open property search"
            aria-expanded={active === "search"}
            aria-controls="property-search"
            onClick={() => setActive("search")}
          >
            <FiSearch size={22} strokeWidth={1.25} aria-hidden="true" />
          </HoverControl>
          <AccountMenu onOpen={() => setActive(null)} />
        </div>
      </header>
      {active && (
        <dialog
          ref={drawer}
          id={active === "menu" ? "main-menu" : "property-search"}
          className={`header-drawer ${active === "menu" ? "drawer-left" : "drawer-right"}`}
          aria-label={active === "menu" ? "Main navigation" : undefined}
          aria-labelledby={active === "search" ? "search-heading" : undefined}
          onCancel={(e) => {
            e.preventDefault();
            setActive(null);
          }}
          onClick={backdrop}
        >
          <button
            data-no-hover
            className="drawer-close"
            type="button"
            onClick={() => setActive(null)}
            aria-label={
              active === "menu" ? "Close menu" : "Close property search"
            }
          >
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path
                d="M7 7L25 25M25 7L7 25"
                stroke="currentColor"
                strokeWidth="0.8"
              />
            </svg>
          </button>
          {active === "search" ? (
            <SearchOverlay onNavigate={navigate} />
          ) : (
            <div className="menu-index">
              <nav aria-label="Full navigation">
                {links.map(([num, label, href]) => (
                  <MenuLink
                    key={href}
                    num={num}
                    label={label}
                    href={href}
                    navigate={navigate}
                  />
                ))}
              </nav>
            </div>
          )}
        </dialog>
      )}
    </>
  );
}
