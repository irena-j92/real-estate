import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from "react-icons/fi";
import { offerServices } from "../data/offerServices";
import Button from "./ui/Button";
import Container from "./ui/Container";

const AUTO_SECONDS = 7;

export default function WhatWeOffer() {
  const [index, setIndex] = useState(0);
  const barRef = useRef(null);
  const imgWrapRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.killTweensOf(barRef.current);
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: AUTO_SECONDS,
        ease: "none",
        transformOrigin: "left",
        onComplete: () => setIndex((i) => (i + 1) % offerServices.length),
      }
    );
  }, [index]);

  useEffect(() => {
    if (!imgWrapRef.current) return;
    gsap.fromTo(
      imgWrapRef.current,
      { opacity: 0.3, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [index]);

  const service = offerServices[index];
  const goTo = (dir) =>
    setIndex((i) => (i + dir + offerServices.length) % offerServices.length);

  return (
    <section id="offer" className="bg-[#141721] py-[100px] text-white md:py-[150px]">
      <Container className="px-6 md:px-20">
        <h2 className="mb-16 text-[40px] font-semibold leading-tight md:text-[56px]">
          What We Offer
        </h2>

        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div ref={imgWrapRef} className="overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="h-[360px] w-full object-cover md:h-[460px]"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm text-white/40">{service.number}</span>
            <h3 className="font-accent-italic mt-4 text-5xl">
              {service.title}
            </h3>
            <p className="mt-6 max-w-md text-white/65">
              {service.description}
            </p>
            <div className="mt-10">
              <Button variant="yellow" icon={<FiArrowUpRight />} className="w-fit">
                Get Started
              </Button>
            </div>

            <div className="mt-14">
              <div className="h-px w-full overflow-hidden bg-white/15">
                <div
                  ref={barRef}
                  className="h-full origin-left bg-yellow"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  aria-label="Previous service"
                  className="flex h-10 w-10 items-center justify-center border border-white/25 hover:border-yellow hover:text-yellow"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  aria-label="Next service"
                  className="flex h-10 w-10 items-center justify-center border border-white/25 hover:border-yellow hover:text-yellow"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
