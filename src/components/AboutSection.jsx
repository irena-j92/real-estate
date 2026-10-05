import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";
import Button from "./ui/Button";
import Container from "./ui/Container";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);

  // useGSAP(
  //   () => {
  //     gsap.from(".about-reveal", {
  //       opacity: 0,
  //       y: 40,
  //       duration: 0.9,
  //       stagger: 0.15,
  //       ease: "power3.out",
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 70%",
  //       },
  //     });
  //   },
  //   { scope: sectionRef }
  // );

  return (
    <section
      ref={sectionRef}
      className="bg-[#141721] py-[100px] text-white md:py-[220px] flex flex-inline"
    >
      <p className="px-6 md:px-20 text-nowrap">01 ABOUT US</p>
      <Container className="px-6 md:px-20 ml-60">
        <p className="about-reveal max-w-[820px] font-light text-2xl leading-tight md:text-[32px]">
          Based in Tucson, Long Realty Company is the leading real estate
          brokerage operating in Southern Arizona — a track record built one
          neighborhood at a time.
        </p>
        <p className="about-reveal mt-8 max-w-[760px] text-base text-white/60 md:text-lg">
          Our connections extend beyond Arizona as part of HomeServices of
          America. We're also a member of the Leading Real Estate Companies
          of the World®, giving Long Realty agents strong local roots and
          extensive global reach.
        </p>
        <div className="about-reveal mt-10 md:mt-[60px]">
          <Button
            as="a"
            href="#offer"
            variant="outline"
            // icon={<FiArrowUpRight />}
            className="h-[50px] w-full max-w-[150px] text-base text-nowrap"
          >
            Learn More
          </Button>
        </div>
      </Container>
    </section>
  );
}
