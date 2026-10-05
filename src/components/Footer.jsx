import { FiInstagram, FiFacebook, FiLinkedin, FiTwitter } from "react-icons/fi";
import Container from "./ui/Container";

const COLUMNS = [
  {
    title: "About",
    links: ["Our Story", "Newsroom", "Awards", "Offices"],
  },
  {
    title: "Services",
    links: ["Buy", "Sell", "Move", "Quick Buy"],
  },
  {
    title: "Advice",
    links: ["Buyer Guides", "Seller Guides", "Market Reports", "Journal"],
  },
  {
    title: "Careers",
    links: ["Join Long Realty", "Agent Training", "Culture"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Use", "Fair Housing", "Accessibility"],
  },
];

const SOCIALS = [
  { icon: FiInstagram, label: "Instagram" },
  { icon: FiFacebook, label: "Facebook" },
  { icon: FiLinkedin, label: "LinkedIn" },
  { icon: FiTwitter, label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#141721] pt-24 text-white">
      <Container className="px-6 md:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-white/80 transition-colors hover:text-yellow"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Socials
            </h4>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#top"
                  aria-label={label}
                  className="flex h-[60px] w-[60px] items-center justify-center bg-secondary transition-colors hover:bg-yellow hover:text-dark"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 py-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Long Realty Company. All rights reserved.</p>
          <p>900 E. River Rd, Tucson, AZ 85718</p>
        </div>
      </Container>

      <p
        aria-hidden="true"
        className="select-none overflow-hidden whitespace-nowrap text-white text-center font-sans text-[16vw] font-light uppercase leading-[0.7] text-secondary"
        style={{ transform: "translateY(28%)" }}
      >
        Long Realty
      </p>
    </footer>
  );
}
