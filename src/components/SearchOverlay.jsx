import { useState } from "react";
import { properties } from "../data/properties";
export const SEARCH_TABS = [
  "Find A Home",
  "Sell My Home",
  "Home Value Calculator",
];
export function searchHomes({
  location = "",
  type = "Any type",
  price = "Any price",
}) {
  const query = location.trim().toLowerCase();
  return properties.filter((p) => {
    const amount = Number(p.price.replace(/[^0-9]/g, ""));
    const propertyType = p.title.includes("Estate")
      ? "Estate"
      : "Single Family";
    return (
      (!query || `${p.title} ${p.address}`.toLowerCase().includes(query)) &&
      (type === "Any type" || type === propertyType) &&
      (price === "Any price" ||
        (price === "$500k – $1M" && amount >= 500000 && amount < 1000000) ||
        (price === "$1M – $2M" && amount >= 1000000 && amount < 2000000) ||
        (price === "$2M+" && amount >= 2000000))
    );
  });
}
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  autoComplete,
}) {
  return (
    <div className="search-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}
function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="search-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
export default function SearchOverlay({ onNavigate }) {
  const [tab, setTab] = useState(SEARCH_TABS[0]);
  const [find, setFind] = useState({
    location: "",
    type: "Any type",
    price: "Any price",
  });
  const [seller, setSeller] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    note: "",
  });
  const [valuation, setValuation] = useState({
    address: "",
    timeline: "0–3 months",
  });
  const [results, setResults] = useState(null);
  const change = (setter, field) => (e) =>
    setter((v) => ({ ...v, [field]: e.target.value }));
  const draft = (e) => {
    e.preventDefault();
    const detail =
      tab === SEARCH_TABS[1]
        ? `Seller inquiry from ${seller.name}\nEmail: ${seller.email}\nPhone: ${seller.phone}\nProperty: ${seller.address}, ${seller.city} ${seller.zip}\n${seller.note}`
        : `I'd like a home valuation for ${valuation.address}. Selling timeline: ${valuation.timeline}.`;
    window.dispatchEvent(new CustomEvent("realty-inquiry", { detail }));
    onNavigate("#contact");
  };
  return (
    <div className="search-overlay-content">
      <p className="drawer-eyebrow">Your next chapter starts here</p>
      <h2 id="search-heading">
        Find your <em>place.</em>
      </h2>
      <div
        className="search-tabs"
        role="tablist"
        aria-label="Property search options"
      >
        {SEARCH_TABS.map((label, i) => (
          <button
            id={`search-tab-${i}`}
            key={label}
            role="tab"
            type="button"
            aria-selected={tab === label}
            aria-controls="search-tab-panel"
            tabIndex={tab === label ? 0 : -1}
            onClick={() => setTab(label)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                setTab(SEARCH_TABS[next]);
                document.getElementById(`search-tab-${next}`)?.focus();
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        id="search-tab-panel"
        role="tabpanel"
        aria-labelledby={`search-tab-${SEARCH_TABS.indexOf(tab)}`}
      >
        {tab === SEARCH_TABS[0] && (
          <>
            <form
              className="search-form"
              aria-label="Property search"
              onSubmit={(e) => {
                e.preventDefault();
                setResults(searchHomes(find));
              }}
            >
              <Field
                id="search-location"
                label="Location"
                value={find.location}
                onChange={change(setFind, "location")}
                placeholder="Tucson, Catalina Foothills…"
              />
              <div className="search-field-row">
                <SelectField
                  id="search-type"
                  label="Property Type"
                  value={find.type}
                  onChange={change(setFind, "type")}
                  options={[
                    "Any type",
                    "Single Family",
                    "Condo",
                    "Estate",
                    "Land",
                  ]}
                />
                <SelectField
                  id="search-price"
                  label="Price Range"
                  value={find.price}
                  onChange={change(setFind, "price")}
                  options={["Any price", "$500k – $1M", "$1M – $2M", "$2M+"]}
                />
              </div>
              <button className="search-submit" type="submit">
                Search homes
              </button>
            </form>
            {results !== null && (
              <div className="search-results">
                <p role="status">
                  {results.length
                    ? `${results.length} illustrative ${results.length === 1 ? "residence" : "residences"} found`
                    : "No homes match these details. Try a wider search."}
                </p>
                {results.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("realty-select-property", {
                          detail: p.id,
                        }),
                      );
                      onNavigate("#trending");
                    }}
                  >
                    <span>
                      {p.title}
                      <small>{p.address}</small>
                    </span>
                    <strong>{p.price}</strong>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        {tab === SEARCH_TABS[1] && (
          <form
            className="search-form"
            aria-label="Seller inquiry"
            onSubmit={draft}
          >
            <div className="search-field-row">
              <Field
                id="s-name"
                label="Full Name"
                value={seller.name}
                onChange={change(setSeller, "name")}
                required
                autoComplete="name"
              />
              <Field
                id="s-email"
                label="Email"
                type="email"
                value={seller.email}
                onChange={change(setSeller, "email")}
                required
                autoComplete="email"
              />
            </div>
            <Field
              id="s-phone"
              label="Phone Number"
              type="tel"
              value={seller.phone}
              onChange={change(setSeller, "phone")}
              autoComplete="tel"
            />
            <Field
              id="s-address"
              label="Property Address"
              value={seller.address}
              onChange={change(setSeller, "address")}
              autoComplete="street-address"
            />
            <div className="search-field-row">
              <Field
                id="s-city"
                label="City"
                value={seller.city}
                onChange={change(setSeller, "city")}
                autoComplete="address-level2"
              />
              <Field
                id="s-zip"
                label="ZIP Code"
                value={seller.zip}
                onChange={change(setSeller, "zip")}
                autoComplete="postal-code"
              />
            </div>
            <div className="search-field">
              <label htmlFor="s-note">Short Note</label>
              <textarea
                id="s-note"
                rows={3}
                value={seller.note}
                onChange={change(setSeller, "note")}
              />
            </div>
            <button className="search-submit" type="submit">
              Prepare seller inquiry
            </button>
          </form>
        )}
        {tab === SEARCH_TABS[2] && (
          <form
            className="search-form"
            aria-label="Home value calculator"
            onSubmit={draft}
          >
            <Field
              id="v-address"
              label="Property Address"
              value={valuation.address}
              onChange={change(setValuation, "address")}
              placeholder="123 Placita del Conejo, Tucson"
              required
              autoComplete="street-address"
            />
            <SelectField
              id="v-timeline"
              label="Selling Timeline"
              value={valuation.timeline}
              onChange={change(setValuation, "timeline")}
              options={[
                "0–3 months",
                "3–6 months",
                "6–12 months",
                "Just curious",
              ]}
            />
            <p className="search-help">
              A home’s value deserves a local perspective. Share your details to
              prepare a valuation inquiry.
            </p>
            <button className="search-submit" type="submit">
              Prepare valuation request
            </button>
          </form>
        )}
      </div>
      <p className="search-disclosure">
        Portfolio preview. Listings are illustrative. Inquiries are prepared
        locally; no messages are sent.
      </p>
    </div>
  );
}
