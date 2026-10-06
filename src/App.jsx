import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import TrendingProperties from "./components/TrendingProperties";
import VideoSection from "./components/VideoSection";
import FeatureServices from "./components/FeatureServices";
import FindExpert from "./components/FindExpert";
import WhatWeOffer from "./components/WhatWeOffer";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import SunnyAssistant from "./components/SunnyAssistant";
import CustomCursor from "./components/experience/CustomCursor";
import useExperienceMotion from "./hooks/useExperienceMotion";
export default function App() {
  const [ready, setReady] = useState(false),
    root = useRef(null);
  const open = useCallback(() => setReady(true), []);
  useExperienceMotion(root, ready);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [ready]);
  return (
    <div ref={root} className="realty-experience">
      <a className="skip-link" href="#trending">
        Skip to residences
      </a>
      {!ready && <Loader onComplete={open} />}
      <div inert={!ready}>
        <Navbar ready={ready} />
        <main>
          <Hero ready={ready} />
          <AboutSection />
          <TrendingProperties />
          <VideoSection />
          <FeatureServices />
          <FindExpert />
          <WhatWeOffer />
          <BlogSection />
          <ContactSection />
        </main>
        <Footer />
        <SunnyAssistant />
      </div>
      <CustomCursor />
    </div>
  );
}
