import { useState } from "react";
import logo from "../../assets/logos/landingPage-logo.svg";
import arrowRightIcon from "../../assets/icons/arrow-right-icon.svg";
import "../../styles/components/marketing/Navbar.css";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact Us", href: "#contact" },
];

interface NavbarProps {
  onLoginClick: () => void;
  onGetStartedClick: () => void;
}

export default function Navbar({
  onLoginClick,
  onGetStartedClick,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <img src={logo} alt="RideAlong" className="navbar-logo" />

      <button
        className="navbar-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button className="btn btn-outline" onClick={onLoginClick}>
            Login
          </button>
          <button className="btn btn-primary" onClick={onGetStartedClick}>
            Get Started
            <img src={arrowRightIcon} alt="" className="arrow" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}
