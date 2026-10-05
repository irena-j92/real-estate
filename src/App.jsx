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

function useScrollReveal(containerRef) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = document.querySelectorAll(
        "[data-reveal]:not(.about-reveal)"
      );
      targets.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [containerRef]);
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const appRef = useRef(null);

  useMagnetic(appRef);
  useScrollReveal(appRef);

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
        <ContactSection />
        {/* <LongRealtyApp /> */}
        <BlogSection />
        {/* <QuickLinks /> */}
      </main>
      <Footer />
      <SunnyAssistant />
    </div>
  );
}
