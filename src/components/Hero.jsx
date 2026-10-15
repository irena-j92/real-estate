import { sitePath } from "../lib/sitePath.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import HoverControl from "./ui/HoverControl";
import useVillaScroll from "../hooks/useVillaScroll";

export default function Hero({ ready = false }) {
  const root = useRef(null), host = useRef(null), scene = useRef(null);
  const modeRef = useRef("auto"), scroll = useRef(0), errorRef = useRef(false);
  const [loaded, setLoaded] = useState(false), [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("auto"), [phase, setPhase] = useState("day"), [error, setError] = useState("");
  const apply = useCallback(value => {
    scroll.current = value;
    scene.current?.setProgress(value);
    if (modeRef.current === "auto") {
      scene.current?.setNight(value);
      if (errorRef.current) setPhase(value > 0.52 ? "night" : "day");
    }
  }, []);
  useVillaScroll(root, ready, loaded, apply);
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    let resource;
    import('../three/createVillaScene').then(({ createVillaScene }) => createVillaScene(host.current, {
      signal: controller.signal,
      onLoad: () => { if (!controller.signal.aborted) setLoaded(true); },
      onProgress: value => { if (!controller.signal.aborted) setProgress(value); },
      onPhase: value => { if (!controller.signal.aborted) setPhase(value); },
      onError: message => { if (!controller.signal.aborted) { errorRef.current = true; setError(message); setLoaded(true); } },
    })).then(result => {
      resource = result;
      if (controller.signal.aborted) { result?.dispose(); return; }
      scene.current = result;
      result?.setProgress?.(scroll.current);
      result?.setNight?.(modeRef.current === 'auto' ? scroll.current : modeRef.current === 'night' ? 1 : 0);
    }).catch(() => { if (!controller.signal.aborted) { errorRef.current = true; setError("The 3D view is unavailable. The architectural reference remains visible."); setLoaded(true); } });
    return () => { controller.abort(); resource?.dispose(); scene.current = null; };
  }, [ready]);
  const select = value => {
    modeRef.current = value; setMode(value);
    const night = value === 'auto' ? scroll.current : value === 'night' ? 1 : 0;
    scene.current?.setNight?.(night);
    if (errorRef.current) setPhase(night > 0.52 ? 'night' : 'day');
  };
  return <section id="top" ref={root} className={`cinematic-hero villa-hero ${loaded && !error ? 'villa-ready' : ''}`} data-scene-phase={phase} aria-label="Sunter Realty — explore the villa by day and night">
    <img className="villa-reference" src={sitePath("/assets/villa-reference.webp")} alt="Modern villa with sculptural white ribbons, charcoal walls, bronze glazing and landscaped gardens" fetchPriority="high" />
    <div ref={host} className="villa-canvas" />
    <div className="hero-scene-copy">
      <h1 aria-label="A place to belong."><span className="hero-line"><span className="hero-word">A place</span></span><span className="hero-line hero-line-second"><span className="hero-word">to <em>belong.</em></span></span></h1>
      <div className="hero-bottom">
        <HoverControl as="a" className="collection-orbit" href="#trending" aria-label="View our collection">
          <svg viewBox="0 0 200 200" aria-hidden="true"><circle className="orbit-track" cx="100" cy="100" r="98" /><circle className="orbit-progress" cx="100" cy="100" r="98" pathLength="100" /></svg>
          <span>View our<br />collection</span>
        </HoverControl>
      </div>
      <div className="hero-contact-actions">
        <HoverControl as="a" className="hero-call-button" href="#contact" onClick={() => window.dispatchEvent(new CustomEvent("realty-inquiry", { detail: "I'd like to book a call with Sunter Realty about my next move." }))}>Book a call</HoverControl>
        <HoverControl as="a" className="hero-contact-link" href="#contact">Contact</HoverControl>
      </div>
    </div>
    <div className="villa-time-control" role="group" aria-label="Villa lighting">
      <button type="button" aria-pressed={mode === "day"} onClick={() => select("day")}><FiSun size={17} aria-hidden="true" />DAY</button>
      <button type="button" aria-pressed={mode === "night"} onClick={() => select("night")}><FiMoon size={17} aria-hidden="true" />NIGHT</button>
      <button className="villa-auto" type="button" aria-label="Follow scroll for day to night transition" aria-pressed={mode === "auto"} onClick={() => select("auto")}>AUTO</button>
    </div>
    {!loaded && <p className="villa-load-status" role="status">Preparing the house{progress > 0 ? ` · ${progress}%` : '…'}</p>}
    {error && <p className="villa-load-status" role="status">{error}</p>}
    <div className="hero-transition" aria-hidden="true"><div className="hero-transition-panel" /></div>
  </section>;
}
