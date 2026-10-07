export default function AboutSection() {
  return (
    <section id="about" className="intro-section architectural-manifesto">
      <div className="manifesto-backdrop" aria-hidden="true">
        <img src="/assets/properties-4.jpg" alt="" loading="lazy" />
      </div>
      <div className="manifesto-content">
        <p className="section-kicker" data-reveal>
          01 / A sense of place
        </p>
        <h2 className="manifesto-statement" data-reveal>
          A home is more than <em>architecture.</em> It’s the light in the
          morning. The space to gather. A landscape that becomes part of you. We
          bring a <em>local perspective</em> to the places you’ll call home.
        </h2>
        <div className="manifesto-footer" data-reveal>
          <a className="premium-button" data-variant="yellow" href="#experts">
            Meet your local perspective
          </a>
          <p>
            Rooted in Tucson.
            <br />
            Connected to your next chapter.
          </p>
        </div>
      </div>
      <span className="manifesto-coordinate" aria-hidden="true">
        SOUTHERN ARIZONA / A LIFE WELL LIVED
      </span>
    </section>
  );
}
