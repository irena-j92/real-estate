import LegalPage from "./components/LegalPage";
import useFirstVisitIntro from "./hooks/useFirstVisitIntro";
import HoverControl from "./components/ui/HoverControl";
import { useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import VillaHero from "./components/Hero";
import VideoHero from "./components/VideoHero";
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
  const Hero = new URLSearchParams(window.location.search).get("hero") === "3d" ? VillaHero : VideoHero;
  const pathname = window.location.pathname.replace(/\/$/, "");
  const perspective = pathname === "/our-perspective";
  const legal = ["/privacy-policy", "/terms-of-services"].includes(pathname) ? pathname.slice(1) : null;
  const contentPage = perspective || Boolean(legal);
  const [ready, open] = useFirstVisitIntro();
  const root = useRef(null);
  const [heroPassed, setHeroPassed] = useState(false);
  useEffect(() => {
    if (!ready || contentPage) return;
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
  }, [ready, contentPage]);
  useEffect(() => {
    document.title = legal ? `${legal === "privacy-policy" ? "Privacy Policy" : "Terms of Services"} — Sunter Realty` :
      perspective ? "Our Perspective — Sunter Realty" : "Sunter Realty — Remarkable Homes. Personal Guidance.";
  }, [perspective, legal]);
  useExperienceMotion(root, ready);
  useInitialAnchor(ready, contentPage);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [ready]);
  return (
    <div ref={root} className="realty-experience">
      <HoverControl as="a" className="skip-link" href={legal ? "#legal-title" : perspective ? "#perspective-top" : "#trending"}>
        {legal ? "Skip to page content" : perspective ? "Skip to our perspective" : "Skip to residences"}
      </HoverControl>
      {!ready && <Loader onComplete={open} />}
      <div inert={!ready}>
        <Navbar ready={ready} light={perspective} />
        {!legal && <ScrollRail ready={ready} perspective={perspective} />}
        {legal ? <LegalPage type={legal} /> : perspective ? <PerspectivePage /> : <main>
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
