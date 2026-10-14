import HoverControl from "./ui/HoverControl";

const pages = {
  "privacy-policy": {
    title: "Privacy Policy",
    introduction: "How information is used in the Sunter Realty portfolio experience.",
    sections: [
      ["Your account", "Your ChatGPT sign-in identifies your account. The site displays your account name and email and stores the profile preferences and saved properties you choose to keep. Saved homes belong to your account; they are not shared with other visitors."],
      ["Your device", "A small browser storage flag remembers that you have already seen the opening sequence. It is used to skip the pre-loader on future visits. Clearing site storage resets this preference."],
      ["Messages and inquiries", "The contact form demonstrates an inquiry flow. It prepares a message in the current page but does not send it to a brokerage. Account profile changes and saved properties are stored separately from this form."],
      ["External services", "The site uses hosted fonts and links to social platforms. Visiting an external link takes you to a service with its own privacy practices. This portfolio does not add an advertising or analytics tracker."],
      ["Your choices", "You can remove saved properties and update profile preferences through the account menu. Browser storage can be cleared in your browser settings. Access to this hosted portfolio is managed through its ChatGPT sign-in."],
    ],
  },
  "terms-of-services": {
    title: "Terms of Services",
    introduction: "About the scope and features of this Sunter Realty portfolio.",
    sections: [
      ["A portfolio experience", "This website demonstrates a real estate discovery experience. Its property listings, advisers, history, and editorial content are illustrative. It does not establish a brokerage relationship or provide an actual property offer."],
      ["Property discovery", "Prices, details, dates, and availability are demonstration content. Saving a home, choosing START OFFER, or arranging a showing prepares an inquiry within this experience; these actions do not reserve a property or create a purchase agreement."],
      ["Accounts and saved homes", "Account features let you save example properties and edit your profile preferences. They require the hosted site's sign-in and access. You can remove favorites or sign out using the account menu."],
      ["Contact and links", "The contact form is a preview and does not deliver messages to a brokerage. Social links lead to external platforms. Their content and services are separate from this portfolio."],
      ["Changes to the experience", "The design and demonstration features may change as the portfolio develops. These pages describe the current implementation and should be replaced with company-specific policies before the site is used for a live brokerage."],
    ],
  },
};
export default function LegalPage({ type }) {
  const page = pages[type];
  return <main className="legal-page" aria-labelledby="legal-title">
    <div className="legal-shell" data-reveal-group>
      <p className="section-kicker" data-reveal>SUNTER REALTY</p>
      <h1 id="legal-title" data-reveal>{page.title}</h1>
      <p className="legal-introduction" data-reveal>{page.introduction}</p>
    </div>
    <div className="legal-shell">
      {page.sections.map(([heading, text], index) => <section className="legal-copy" data-reveal-group key={heading}>
        <h2 data-reveal><span>{String(index + 1).padStart(2, "0")}</span>{heading}</h2>
        <p data-reveal>{text}</p>
      </section>)}
      <div data-reveal-group><HoverControl as="a" className="text-link" data-reveal href="/">Back to home</HoverControl></div>
    </div>
  </main>;
}
