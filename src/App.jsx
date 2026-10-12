import HoverControl from "./components/ui/HoverControl";
import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import TrendingProperties from "./components/TrendingProperties";
import FeatureServices from "./components/FeatureServices";
import FindExpert from "./components/FindExpert";
import WhatWeOffer from "./components/WhatWeOffer";
import BlogSection from "./components/BlogSection";
import HistorySection from "./components/HistorySection";
import PerspectivePage from "./components/PerspectivePage";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import SunnyAssistant from "./components/SunnyAssistant";
import CustomCursor from "./components/experience/CustomCursor";
import ScrollRail from "./components/experience/ScrollRail";
import useExperienceMotion from "./hooks/useExperienceMotion";
import useInitialAnchor from "./hooks/useInitialAnchor";
export default function App() {
  const perspective = window.location.pathname.replace(/\/$/, "") === "/our-perspective";
  const [ready, setReady] = useState(perspective),
    root = useRef(null);
  const open = useCallback(() => setReady(true), []);
  const [heroPassed, setHeroPassed] = useState(false);
  useEffect(() => {
    if (!ready || perspective) return;
    const hero = document.getElementById("top");
    const observer = new IntersectionObserver(
      ([entry]) =>
        setHeroPassed(
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
        ),
      { threshold: 0 },
    );
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, [ready, perspective]);
  useEffect(() => {
    document.title = perspective ? "Our Perspective — Sunter Realty" : "Sunter Realty — A Different Perspective on Home";
  }, [perspective]);
  useExperienceMotion(root, ready);
  useInitialAnchor(ready, perspective);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [ready]);
  return (
    <div ref={root} className="realty-experience">
      <HoverControl as="a" className="skip-link" href={perspective ? "#perspective-top" : "#trending"}>
        {perspective ? "Skip to our perspective" : "Skip to residences"}
      </HoverControl>
      {!ready && <Loader onComplete={open} />}
      <div inert={!ready}>
        <Navbar ready={ready} light={perspective} />
        <ScrollRail ready={ready} perspective={perspective} />
        {perspective ? <PerspectivePage /> : <main>
          <Hero ready={ready} />
          <AboutSection ready={ready} />
          <TrendingProperties />
          <FeatureServices ready={ready} />
          <FindExpert />
          <WhatWeOffer />
          <HistorySection />
          <BlogSection />
          <ContactSection />
        </main>}
        <Footer />
        <SunnyAssistant visible={ready && heroPassed} />
      </div>
      <CustomCursor />
    </div>
  );
}
