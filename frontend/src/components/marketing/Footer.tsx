import { useState } from "react";
import logo from "../../assets/logos/landingPage-logo.svg";
import mailIcon from "../../assets/icons/mail-icon.svg";
import xIcon from "../../assets/icons/x-icon.svg";
import instagramIcon from "../../assets/icons/instargram-icon.svg";
import upArrowIcon from "../../assets/icons/up-arrow-icon.svg";
import "../../styles/components/marketing/Footer.css";

const PRODUCT_LINKS = ["Dashboard", "Documents", "Reminders"];
const COMPANY_LINKS = ["Contact", "FAQs"];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText("ridealong763@email.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logo} alt="RideAlong" className="footer-logo" />
          <p className="footer-tagline">
            Securely manage your vehicle documents with smart reminders and
            instant access.
          </p>
        </div>

        <div className="footer-column">
          <p className="footer-column-title">Product</p>
          <ul>
            {PRODUCT_LINKS.map((link) => (
              <li key={link}>
                {/* TEMP: placeholder link, wire up once route/anchor exists */}
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <p className="footer-column-title">Company</p>
          <ul>
            {COMPANY_LINKS.map((link) => {
              const href =
                link === "Contact"
                  ? "#contact"
                  : link === "FAQs"
                    ? "#faqs"
                    : "#";
              return (
                <li key={link}>
                  <a href={href}>{link}</a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="footer-column">
          <p className="footer-column-title">Connect</p>
          <a
            href="mailto:ridealong763@email.com"
            className="footer-email"
            onClick={handleEmailClick}
          >
            <img src={mailIcon} alt="" aria-hidden="true" />
            <span>{copied ? "Copied!" : "ridealong763@email.com"}</span>
          </a>
          <div className="footer-socials">
            <a
              href="https://x.com/RideAlong____"
              className="footer-social-icon"
              aria-label="X (Twitter)"
            >
              <img src={xIcon} alt="" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/ridealonghq?igsh=MW16dmRmaGVvMnF6OQ%3D%3D"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <img src={instagramIcon} alt="" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 RideAlong. All rights reserved.
        </p>
        <button
          className="footer-scroll-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <img src={upArrowIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
