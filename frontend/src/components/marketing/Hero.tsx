import shieldKeyIcon from "../../assets/icons/shield-key.svg";
import notificationIcon from "../../assets/icons/notification-01.svg";
import checkmarkCircleIcon from "../../assets/icons/checkmark-circle-01.svg";
import arrowRightIcon from "../../assets/icons/arrow-right-icon.svg";
import "../../styles/components/marketing/Hero.css";

const BADGES = [
  { label: "Driver's License" },
  { label: "Timely Reminders" },
  { label: "Road-Ready" },
];

const FEATURES = [
  {
    icon: shieldKeyIcon,
    title: "Secure Storage",
    description: "Keep your documents safe and easy to access.",
  },
  {
    icon: notificationIcon,
    title: "Smart Reminders",
    description: "Get notified before your document expires.",
  },
  {
    icon: checkmarkCircleIcon,
    title: "Stay Compliant",
    description: "Avoid stress, fines and roadside hassles.",
  },
];

interface HeroProps {
  onGetStartedClick: () => void;
}

export default function Hero({ onGetStartedClick }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-left">
          <span className="hero-badge">Smart vehicle document management</span>

          <h1 className="hero-headline">
            Your vehicle documents,
            <br />
            <span className="highlight">always ready.</span>
          </h1>

          <p className="hero-subtext">
            Securely store your vehicle documents and get timely reminders
            before they expire.
          </p>

          <button
            className="btn btn-primary hero-cta"
            onClick={onGetStartedClick}
          >
            Get Started
            <img
              src={arrowRightIcon}
              alt=""
              className="arrow"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="hero-right">
          <div className="floating-badges">
            {BADGES.map((badge) => (
              <div className="floating-badge" key={badge.label}>
                <span>{badge.label}</span>
                <span className="check-icon">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-features">
        {FEATURES.map((feature) => (
          <div className="feature-item" key={feature.title}>
            <img
              src={feature.icon}
              alt=""
              className="feature-icon"
              aria-hidden="true"
            />
            <div>
              <p className="feature-title">{feature.title}</p>
              <p className="feature-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
