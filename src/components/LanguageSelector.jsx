import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiGlobe } from "react-icons/fi";
import useGoogleTranslate from "../hooks/useGoogleTranslate";

// Codes match Google Translate's combo values (zh-CN, not zh).
const LANGUAGES = [
  { code: "en", short: "EN", label: "English" },
  { code: "es", short: "ES", label: "Español" },
  { code: "fr", short: "FR", label: "Français" },
  { code: "de", short: "DE", label: "Deutsch" },
  { code: "zh-CN", short: "中文", label: "中文" },
];

export default function LanguageSelector({ variant = "light" }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(LANGUAGES[0]);
  const ref = useRef(null);
  const { ready, translateTo } = useGoogleTranslate();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (lang) => {
    setCurrent(lang);
    setOpen(false);
    translateTo(lang.code === "en" ? "en" : lang.code);
  };

  const textColor = variant === "light" ? "text-white/80" : "text-dark/70";

  return (
    <div ref={ref} className="notranslate relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.label}. Change language`}
        title={ready ? undefined : "Translation loading…"}
        className={`flex items-center gap-2 border border-current/20 px-3 py-2 text-xs font-medium uppercase tracking-wider ${textColor} transition-colors hover:border-yellow hover:text-yellow`}
      >
        <FiGlobe size={14} />
        <span>{current.short}</span>
        <FiChevronDown
          size={12}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full z-50 mt-2 w-40 border border-dark/10 bg-white py-1 text-dark shadow-lg"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === current.code}
                onClick={() => handleSelect(lang)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-light ${
                  lang.code === current.code ? "bg-light font-medium" : ""
                }`}
              >
                {lang.label}
                <span className="text-dark/40">{lang.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
