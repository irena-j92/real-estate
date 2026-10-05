import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiMapPin,
  FiSearch,
  FiSliders,
  FiChevronDown,
  FiArrowDown,
  FiHome,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const PROPERTY_TYPES = [
  "Single Family",
  "Luxury Condo",
  "Villa",
  "Townhouse",
  "Commercial",
];

const PRICE_RANGES = ["$500k - $1M", "$1M - $2M", "$2M - $5M", "$5M+"];

const SORT_OPTIONS = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
];

// How many extra viewport-heights of scrolling to keep the section pinned
// AFTER the video reaches its last frame, before releasing to the next
// section. 1 = one extra "scroll" worth of hold, 2 = two, etc.
const EXTRA_HOLD_SCROLLS = 2;

export default function Hero({ ready = false }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const headlineRef = useRef(null);
  const searchBarRef = useRef(null);

  const [videoMetaReady, setVideoMetaReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

 const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 1) {
      setVideoMetaReady(true);
      return;
    }

    const onMeta = () => setVideoMetaReady(true);
    video.addEventListener("loadedmetadata", onMeta);
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  // ---- Create the scroll-scrubbed pin ONLY once both conditions are true:
  //   1. `ready` — the preloader/page-transition has finished (layout final)
  //   2. `videoMetaReady` — we know the real video duration
  // This is the key fix: nothing here runs until the page is in its final,
  // settled state, so GSAP measures the correct start position from the start.
  useEffect(() => {
    if (!ready || !videoMetaReady) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let st;
    let rafId;

    // Defer one extra frame: guarantees any exit-animation on the preloader
    // (opacity/transform cleanup, unmount, etc.) has actually committed to
    // the DOM before GSAP measures anything.
    rafId = requestAnimationFrame(() => {
      video.pause();

      // Distance over which the video itself scrubs from frame 0 to its
      // last frame.
      const videoScrollDistance = Math.max(
        (video.duration || 8) * 180,
        window.innerHeight * 1.5
      );
      // Extra distance the section stays pinned AFTER the video has
      // finished, holding on the last frame, before releasing to the next
      // section.
      const holdDistance = window.innerHeight * EXTRA_HOLD_SCROLLS;
      const totalDistance = videoScrollDistance + holdDistance;

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalDistance}`,
        pin: true,
        pinType: "fixed", // avoid GSAP silently switching to "transform"
        anticipatePin: 1, // removes the little snap/gap right as pinning engages
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!video.duration) return;
          // self.progress runs 0→1 across the WHOLE pin (video + hold).
          // Rescale so the video reaches its last frame once we're through
          // the video-scrub portion, then clamp — the remaining scroll
          // distance just holds on that last frame while still pinned.
          const scrolledPx = self.progress * totalDistance;
          const videoProgress = Math.min(scrolledPx / videoScrollDistance, 1);
          const targetTime = videoProgress * video.duration;
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
          }
        },
      });

      // Force a fresh measurement now that we're sure layout is final.
      ScrollTrigger.refresh();
    });

    // Belt-and-suspenders: fonts/images finishing late can still change
    // page height after this point, so refresh once more on full load.
    const onWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onWindowLoad);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onWindowLoad);
      st && st.kill();
    };
  }, [ready, videoMetaReady]);

  // ---- Entrance animation (headline + search bar) ------------------------
  useEffect(() => {
    if (!ready) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      headlineRef.current,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.9 }
    ).fromTo(
      searchBarRef.current,
      { autoAlpha: 0, y: 32 },
      { autoAlpha: 1, y: 0, duration: 0.8 },
      "-=0.5"
    );
    return () => tl.kill();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#151717] font-['Inter_Tight',sans-serif] text-[#EBEBEB]"
    >

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoMetaReady ? "opacity-100" : "opacity-0"
        }`}
        src="/assets/hero-video.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {!videoMetaReady && (
        <div className="absolute inset-0 bg-[#151717]" aria-hidden="true" />
      )}

      <Navbar />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"
        aria-hidden="true"
      />

      <div
        ref={headlineRef}
        className="relative z-10 flex h-full flex-col items-start justify-center px-6 sm:px-12 lg:px-20"
      >
        <h1 className="max-w-auto text-5xl leading-[1.05] font-accent-light tracking-tight uppercase sm:text-[80px] lg:text-[160px]">
          Origin
        </h1>
        <p className="mt-5 max-w-md text-lg font-light text-[#EBEBEB]/80 sm:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        </p>
      </div>

      <div
        ref={searchBarRef}
        className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 sm:px-8 sm:pb-10 lg:px-20"
      >
        <div className="mx-auto max-w-6xl border border-white/15 bg-[#2F2F2F]/70 backdrop-blur-lg glass">
          <div className="flex flex-col divide-y divide-white/10 lg:flex-row lg:divide-x lg:divide-y-0">
            <Field icon={<FiMapPin size={18} className="text-[#FFFFFF]" />}>
              <input
                type="text"
                placeholder="City, neighborhood, or zip code"
                className="w-full bg-transparent text-sm text-[#EBEBEB] placeholder:text-[#EBEBEB]/50 focus:outline-none"
              />
            </Field>

            <Field icon={<FiHome size={18} className="text-[#FFFFFF]" />}>
              <SelectField
                label="Property type"
                options={PROPERTY_TYPES}
                isOpen={activeDropdown === "property-type"}
                onToggle={() => toggleDropdown("property-type")}
                onClose={() => setActiveDropdown(null)}
              />
            </Field>

            <Field icon={null}>
              <SelectField
                label="Price range"
                options={PRICE_RANGES}
                isOpen={activeDropdown === "price-range"}
                onToggle={() => toggleDropdown("price-range")}
                onClose={() => setActiveDropdown(null)}
              />
            </Field>

            <Field icon={<FiArrowDown size={18} className="text-[#FFFFFF]" />}>
              <SelectField
                label="Sort by"
                options={SORT_OPTIONS}
                isOpen={activeDropdown === "sort-by"}
                onToggle={() => toggleDropdown("sort-by")}
                onClose={() => setActiveDropdown(null)}
              />
            </Field>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center justify-center gap-2 px-5 py-4 text-sm text-[#EBEBEB]/80 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFFFF] lg:w-auto"
            >
              <FiSliders size={18} className="text-[#FFFFFF]" />
              Filters
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#FFFFFF] px-8 py-4 text-sm font-medium text-[#151717] transition-colors hover:bg-[#FFFFFF]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
            >
              <FiSearch size={18} />
              Search Properties
            </button>
          </div>

          {filtersOpen && (
            <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-4">
              {["Bedrooms", "Bathrooms", "Pool", "Garage", "Waterfront"].map(
                (amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    className="border border-white/20 px-4 py-2 text-xs text-[#EBEBEB]/80 transition-colors hover:border-[#FFFFFF] hover:text-[#FFFFFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFFFF]"
                  >
                    {amenity}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ icon, children }) {
  return (
    <div className="flex flex-1 items-center gap-3 px-5 py-4">
      {icon}
      <div className="w-full">{children}</div>
    </div>
  );
}

function SelectField({ label, options, isOpen, onToggle, onClose }) {
  const [value, setValue] = useState("");

  return (
<div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm text-[#EBEBEB] focus:outline-none"
      >
        <span className={value ? "text-[#EBEBEB]" : "text-[#EBEBEB]/50"}>
          {value || label}
        </span>
        <FiChevronDown
          size={16}
          className={`shrink-0 text-[#EBEBEB]/50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

{isOpen && (
        <ul className="absolute bottom-full left-0 z-30 mb-3 w-56 border border-white/15 bg-[#2F2F2F] py-1 shadow-xl">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  setValue(option);
                  onClose();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-[#EBEBEB]/80 transition-colors hover:bg-white/10 hover:text-[#FFFFFF]"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}