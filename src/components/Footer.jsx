const columns = [
  {
    title: "Find your place",
    links: [
      ["Explore homes", "#trending"],
      ["Meet our advisers", "#experts"],
      ["Local perspective", "#journal"],
    ],
  },
  {
    title: "Make your move",
    links: [
      ["Buy a home", "#trending"],
      ["Sell a home", "#contact"],
      ["Relocation & services", "#offer"],
    ],
  },
  {
    title: "Get to know us",
    links: [
      ["Our perspective", "#about"],
      ["Join our people", "#experts"],
      ["Let’s connect", "#contact"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="site-container">
        <div className="footer-top" data-reveal>
          <a href="#top" className="footer-brand">
            Long Realty<small>A DIFFERENT PERSPECTIVE ON HOME.</small>
          </a>
          {columns.map((col) => (
            <div key={col.title} className="footer-column">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Long Realty · Independent portfolio
            concept
          </p>
          <p>Illustrative homes & advisers · Equal housing opportunity</p>
          <a href="#top" className="hover:text-yellow">
            Back to the beginning
          </a>
        </div>
      </div>
      <p aria-hidden="true" className="footer-wordmark">
        Long Realty
      </p>
    </footer>
  );
}
