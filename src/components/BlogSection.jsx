import { FiArrowUpRight } from "react-icons/fi";
import { posts } from "../data/posts";
import Button from "./ui/Button";
import Container from "./ui/Container";

export default function BlogSection() {
  return (
    <section id="journal" className="bg-white py-[100px] md:py-[150px]">
      <Container className="px-6 md:px-20">
        <h2 className="mb-16 text-[40px] font-semibold md:text-[56px]">
          Latest Posts
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} data-reveal className="flex flex-col">
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-[220px] w-full object-cover transition-transform duration-700 ease-cinematic hover:scale-105"
                />
              </div>
              <p className="mt-6 text-xs uppercase tracking-wider text-dark/40">
                {post.date}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug">
                {post.title}
              </h3>
              <p className="mt-3 text-sm text-dark/60">{post.description}</p>
              <Button
                variant="outline-dark"
                icon={<FiArrowUpRight />}
                className="mt-6 w-fit"
              >
                Get Started
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
