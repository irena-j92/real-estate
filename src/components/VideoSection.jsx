import { useRef, useState } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
const image = "/assets/videosection-1.jpg";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const video = useRef(null);
  const toggle = () => {
    if (playing) {
      video.current?.pause();
      setPlaying(false);
    } else {
      const el = video.current;
      if (el) {
        el.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    }
  };
  return (
    <section className="film-section" aria-label="A glimpse of home">
      <img
        src={image}
        alt="Modern home with an open terrace and a garden"
        loading="lazy"
      />
      <video
        ref={video}
        src="/assets/hero-video.mp4"
        muted
        playsInline
        loop
        preload="none"
        style={{ opacity: playing ? 1 : 0 }}
        aria-hidden="true"
      />
      <div className="site-container film-content">
        <div data-reveal>
          <p className="section-kicker">Space for what matters</p>
          <h2 className="section-title">
            Not just a new address.
            <br />
            <em>A new way of living.</em>
          </h2>
        </div>
        <button
          className="film-play"
          type="button"
          onClick={toggle}
          aria-pressed={playing}
        >
          <span>{playing ? <FiPause size={19} /> : <FiPlay size={19} />}</span>
          {playing ? "Pause the film" : "A glimpse of home"}
        </button>
      </div>
    </section>
  );
}
