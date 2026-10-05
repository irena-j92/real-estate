import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Button from "./ui/Button";
import Container from "./ui/Container";

const NIGHT_IMAGE =
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=2000&q=80";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="relative isolate min-h-[820px] py-24">
      <img
        src={NIGHT_IMAGE}
        alt="A quiet desert home exterior at night"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-dark/60" />

      <Container className="relative flex h-full flex-col justify-center px-6 md:px-20">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div className="text-white">
            <h2 className="font-accent-italic text-[64px] leading-none md:text-[96px]">
              Contact Us
            </h2>
            <p className="mt-6 max-w-sm text-white/70">
              Whether you're buying, selling, or just curious about the
              market — we're here for a real answer, not a script.
            </p>
          </div>

          <div className="glass p-8 text-white md:p-10">
            <h3 className="text-2xl font-semibold">Send us a message</h3>
            <p className="mt-2 text-sm text-white/60">
              Ask your Long Realty Agent or if you don't have one, submit
              here.
            </p>

            {sent ? (
              <p className="mt-8 bg-white/10 p-6 text-sm">
                Thanks — a Long Realty agent will be in touch shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <Field
                  id="name"
                  label="Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
                <Field
                  id="email"
                  type="email"
                  label="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
                <Field
                  id="phone"
                  type="tel"
                  label="Phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="message" className="text-[11px] uppercase tracking-wider text-white/60">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange("message")}
                    className="resize-none border-b border-white/25 bg-transparent pb-2 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="yellow"
                  icon={<FiArrowRight />}
                  className="mt-2 w-fit"
                >
                  Send
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({ id, label, type = "text", value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[11px] uppercase tracking-wider text-white/60">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="border-b border-white/25 bg-transparent pb-2 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
      />
    </div>
  );
}
