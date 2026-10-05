import Button from "./ui/Button";

export default function AboutSection() {
  return (
    <section id="about" className="premium-section intro-section">
      <div className="site-container intro-layout">
        <div data-reveal>
          <p className="section-kicker">01 / Our perspective</p>
          <p className="intro-signature">
            Rooted here.
            <br />
            Connected everywhere.
          </p>
        </div>
        <div>
          <h2 data-reveal className="intro-title">
            A home is more than a place.
            <br />
            It’s the beginning of <em>your next chapter.</em>
          </h2>
          <div data-reveal className="intro-bottom">
            <p className="body-copy">
              From the Catalina Foothills to the heart of Tucson, we bring local
              understanding and a personal approach to every move. Because the
              right home starts with someone who understands you.
            </p>
            <Button as="a" href="#experts" variant="outline">
              Meet your people
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
