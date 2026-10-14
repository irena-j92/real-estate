import { FiArrowUp } from "react-icons/fi";
import HoverControl from "./ui/HoverControl";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";
const socials = [["Facebook", "https://www.facebook.com/", FaFacebookF], ["X", "https://x.com/", FaXTwitter], ["LinkedIn", "https://www.linkedin.com/", FaLinkedinIn], ["YouTube", "https://www.youtube.com/", FaYoutube], ["Instagram", "https://www.instagram.com/", FaInstagram]];
const navigation = [["Our perspective", "/our-perspective"], ["The properties", "/#trending"], ["Our experts", "/#experts"], ["The local edit", "/#journal"], ["Contact", "/#contact"]];
export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="site-container">
        <div className="footer-top" data-reveal>
          <HoverControl as="a" href="/#top" className="footer-brand">
            Sunter Realty<small>REMARKABLE HOMES. PERSONAL GUIDANCE.</small>
          </HoverControl>
          <nav className="footer-navigation" aria-label="Footer navigation">
            {navigation.map(([label, href]) => <HoverControl as="a" key={href} href={href}>{label}</HoverControl>)}
          </nav>
        </div>
        <div className="footer-socials" data-reveal>
          <nav aria-label="Social media">
            {socials.map(([label, href, Icon]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-tile"><Icon aria-hidden="true" /></a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom" data-reveal>
          <p>
            © {new Date().getFullYear()} Sunter Realty
          </p>
          <HoverControl as="a" href="/#top" className="back-to-top">
            BACK TO TOP <span className="back-to-top-square" aria-hidden="true"><FiArrowUp strokeWidth={1} /></span>
          </HoverControl>
          <nav className="footer-legal" aria-label="Legal information">
            <HoverControl as="a" href="/privacy-policy">Privacy Policy</HoverControl>
            <HoverControl as="a" href="/terms-of-services">Terms of Services</HoverControl>
          </nav>
        </div>
      </div>
      <div className="footer-wordmark-wrap" data-reveal-group>
        <svg aria-hidden="true" className="footer-wordmark" data-reveal viewBox="0 0 1200 180">
          <text x="2" y="145" textLength="1196" lengthAdjust="spacingAndGlyphs">SUNTER REALTY</text>
        </svg>
      </div>
    </footer>
  );
}
