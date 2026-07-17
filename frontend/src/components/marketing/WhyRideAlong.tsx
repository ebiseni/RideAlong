import shieldKeyIcon from "../../assets/icons/shield-key.svg";
import notificationIcon from "../../assets/icons/notification-01.svg";
import boltIcon from "../../assets/icons/bolt.svg";
import guardCheckIcon from "../../assets/icons/gaurd-check.svg";
// TEMP: JPG has a visible background edge — replace with transparent PNG/SVG once available
import phoneMockup from "../../assets/images/ridealong-phoneMockup.jpg";
import "../../styles/components/marketing/WhyRideAlong.css";

const FEATURES = [
  {
    icon: shieldKeyIcon,
    title: "Secure Storage",
    description: "Keep all your vehicle documents safely stored in one secure place.",
    position: "top-left",
  },
  {
    icon: notificationIcon,
    title: "Timely Reminders",
    description: "Receive advance reminders before your documents expire.",
    position: "top-right",
  },
  {
    icon: boltIcon,
    title: "Instant Access",
    description: "Access your documents anytime, whether you're on the road or at home.",
    position: "bottom-right",
  },
  {
    icon: guardCheckIcon,
    title: "Stay Road-Ready",
    description: "Be prepared whenever your vehicle documents are requested.",
    position: "bottom-left",
  },
];

export default function WhyRideAlong() {
  return (
    <section className="why-ridealong">
      <div className="why-header">
        <span className="why-badge">Why RideAlong?</span>
        <h2 className="why-headline">
          Built for every <span className="highlight">journey.</span>
        </h2>
        <p className="why-subtext">
          Every feature is designed to make managing your vehicle documents
          simple and reliable.
        </p>
      </div>

      <div className="why-showcase">
        <div className="phone-mockup-wrapper">
          <img src={phoneMockup} alt="RideAlong app" className="phone-mockup-image" />
        </div>

        {FEATURES.map((feature) => (
          <div className={`why-card why-card-${feature.position}`} key={feature.title}>
            <div className="why-card-header">
              <img src={feature.icon} alt="" aria-hidden="true" className="why-card-icon" />
              <p className="why-card-title">{feature.title}</p>
            </div>
            <p className="why-card-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}