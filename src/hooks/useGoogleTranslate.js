import { useEffect, useRef, useState } from "react";

/**
 * Loads the Google Translate website widget once, then exposes a
 * `translateTo(code)` function that drives it programmatically —
 * so we can keep our own on-brand dropdown as the visible UI.
 *
 * Degrades gracefully: if the script can't load (offline, blocked,
 * corporate network), `ready` stays false and translateTo becomes a
 * silent no-op instead of throwing.
 */
export default function useGoogleTranslate() {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (document.getElementById("google-translate-script")) {
      setReady(Boolean(document.querySelector(".goog-te-combo")));
      return;
    }

    window.googleTranslateElementInit = () => {
      try {
        // eslint-disable-next-line no-undef
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,fr,de,zh-CN",
            autoDisplay: false,
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      } catch {
        // widget failed to init — selector will just stay inert
      }

      const poll = setInterval(() => {
        if (document.querySelector(".goog-te-combo")) {
          setReady(true);
          clearInterval(poll);
        }
      }, 250);
      setTimeout(() => clearInterval(poll), 8000);
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => setReady(false);
    document.body.appendChild(script);
  }, []);

  const translateTo = (code) => {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    combo.value = code;
    combo.dispatchEvent(new Event("change"));
    return true;
  };

  return { ready, translateTo };
}
