import { useEffect, useState } from "react";
import Button from "./ui/Button";
export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const receive = (e) => {
      setSent(false);
      setForm((f) => ({ ...f, message: e.detail }));
    };
    window.addEventListener("realty-inquiry", receive);
    return () => window.removeEventListener("realty-inquiry", receive);
  }, []);
  const change = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section id="contact" className="premium-section contact-section">
      <div className="site-container contact-layout">
        <div data-reveal className="contact-intro">
          <p className="section-kicker">07 / It starts with a conversation</p>
          <h2 className="section-title">
            Your next chapter
            <br />
            <em>starts here.</em>
          </h2>
          <p className="body-copy">
            A first home. A fresh start. A little more room. Tell us what’s on
            your mind, and let’s explore what comes next.
          </p>
          <div className="contact-small">
            <p>
              <strong>Rooted in Tucson</strong>900 E. River Road
              <br />
              Tucson, Arizona 85718
            </p>
            <p>
              <strong>Here for your next move</strong>Buying · Selling ·
              Relocating
              <br />
              Southern Arizona & beyond
            </p>
          </div>
        </div>
        <div data-reveal className="contact-form">
          <h3>Tell us a little about you.</h3>
          <p>No pressure. Just possibilities.</p>
          {sent ? (
            <div className="contact-success" role="status">
              <h4>Your message is ready.</h4>
              <p>
                This portfolio preview demonstrates the inquiry experience.
                Messages are not sent to a brokerage.
              </p>
              <Button variant="outline" onClick={() => setSent(false)}>
                Back to your message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <Field
                id="name"
                label="Your name"
                value={form.name}
                onChange={change("name")}
                required
              />
              <Field
                id="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={change("email")}
                required
              />
              <Field
                id="phone"
                label="Phone number (optional)"
                type="tel"
                value={form.phone}
                onChange={change("phone")}
                full
              />
              <div className="contact-field full">
                <label htmlFor="message">
                  What does your next chapter look like?
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={change("message")}
                  placeholder="Tell us about the place you’re looking for…"
                />
              </div>
              <div className="form-actions">
                <Button type="submit" variant="yellow">
                  Start the conversation
                </Button>
                <small>
                  We’ll take it one step at a time.
                  <br />
                  This is a portfolio preview.
                </small>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
function Field({ id, label, type = "text", value, onChange, required, full }) {
  return (
    <div className={`contact-field ${full ? "full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={id === "name" ? "name" : id === "email" ? "email" : "tel"}
      />
    </div>
  );
}
