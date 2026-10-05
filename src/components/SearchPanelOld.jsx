import { useState } from "react";
import { FiSearch, FiArrowRight, FiHome } from "react-icons/fi";
import Button from "./ui/Button";
import Container from "./ui/Container";

const TABS = ["Find A Home", "Sell My Home", "Home Value Calculator"];

function FindHomeTab() {
  const [values, setValues] = useState({
    location: "",
    type: "Any type",
    price: "Any price",
  });

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8"
      aria-label="Property search"
    >
      <Field
        id="location"
        label="Location"
        placeholder="Tucson, Catalina Foothills…"
        value={values.location}
        onChange={handleChange("location")}
      />
      <SelectField
        id="type"
        label="Property Type"
        value={values.type}
        onChange={handleChange("type")}
        options={["Any type", "Single Family", "Condo", "Estate", "Land"]}
      />
      <SelectField
        id="price"
        label="Price Range"
        value={values.price}
        onChange={handleChange("price")}
        options={["Any price", "$500k – $1M", "$1M – $2M", "$2M+"]}
      />
      <Button type="submit" variant="yellow" icon={<FiSearch />} className="md:mb-1">
        Search
      </Button>
    </form>
  );
}

function SellHomeTab() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    note: "",
  });

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <p className="border border-white/20 bg-white/5 p-6 text-sm text-white">
        Thanks, {values.name.split(" ")[0] || "there"} — a Long Realty agent
        will reach out about {values.address || "your property"} shortly.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 md:grid-cols-3"
      aria-label="Seller inquiry"
    >
      <Field id="s-name" label="Full Name" value={values.name} onChange={handleChange("name")} required />
      <Field id="s-email" type="email" label="Email" value={values.email} onChange={handleChange("email")} required />
      <Field id="s-phone" type="tel" label="Phone Number" value={values.phone} onChange={handleChange("phone")} />
      <Field id="s-address" label="Property Address" value={values.address} onChange={handleChange("address")} />
      <Field id="s-city" label="City" value={values.city} onChange={handleChange("city")} />
      <Field id="s-zip" label="ZIP Code" value={values.zip} onChange={handleChange("zip")} />
      <div className="flex flex-col gap-1 md:col-span-3">
        <label htmlFor="s-note" className="text-[11px] uppercase tracking-wider text-white/60">
          Short Note
        </label>
        <textarea
          id="s-note"
          rows={2}
          value={values.note}
          onChange={handleChange("note")}
          className="resize-none border-b border-white/25 bg-transparent pb-2 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
        />
      </div>
      <div className="md:col-span-3">
        <Button type="submit" variant="yellow" icon={<FiArrowRight />}>
          Submit Inquiry
        </Button>
      </div>
    </form>
  );
}

function ValueCalculatorTab() {
  const [values, setValues] = useState({ address: "", timeline: "0–3 months" });
  const [estimate, setEstimate] = useState(null);

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  // Placeholder valuation logic — swap for a real API call later.
  const handleSubmit = (e) => {
    e.preventDefault();
    const base = 480000;
    const hash = values.address
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const estimated = base + (hash % 40) * 15000;
    setEstimate(estimated);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8"
        aria-label="Home value calculator"
      >
        <Field
          id="v-address"
          label="Property Address"
          value={values.address}
          onChange={handleChange("address")}
          placeholder="123 Placita del Conejo, Tucson"
          required
        />
        <SelectField
          id="v-timeline"
          label="Selling Timeline"
          value={values.timeline}
          onChange={handleChange("timeline")}
          options={["0–3 months", "3–6 months", "6–12 months", "Just curious"]}
        />
        <Button type="submit" variant="yellow" icon={<FiHome />} className="md:mb-1">
          Get Estimate
        </Button>
      </form>

      {estimate && (
        <div className="mt-8 border border-yellow/40 bg-white/5 p-6 text-white">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Estimated Market Value
          </p>
          <p className="mt-2 text-4xl font-semibold text-yellow">
            ${estimate.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-white/40">
            Demo estimate for illustration only — connect a valuation API for
            live figures.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ id, label, type = "text", value, onChange, required, placeholder }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-[11px] uppercase tracking-wider text-white/60">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="border-b border-white/25 bg-transparent pb-2 text-lg text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
      />
    </div>
  );
}

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-[11px] uppercase tracking-wider text-white/60">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="border-b border-white/25 bg-transparent pb-2 text-lg text-white focus:border-yellow focus:outline-none [&>option]:text-dark"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function SearchPanel() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="relative z-30 -mt-40 px-4 md:-mt-[176px] md:px-0">
      <Container className="px-2 md:px-20">
        <div className="glass mx-auto w-full max-w-[1280px] p-6 text-white md:p-10">
          <div className="flex flex-wrap gap-2 border-b border-white/15 pb-6 md:gap-8">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-current={tab === t}
                className={`border px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  tab === t
                    ? "border-yellow bg-yellow text-dark"
                    : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pt-8">
            {tab === "Find A Home" && <FindHomeTab />}
            {tab === "Sell My Home" && <SellHomeTab />}
            {tab === "Home Value Calculator" && <ValueCalculatorTab />}
          </div>
        </div>
      </Container>
    </div>
  );
}
