import { useCallback, useEffect, useState } from "react";

export const INTRO_SEEN_KEY = "sunter-realty:intro-seen";
function hasVisited() {
  for (const name of ["localStorage", "sessionStorage"]) {
    try { if (window[name].getItem(INTRO_SEEN_KEY) === "1") return true; } catch { /* Storage may be unavailable. */ }
  }
  return Boolean(window.__sunterIntroSeen);
}
export default function useFirstVisitIntro() {
  const [ready, setReady] = useState(hasVisited);
  useEffect(() => {
    // Record display immediately, so a refresh during the intro skips it too.
    window.__sunterIntroSeen = true;
    for (const name of ["localStorage", "sessionStorage"]) {
      try { window[name].setItem(INTRO_SEEN_KEY, "1"); } catch { /* Keep the page usable without storage. */ }
    }
  }, []);
  const complete = useCallback(() => setReady(true), []);
  return [ready, complete];
}
