import HoverControl from "./ui/HoverControl";
import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { posts } from "../data/posts";
const reads = [
  "Start with the rhythms of your day: the route to work, the places you spend weekends, and the kind of space that makes you feel at ease. In the Foothills, a property's orientation, elevation, and relationship to the landscape can be as important as its floor plan. Visit at different times of day, notice the light, and take time to explore the surrounding streets. Your adviser can help you ask the right questions about access, upkeep, and the details behind a beautiful view.",
  "Desert modern design begins with the landscape. Deep overhangs frame the views, shaded courtyards create outdoor rooms, and restrained materials allow the surroundings to take center stage. When exploring a home, look beyond the first impression. Consider how it handles afternoon light, where the shade falls, and how the living spaces connect to the outdoors. The most inviting architecture feels beautiful and comfortable in equal measure.",
  "Getting to know a city begins one neighborhood at a time. Walk the streets, visit local cafes, and map the everyday destinations that matter to you. A lively urban block and a quiet foothills setting can offer very different versions of life in the same city. Share what your ideal week looks like with your adviser. Those small preferences often reveal more about the right place than a list of bedrooms and square feet.",
];
export default function BlogSection() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    if (selected === null) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll(
          'a[href], button, input, textarea, [tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selected]);
  return (
    <section id="journal" className="premium-section journal-section">
      <div className="site-container">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-kicker">06 / The local edit</p>
            <h2 className="section-title">Latest Posts</h2>
          </div>
        </div>
        <div className="journal-layout journal-grid">
          {posts.map((post, index) => (
            <article data-reveal key={post.id} className="journal-card">
              <HoverControl as="button"
                className="journal-card-image"
                data-cursor="READ"
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Read ${post.title}`}
              >
                <img src={post.image} alt={post.title} loading="lazy" />
              </HoverControl>
              <p className="eyebrow">{post.date}</p>
              <h3>{post.title}</h3>
              <p className="journal-card-description">{post.description}</p>
              <HoverControl as="button"
                className="text-link"
                type="button"
                onClick={() => setSelected(index)}
              >
                Read the story
              </HoverControl>
            </article>
          ))}
        </div>
      </div>
      {selected !== null && (
        <div className="journal-modal" onClick={() => setSelected(null)}>
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-title"
            className="journal-dialog view-enter"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelected(null);
            }}
          >
            <HoverControl as="button"
              autoFocus
              className="icon-button"
              type="button"
              aria-label="Close article"
              onClick={() => setSelected(null)}
            >
              <FiX />
            </HoverControl>
            <p className="section-kicker">{posts[selected].date}</p>
            <h2 id="article-title" className="section-title">
              {posts[selected].title}
            </h2>
            <p className="body-copy">{reads[selected]}</p>
            <HoverControl as="a"
              className="text-link"
              href="#contact"
              onClick={() => setSelected(null)}
            >
              Talk to a local adviser
            </HoverControl>
          </div>
        </div>
      )}
    </section>
  );
}
