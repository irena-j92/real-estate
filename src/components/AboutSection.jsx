import ChapterTitle from "./experience/ChapterTitle";
export default function AboutSection() {
  return (
    <section id="about" className="premium-section intro-section">
      <div className="site-container">
        <div className="chapter-topline" data-reveal>
          <p className="section-kicker">01 / A sense of place</p>
          <span className="micro-label">This is where your story begins.</span>
        </div>
        <div className="intro-composition">
          <div data-reveal>
            <ChapterTitle
              lines={[
                { text: "Some places" },
                { text: "change everything.", italic: true },
              ]}
            />
            <div className="intro-bottom">
              <p className="body-copy">
                A quiet morning. A view that stays with you. Room for the life
                you imagined. We believe finding a home is about recognizing a
                feeling.
              </p>
              <a className="text-link" href="#experts">
                Find your kind of people
              </a>
            </div>
          </div>
          <figure className="intro-image" data-reveal data-image-reveal>
            <img
              data-parallax
              src="/assets/posts-2.jpg"
              alt="A contemporary home opening onto a sunlit terrace"
              loading="lazy"
            />
            <figcaption>Architecture for a life well lived.</figcaption>
          </figure>
        </div>
        <div className="intro-footnote" data-reveal>
          <span>Rooted in Southern Arizona.</span>
          <p>
            From the foothills to the heart of Tucson, our perspective is
            personal. Your next chapter should be, too.
          </p>
          <span className="intro-star" aria-hidden="true">
            ✳
          </span>
        </div>
      </div>
    </section>
  );
}
