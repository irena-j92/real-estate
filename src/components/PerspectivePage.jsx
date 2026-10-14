import MotionImage from "./ui/MotionImage";
import { FiArrowRight } from "react-icons/fi";
import AboutSection from "./AboutSection";
import HoverControl from "./ui/HoverControl";

const principles = [
  ["01", "People before property", "We begin with the life you want to lead. Your routines, ambitions, and the things that make a place feel like yours shape every conversation that follows."],
  ["02", "An eye for the meaningful", "We notice the morning light, the thoughtful materials, and the way a room connects to the outdoors. Distinctive architecture matters most when it supports everyday living."],
  ["03", "Clarity at every step", "Good advice should leave you feeling informed. We make space for questions, explain the details, and help you understand the choices in front of you."],
];
export default function PerspectivePage() {
  return <main className="perspective-page">
    <section id="perspective-top" className="perspective-introduction" aria-labelledby="perspective-title">
      <div className="perspective-shell">
        <p className="section-kicker" data-reveal>01 / Our perspective</p>
        <h1 id="perspective-title" data-reveal>A DIFFERENT<br /><em>PERSPECTIVE</em><br />ON HOME.</h1>
        <div className="perspective-opening-copy" data-reveal>
          <p>Sunter Realty is an independent property studio for people who see home as more than an address.</p>
          <p>We bring together an appreciation for architecture, a sense of place, and personal guidance. From the first conversation to the next beginning, our approach is thoughtful, clear, and shaped around you.</p>
        </div>
      </div>
    </section>
    <AboutSection ready companyPage />
    <section className="perspective-principles" id="our-values" aria-labelledby="values-title">
      <div className="perspective-shell">
        <h2 id="values-title" data-reveal>WHAT WE BELIEVE.</h2>
        {principles.map(([number, title, description]) => <article key={number} data-reveal>
          <span>{number}</span><h3>{title}</h3><p>{description}</p>
        </article>)}
      </div>
    </section>
    <section className="perspective-approach" id="our-approach">
      <div className="perspective-shell">
        <MotionImage className="perspective-motion-image" reveal src="/assets/contact-img.jpg" alt="A modern residence with a landscaped garden and warm interior light" loading="lazy" />
        <div data-reveal>
          <p className="section-kicker">A considered approach</p>
          <h2>EVERY MOVE.<br />PERSONALLY CONSIDERED.</h2>
          <p>Buying, selling, or beginning again somewhere new — each move deserves the same care. We connect you with the right people and help you see the possibilities without losing sight of the details.</p>
          <HoverControl as="a" className="text-link" href="/#experts">Meet our experts <FiArrowRight aria-hidden="true" /></HoverControl>
        </div>
      </div>
    </section>
    <section className="perspective-closing">
      <h2 data-reveal>LET’S FIND<br /><em>YOUR NEXT.</em></h2>
      <HoverControl data-reveal as="a" className="text-link" href="/#contact">Start a conversation <FiArrowRight aria-hidden="true" /></HoverControl>
    </section>
  </main>;
}
