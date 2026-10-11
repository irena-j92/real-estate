import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";
import SearchOverlay from "./SearchOverlay";
const links = [
  ["01", "The residences", "#trending"],
  ["02", "Our perspective", "#about"],
  ["03", "Your people", "#experts"],
  ["04", "The local edit", "#journal"],
  ["05", "Let’s talk", "#contact"],
];
export default function Navbar({ ready = true }) {
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
    requestAnimationFrame(() => {
      const target = document.querySelector(href);
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
        className={`experience-nav ${scrolled ? "is-scrolled" : ""} ${ready ? "is-ready" : ""}`}
      >
        <button
          ref={menuToggle}
          type="button"
          className="menu-toggle"
          onClick={() => setActive("menu")}
          aria-expanded={active === "menu"}
          aria-controls="main-menu"
          aria-label="Open menu"
        >
          <span>Menu</span>
          <span className="architecture-mark" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </button>
        <a className="nav-wordmark" href="#top" aria-label="Long Realty home">
          Long<span>Realty</span>
          <small>SOUTHERN ARIZONA</small>
        </a>
        <div className="header-right">
          <LanguageSelector />
          <button
            ref={searchToggle}
            className="header-search-button"
            type="button"
            aria-label="Open property search"
            aria-expanded={active === "search"}
            aria-controls="property-search"
            onClick={() => setActive("search")}
          >
            <FiSearch size={19} />
            <span>Search</span>
          </button>
        </div>
      </header>
      {active && (
        <dialog
          ref={drawer}
          id={active === "menu" ? "main-menu" : "property-search"}
          className={`header-drawer ${active === "menu" ? "drawer-left" : "drawer-right"}`}
          aria-labelledby={
            active === "menu" ? "menu-heading" : "search-heading"
          }
          onCancel={(e) => {
            e.preventDefault();
            setActive(null);
          }}
          onClick={backdrop}
        >
          <button
            className="drawer-close"
            type="button"
            onClick={() => setActive(null)}
            aria-label={
              active === "menu" ? "Close menu" : "Close property search"
            }
          >
            <span>Close</span>
            <FiX size={22} />
          </button>
          {active === "search" ? (
            <SearchOverlay onNavigate={navigate} />
          ) : (
            <div className="menu-index">
              <p className="drawer-eyebrow">Long Realty / Southern Arizona</p>
              <h2 id="menu-heading">
                A different <em>perspective.</em>
              </h2>
              <nav aria-label="Full navigation">
                {links.map(([num, label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(href);
                    }}
                  >
                    <small>{num}</small>
                    <span>{label}</span>
                  </a>
                ))}
              </nav>
              <div className="menu-footer">
                <span>Home begins with a conversation.</span>
                <span>Tucson, Arizona</span>
              </div>
            </div>
          )}
        </dialog>
      )}
    </>
  );
}
