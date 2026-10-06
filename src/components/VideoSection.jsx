import { useEffect, useRef, useState } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
export default function VideoSection() {
  const [playing, setPlaying] = useState(false),
    video = useRef(null),
    root = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.current?.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.05 },
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const toggle = () => {
    if (playing) {
      video.current?.pause();
      setPlaying(false);
    } else
      video.current
        ?.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
  };
  return (
    <section className="film-section" ref={root}>
      <img
        data-parallax
        src="/assets/videosection-1.jpg"
        alt="Open living spaces and garden views at a modern residence"
        loading="lazy"
      />
      <video
        ref={video}
        src="/assets/hero-video.mp4"
        muted
        loop
        playsInline
        preload="none"
        style={{ opacity: playing ? 1 : 0 }}
        aria-hidden="true"
      />
      <div className="film-scrim" />
      <div className="film-top">
        <span>More than a property.</span>
        <span>Something unmistakably yours.</span>
      </div>
      <div className="film-content" data-reveal>
        <h2>
          Room to
          <br />
          <em>be you.</em>
        </h2>
        <button
          className="film-play"
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          data-cursor={playing ? "PAUSE" : "PLAY"}
        >
          <span>{playing ? <FiPause size={20} /> : <FiPlay size={20} />}</span>
          <small>{playing ? "Pause the film" : "A glimpse of home"}</small>
        </button>
      </div>
      <div className="film-bottom">
        <span>Space. Light. Possibility.</span>
        <span>A new way of living.</span>
      </div>
    </section>
  );
}
