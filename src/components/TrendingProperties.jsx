import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiChevronLeft, FiChevronRight, FiGrid, FiCircle, FiArrowUpRight } from "react-icons/fi";
import { properties } from "../data/properties";
import Button from "./ui/Button";
import Container from "./ui/Container";

const AUTO_ADVANCE_SECONDS = 6;

function SingleView({ index, setIndex }) {
  const property = properties[index];
  const barRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.killTweensOf(barRef.current);
    gsap.set(barRef.current, { scaleY: 0 });
    tlRef.current = gsap.to(barRef.current, {
      scaleY: 1,
      duration: AUTO_ADVANCE_SECONDS,
      ease: "none",
      transformOrigin: "top",
      onComplete: () => setIndex((i) => (i + 1) % properties.length),
    });
    return () => tlRef.current?.kill();
  }, [index, setIndex]);

  const goTo = (dir) => {
    setIndex((i) => (i + dir + properties.length) % properties.length);
  };

  return (
    <div className="grid gap-10 md:grid-cols-[80px_1fr] md:gap-16">
      <div className="hidden flex-col items-center gap-6 md:flex">
        <div className="relative h-[510px] w-[2px] overflow-hidden bg-dark/10">
          <div
            ref={barRef}
            className="absolute inset-0 origin-top bg-yellow"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous property"
            className="flex h-10 w-10 items-center justify-center border border-dark/20 transition-colors hover:border-dark"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next property"
            className="flex h-10 w-10 items-center justify-center border border-dark/20 transition-colors hover:border-dark"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden">
          <img
            key={property.id}
            src={property.image}
            alt={property.title}
            className="h-[420px] w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
<div id="sale-tag" className="inline-flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-green-500" />
  <span className="text-[10px] font-semibold uppercase tracking-wider text-dark">
    {property.tag}
  </span>
</div>
          <p className="mt-6 text-[44px] font-accent-light leading-none md:text-[60px]">
            {property.price}
          </p>
          <p className="mt-3 text-dark/60">{property.address}</p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <FeatureCard label="Bedrooms" value={property.beds} />
            <FeatureCard label="Bathrooms" value={property.baths} />
            <FeatureCard label="Sq. Ft." value={property.sqft} />
          </div>

          <div className="mt-10 grid grid-row gap-2">
            <Button variant="outline-dark">Request Showing</Button>
            <Button variant="yellow">Start Offer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ label, value }) {
  return (
    <div className="border border-dark/10 px-4 py-4 text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-dark/50">
        {label}
      </p>
    </div>
  );
}

function GridView() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {properties.map((property) => (
        <article
          key={property.id}
          data-reveal
          className="group overflow-hidden bg-white"
        >
          <div className="overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              loading="lazy"
              className="h-[280px] w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
            />
          </div>
          <div className="p-6">
<div id="sale-tag" className="inline-flex items-center gap-2">
  <span className="text-[12px] px-2 py-1 bg-green-500/50 font-medium uppercase tracking-wider text-dark">
    {property.tag}
  </span>
</div>

            <p className="mt-4 text-3xl font-accent-light">{property.price}</p>
            <p className="mt-1 text-sm text-dark/60">{property.address}</p>
            <p className="mt-3 text-sm text-dark/50 text-transform: capitalize">
              {property.beds} bd · {property.baths} ba · {property.sqft} sqft
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function TrendingProperties() {
  const [view, setView] = useState("single");
  const [index, setIndex] = useState(0);

  return (
    <section id="trending" className="bg-light py-[100px] md:py-[150px]">
      <Container className="px-6 md:px-20">
        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-[56px] font-accent-light uppercase font-normal leading-none md:text-[100px]">
            New Listings
          </h2>

          <div id="btns" className="gap-2 flex inline-flex">
          <button
            type="button"
            onClick={() => setView((v) => (v === "single" ? "grid" : "single"))}
            aria-label={
              view === "single" ? "Switch to grid view" : "Switch to single view"
            }
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center border border-dark transition-transform hover:scale-105"
          >
            {view === "single" ? (
              <FiGrid size={26} />
            ) : (
              <FiCircle size={26} />
            )}
          </button>
            <Button variant="yellow" icon={<FiArrowUpRight />}>
            View All
          </Button>
          </div>
        </div>

        {view === "single" ? (
          <SingleView index={index} setIndex={setIndex} />
        ) : (
          <GridView />
        )}
      </Container>
    </section>
  );
}
