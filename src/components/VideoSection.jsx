import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import Container from "./ui/Container";

const THUMBNAIL =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-[#141721] py-[100px] text-white md:py-[150px]">
      <Container className="px-6 md:px-20">
        <div className="grid gap-10 md:grid-cols-[380px_1fr] md:items-center md:gap-16">
          <div data-reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Watch
            </p>
            <h3 className="mt-4 text-3xl font-semibold leading-snug md:text-4xl">
              A closer look at how we work.
            </h3>
            <p className="mt-4 text-white/60">
              Two minutes with the agents, stagers, and closers behind every
              Long Realty transaction.
            </p>
          </div>

          <div
            data-reveal
            className="group relative aspect-video w-full overflow-hidden"
          >
            <img
              src={THUMBNAIL}
              alt="Preview still of the Long Realty promotional video"
              className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-dark/35 transition-colors duration-500 group-hover:bg-dark/50" />

            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play the Long Realty promotional video"
              className="absolute left-1/2 top-1/2 flex h-24 w-24 rounded-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#2F2F2F]/70 backdrop-blur-lg glass text-dark transition-transform duration-300 hover:scale-110"
              data-magnetic="true"
            >
              <FiPlay size={28} className="ml-1" />
            </button>

            {playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark text-center">
                <p className="max-w-xs px-6 text-sm text-white/70">
                  Video playback placeholder — drop in your production embed
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
