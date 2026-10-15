import { sitePath } from "../lib/sitePath.js";
import MotionImage from "./ui/MotionImage";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import Button from "./ui/Button";
export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "+1", message: "" });
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const receive = event => { setSent(false); setForm(current => ({ ...current, message: event.detail })); };
    window.addEventListener("realty-inquiry", receive);
    return () => window.removeEventListener("realty-inquiry", receive);
  }, []);
  const change = field => event => setForm(current => ({ ...current, [field]: event.target.value }));
  return <section id="contact" className="contact-section contact-reference" aria-labelledby="contact-title">
    <MotionImage className="contact-background" src={sitePath("/assets/contact-img.jpg")} alt="" loading="lazy" aria-hidden="true" />
    <div className="contact-reference-layout">
      <h2 id="contact-title" data-reveal>CONTACT US</h2>
      <div className="contact-form" data-reveal>
        <h3>SEND US A MESSAGE</h3>
        <p>Connect with your Sunter adviser, or start your next chapter here.</p>
        {sent ? <div className="contact-success" role="status">
          <h4>Your message is ready.</h4>
          <p>This portfolio concept demonstrates the inquiry experience. Messages are not sent to a brokerage.</p>
          <Button variant="outline-dark" onClick={() => setSent(false)}>Back to your message</Button>
        </div> : <form onSubmit={event => { event.preventDefault(); setSent(true); }}>
          <Field id="name" label="Name" placeholder="Your full name" value={form.name} onChange={change("name")} required />
          <Field id="email" label="Email" type="email" placeholder="Your email address" value={form.email} onChange={change("email")} required />
          <div className="contact-field contact-phone">
            <label htmlFor="phone">Phone</label>
            <div className="contact-phone-row">
              <select aria-label="Phone country code" value={form.country} onChange={change("country")}>
                <option value="+1">US / CA +1</option><option value="+44">UK +44</option><option value="+49">DE +49</option><option value="+33">FR +33</option><option value="+385">HR +385</option><option value="+387">BA +387</option>
              </select>
              <input id="phone" type="tel" value={form.phone} onChange={change("phone")} placeholder="Phone number" autoComplete="tel-national" />
            </div>
          </div>
          <div className="contact-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows={4} value={form.message} onChange={change("message")} placeholder="Your message here" required />
          </div>
          <Button type="submit" variant="yellow" className="contact-send">SEND <FiArrowRight strokeWidth={1} aria-hidden="true" /></Button>
        </form>}
      </div>
    </div>
  </section>;
}
function Field({ id, label, type = "text", placeholder, value, onChange, required }) {
  return <div className="contact-field"><label htmlFor={id}>{label}</label><input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} autoComplete={id === "name" ? "name" : "email"} /></div>;
}
