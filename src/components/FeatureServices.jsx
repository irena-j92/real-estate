import { FiPlus } from "react-icons/fi";

const services = [
  {
    title: "Find your place",
    description:
      "The right neighborhood. The right feeling. Discover homes that fit the way you want to live.",
    link: "#trending",
  },
  {
    title: "Make your next move",
    description:
      "Thoughtful preparation, considered pricing, and a clear plan for bringing your home to market.",
    link: "#contact",
  },
  {
    title: "Settle in with confidence",
    description:
      "From financing to the final keys, find support for all the details that make a move feel effortless.",
    link: "#offer",
  },
];

export default function FeatureServices() {
  return (
    <section id="services" className="premium-section services-section">
      <div className="site-container services-layout">
        <div data-reveal className="services-intro">
          <p className="section-kicker">03 / A considered approach</p>
          <h2 className="section-title">
            Every move.
            <br />
            <em>Made personal.</em>
          </h2>
          <p className="body-copy">
            A little less uncertainty. A lot more possibility. Wherever you are
            in the journey, we’ll meet you there.
          </p>
          <a href="#contact" className="text-link">
            Let’s talk about your move
          </a>
        </div>
        <div>
          {services.map((service, i) => (
            <article data-reveal key={service.title} className="service-row">
              <span className="service-number">0{i + 1}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <a href={service.link} aria-label={service.title}>
                <FiPlus size={21} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
