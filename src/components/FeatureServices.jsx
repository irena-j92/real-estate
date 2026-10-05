import { FiArrowUpRight } from "react-icons/fi";
import Button from "./ui/Button";
import Container from "./ui/Container";

const CARDS = [
  {
    title: "Quick Buy",
    description:
      "A competitive cash offer on qualifying homes within 48 hours — move on your own timeline.",
  },
  {
    title: "Communities",
    description:
      "Deep, block-by-block knowledge of Southern Arizona neighborhoods, schools, and HOAs.",
  },
  {
    title: "Mortgage",
    description:
      "In-house lending partners for pre-approval, rate locks, and transparent closing costs.",
  },
];

const NIGHT_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80";

export default function FeatureServices() {
  return (
    <section className="relative isolate flex min-h-[820px] items-center overflow-hidden py-24">
      <img
        src={NIGHT_IMAGE}
        alt="A modern home glowing at dusk beneath a deep blue sky"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-dark/55" />

      <Container className="relative px-6 md:px-20">
        <div className="grid gap-8 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              data-reveal className="glass flex h-[420px] flex-col justify-between p-8 text-white md:h-[580px]"
            >
              <div>
                <h3 className="font-accent-italic text-4xl">{card.title}</h3>
                <p className="mt-6 text-white/75">{card.description}</p>
              </div>
              <Button variant="yellow" icon={<FiArrowUpRight />} className="w-fit">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
