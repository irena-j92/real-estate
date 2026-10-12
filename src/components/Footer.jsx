import HoverControl from "./ui/HoverControl";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";
const socials = [["Facebook", "https://www.facebook.com/", FaFacebookF], ["X", "https://x.com/", FaXTwitter], ["LinkedIn", "https://www.linkedin.com/", FaLinkedinIn], ["YouTube", "https://www.youtube.com/", FaYoutube], ["Instagram", "https://www.instagram.com/", FaInstagram]];
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
          <HoverControl as="a" href="#top" className="footer-brand">
            Sunter Realty<small>A DIFFERENT PERSPECTIVE ON HOME.</small>
          </HoverControl>
          {columns.map((col) => (
            <div key={col.title} className="footer-column">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <HoverControl as="a" href={href}>{label}</HoverControl>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-socials" data-reveal>
          <h3>Socials</h3>
          <nav aria-label="Social media">
            {socials.map(([label, href, Icon]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-tile"><Icon aria-hidden="true" /></a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Sunter Realty · Independent portfolio
            concept
          </p>
          <p>Illustrative homes & advisers · Equal housing opportunity</p>
          <HoverControl as="a" href="#top" className="hover:text-yellow">
            Back to the beginning
          </HoverControl>
        </div>
      </div>
      <p aria-hidden="true" className="footer-wordmark">
        Sunter Realty
      </p>
    </footer>
  );
}
