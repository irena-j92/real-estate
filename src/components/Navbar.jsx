import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiUser, FiX } from "react-icons/fi";
import { megaMenu } from "../data/megaMenu";
import LanguageSelector from "./LanguageSelector";

function sectionFor(category, link) {
  if (/agent|career|leadership|team|office/i.test(link)) return "#experts";
  if (/story|about/i.test(link)) return "#about";
  if (/blog|market|magazine|news/i.test(link)) return "#journal";
  if (/mortgage|onepoint|relocation|network|services/i.test(link))
    return "#offer";
  if (category === "Sell") return "#contact";
  return "#trending";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(megaMenu[0].label);
  const panelRef = useRef(null);
  const columnRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useGSAP(() => {
    if (!panelRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panelRef.current, {
        display: open ? "flex" : "none",
        clipPath: "none",
      });
      return;
    }
    if (open) {
      gsap.set(panelRef.current, { display: "flex" });
      gsap.fromTo(
        panelRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" },
      );
    } else {
      gsap.to(panelRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => gsap.set(panelRef.current, { display: "none" }),
      });
    }
  }, [open]);

  useGSAP(
    () => {
      if (!columnRef.current) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.fromTo(
        columnRef.current.children,
        { opacity: 0, y: reduced ? 0 : 14 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0.01 : 0.4,
          stagger: reduced ? 0 : 0.04,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [activeCategory], scope: panelRef },
  );

  const activeLinks =
    megaMenu.find((c) => c.label === activeCategory)?.links ?? [];

  return (
    <>
      <nav className="hero-nav fixed inset-x-0 top-0 z-[60] flex items-start justify-between px-10 py-0">
        <a
          href="#experts"
          className="hidden mt-10 items-center gap-2 border border-white/25 px-5 py-[16px] text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-yellow hover:text-yellow md:flex"
        >
          <FiUser size={14} />
          Our people
        </a>

        <a
          href="#top"
          className="mt-10 flex h-12 w-12 items-center justify-center bg-white/90 text-[11px] font-semibold uppercase tracking-widest text-dark backdrop-blur"
          aria-label="Long Realty home"
        >
          LR
        </a>

        <div className="mt-10 flex items-center gap-3">
          <LanguageSelector variant="light" />

          {/* <a
            href="#contact"
            className="hidden items-center gap-2 border border-white/25 px-5 py-[16px] text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-yellow hover:text-yellow md:flex"
          >
            <FiUser size={14} />
            Start a conversation
          </a> */}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-12 w-20 flex-col items-center justify-center gap-[10px] transition-transform duration-300 hover:scale-105"
          >
            <span
              className={`block h-px w-[30px] bg-white transition-transform duration-300 ${
                open ? "translate-y-[13px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-[30px] bg-white transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-px w-[30px] bg-white transition-transform duration-300 ${
                open ? "-translate-y-[13px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        ref={panelRef}
        style={{ display: "none" }}
        className="hero-menu fixed inset-0 z-50 hidden flex-col bg-[#141721]"
      >
        <div className="flex items-center justify-between px-10 pt-10">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-16 w-16 items-center justify-center bg-white text-dark"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-0 overflow-y-auto px-10 py-10 md:grid-cols-[360px_1fr] md:gap-16 md:py-16">
          <ul className="flex flex-col border-t border-white/10 md:border-none">
            {megaMenu.map((category) => (
              <li key={category.label} className="border-b border-white/10">
                <button
                  type="button"
                  onMouseEnter={() => setActiveCategory(category.label)}
                  onClick={() => setActiveCategory(category.label)}
                  className={`flex w-full items-center justify-between py-5 text-left font-accent-italic text-3xl transition-colors md:text-5xl ${
                    activeCategory === category.label
                      ? "text-yellow"
                      : "text-white hover:text-yellow/70"
                  }`}
                >
                  {category.label}
                </button>
                {activeCategory === category.label && (
                  <div className="flex flex-col gap-3 pb-5 md:hidden">
                    {category.links.map((link) => (
                      <a
                        key={link}
                        href={sectionFor(category.label, link)}
                        onClick={() => setOpen(false)}
                        className="text-sm text-white/70 hover:text-yellow"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div
            ref={columnRef}
            className="hidden flex-col gap-4 border-l border-white/10 pl-16 pt-4 md:flex"
          >
            {activeLinks.map((link) => (
              <a
                key={link}
                href={sectionFor(activeCategory, link)}
                onClick={() => setOpen(false)}
                className="text-lg text-white/70 transition-colors hover:text-yellow"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-10 py-8 md:hidden">
          <a
            href="#contact"
            className="flex items-center gap-2 border border-white/25 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <FiUser size={14} />
            Start a conversation
          </a>
        </div>
      </div>
    </>
  );
}
