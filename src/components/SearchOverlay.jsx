import HoverControl from "./ui/HoverControl";
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
  beds = "Any bedrooms",
  baths = "Any bathrooms",
  sort = "Featured order",
}) {
  const query = location.trim().toLowerCase();
  const matches = properties.filter((p) => {
    const amount = Number(p.price.replace(/[^0-9]/g, ""));
    const propertyType = p.title.includes("Estate")
      ? "Estate"
      : "Single Family";
    return (
      (!query || `${p.title} ${p.address}`.toLowerCase().includes(query)) &&
      (type === "Any type" || type === propertyType) &&
      (beds === "Any bedrooms" || p.beds >= parseInt(beds, 10)) &&
      (baths === "Any bathrooms" || p.baths >= parseInt(baths, 10)) &&
      (price === "Any price" ||
        (price === "$500k – $1M" && amount >= 500000 && amount < 1000000) ||
        (price === "$1M – $2M" && amount >= 1000000 && amount < 2000000) ||
        (price === "$2M+" && amount >= 2000000))
    );
  });
  const amount = (p) => Number(p.price.replace(/[^0-9]/g, ""));
  const area = (p) => Number(String(p.sqft).replace(/[^0-9]/g, ""));
  const comparators = {
    "Price: low to high": (a, b) => amount(a) - amount(b),
    "Price: high to low": (a, b) => amount(b) - amount(a),
    "Most bedrooms": (a, b) => b.beds - a.beds,
    "Largest floor area": (a, b) => area(b) - area(a),
  };
  return comparators[sort] ? matches.sort(comparators[sort]) : matches;
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
    beds: "Any bedrooms",
    baths: "Any bathrooms",
    sort: "Featured order",
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
  const changeFind = (field) => (e) => {
    const next = { ...find, [field]: e.target.value };
    setFind(next);
    if (results !== null) setResults(searchHomes(next));
  };
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
      <h2 id="search-heading">
        Find your <em>place.</em>
      </h2>
      <div
        className="search-tabs"
        role="tablist"
        aria-label="Property search options"
      >
        {SEARCH_TABS.map((label, i) => (
          <HoverControl as="button"
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
          </HoverControl>
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
                onChange={changeFind("location")}
                placeholder="City, neighborhood, or address…"
              />
              <div className="search-field-row">
                <SelectField
                  id="search-type"
                  label="Property Type"
                  value={find.type}
                  onChange={changeFind("type")}
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
                  onChange={changeFind("price")}
                  options={["Any price", "$500k – $1M", "$1M – $2M", "$2M+"]}
                />
              </div>
              <div className="search-field-row">
                <SelectField id="search-beds" label="Bedrooms" value={find.beds}
                  onChange={changeFind("beds")}
                  options={["Any bedrooms", "3+ bedrooms", "4+ bedrooms", "5+ bedrooms", "6+ bedrooms"]} />
                <SelectField id="search-baths" label="Bathrooms" value={find.baths}
                  onChange={changeFind("baths")}
                  options={["Any bathrooms", "2+ bathrooms", "3+ bathrooms", "4+ bathrooms", "5+ bathrooms"]} />
              </div>
              <SelectField id="search-sort" label="Sort by" value={find.sort}
                onChange={changeFind("sort")}
                options={["Featured order", "Price: low to high", "Price: high to low", "Most bedrooms", "Largest floor area"]} />
              <HoverControl as="button" className="search-submit" type="submit">
                Search homes
              </HoverControl>
            </form>
            {results !== null && (
              <div className="search-results">
                <p role="status">
                  {results.length
                    ? `${results.length} illustrative ${results.length === 1 ? "residence" : "residences"} found`
                    : "No homes match these details. Try a wider search."}
                </p>
                {results.map((p) => (
                  <HoverControl as="button"
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
                  </HoverControl>
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
            <HoverControl as="button" className="search-submit" type="submit">
              Prepare seller inquiry
            </HoverControl>
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
              placeholder="48 Ridge Lane, Hillside District"
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
            <HoverControl as="button" className="search-submit" type="submit">
              Prepare valuation request
            </HoverControl>
          </form>
        )}
      </div>
    </div>
  );
}
