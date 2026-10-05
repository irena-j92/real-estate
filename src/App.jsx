import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
// import SearchPanel from "./components/SearchPanel";
import TrendingProperties from "./components/TrendingProperties";
import AboutSection from "./components/AboutSection";
import VideoSection from "./components/VideoSection";
// import HorizontalServices from "./components/HorizontalServices";
import FeatureServices from "./components/FeatureServices";
import FindExpert from "./components/FindExpert";
import WhatWeOffer from "./components/WhatWeOffer";
import ContactSection from "./components/ContactSection";
// import LongRealtyApp from "./components/LongRealtyApp";
import BlogSection from "./components/BlogSection";
// import QuickLinks from "./components/QuickLinks";
import Footer from "./components/Footer";
import SunnyAssistant from "./components/SunnyAssistant";
import useMagnetic from "./hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

function useScrollReveal(containerRef, loading) {
  useEffect(() => {
    if (
      loading ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
    );
    const register = () =>
      root.querySelectorAll("[data-reveal]:not(.is-reveal)").forEach((el) => {
        el.classList.add("is-reveal");
        observer.observe(el);
      });
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      root
        .querySelectorAll(".is-reveal")
        .forEach((el) => el.classList.remove("is-reveal", "is-visible"));
    };
  }, [containerRef, loading]);
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const appRef = useRef(null);

  useMagnetic(appRef);
  useScrollReveal(appRef, loading);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  return (
    <div ref={appRef}>
      {loading && (
        <Loader
          onComplete={() => {
            setLoading(false);
            setHeroReady(true);
          }}
        />
      )}
      <main>
        <Hero ready={heroReady} />
        {/* <SearchPanel /> */}
        <AboutSection />
        <TrendingProperties />
        <VideoSection />
        {/* <HorizontalServices /> */}
        <FeatureServices />
        <FindExpert />
        <WhatWeOffer />
        {/* <LongRealtyApp /> */}
        <BlogSection />
        <ContactSection />
        {/* <QuickLinks /> */}
      </main>
      <Footer />
      <SunnyAssistant />
    </div>
  );
}
