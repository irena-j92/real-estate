import { FiSmartphone } from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Container from "./ui/Container";

const PHONE_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";

export default function LongRealtyApp() {
  return (
    <section className="bg-light py-[100px] md:py-[150px]">
      <Container className="px-6 md:px-20">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div
            data-reveal
            className="relative mx-auto h-[420px] w-[220px] border-8 border-dark bg-dark md:h-[520px] md:w-[260px]"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={PHONE_IMAGE}
                alt="Long Realty mobile app preview showing property listings"
                className="h-full w-full object-cover opacity-90"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-x-0 top-0 flex justify-center pt-2">
              <span className="h-1 w-16 bg-white/40" />
            </div>
          </div>

          <div data-reveal>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-dark/50">
              <FiSmartphone /> Long Realty App
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Your next home, in your pocket.
            </h2>
            <p className="mt-6 max-w-md text-dark/60">
              Save searches, get instant alerts on new listings, and message
              your agent directly — all from the Long Realty app.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#app-store"
                className="flex items-center gap-3 border border-dark px-6 py-3 text-sm font-medium text-dark transition-colors hover:bg-dark hover:text-white"
              >
                <span className="text-xl"><FaApple /></span>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] uppercase text-dark/50 group-hover:text-white/60">
                    Download on the
                  </span>
                  App Store
                </span>
              </a>
              <a
                href="#google-play"
                className="flex items-center gap-3 border border-dark px-6 py-3 text-sm font-medium text-dark transition-colors hover:bg-dark hover:text-white"
              >
                <span className="text-xl"><FaGooglePlay /></span>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] uppercase text-dark/50">
                    Get it on
                  </span>
                  Google Play
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
