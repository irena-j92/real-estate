import { FiArrowUpRight } from "react-icons/fi";
import Button from "./ui/Button";
import Container from "./ui/Container";

const CARDS = [
  {
    title: "Market Trends",
    description:
      "Quarterly data on pricing, inventory, and days-on-market across every Southern Arizona submarket.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Luxury Digital Magazine",
    description:
      "Editorial features on the region's most distinctive properties, design stories, and agent spotlights.",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-white py-[100px] md:py-[150px]">
      <Container className="px-6 md:px-20">
        <div className="grid gap-10 md:grid-cols-2">
          {CARDS.map((card) => (
            <article key={card.title} data-reveal className="group relative">
              <div className="overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="h-[340px] w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                />
              </div>
              <div className="border border-t-0 border-dark/10 p-8">
                <h3 className="text-2xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm text-dark/60">{card.description}</p>
                <Button
                  variant="outline-dark"
                  icon={<FiArrowUpRight />}
                  className="mt-6 w-fit"
                >
                  Read More
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
