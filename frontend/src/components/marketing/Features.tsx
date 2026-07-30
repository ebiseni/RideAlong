import dashboardImage from "../../assets/images/features-image.jpg";
import documentIcon from "../../assets/icons/features-document.svg";
import expiryIcon from "../../assets/icons/features-expiry.svg";
import vehicleIcon from "../../assets/icons/features-vehicle.svg";
import activityIcon from "../../assets/icons/features-activity.svg";
import "../../styles/components/marketing/Features.css";

const FEATURE_ITEMS = [
  {
    icon: documentIcon,
    title: "Document Overview",
    description: "View all your vehicle documents and their status in one place.",
  },
  {
    icon: expiryIcon,
    title: "Expiry Tracking",
    description: "See upcoming renewals before they become urgent.",
  },
  {
    icon: vehicleIcon,
    title: "Vehicle Management",
    description: "Manage one or multiple vehicles from a single dashboard.",
  },
  {
    icon: activityIcon,
    title: "Activity & Reminders",
    description: "Keep track of reminders, uploads, and recent activity.",
  },
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <span className="features-badge">Features</span>
        <h2 className="features-headline">
          Everything you need, <span className="highlight">at a glance.</span>
        </h2>
        <p className="features-subtext">
          Stay on top of your vehicle documents with a dashboard designed to
          keep everything organized, accessible, and up to date.
        </p>
      </div>

      <div className="features-content">
        <div className="features-image-wrapper">
          <img
            src={dashboardImage}
            alt="RideAlong dashboard preview"
            className="features-image"
          />
        </div>

        <div className="features-list">
          {FEATURE_ITEMS.map((item, index) => (
            <div
              className={`feature-row ${
                index < FEATURE_ITEMS.length - 1 ? "with-divider" : ""
              }`}
              key={item.title}
            >
              <div className="feature-row-icon">
                <img src={item.icon} alt="" aria-hidden="true" />
              </div>
              <div className="feature-row-text">
                <p className="feature-row-title">{item.title}</p>
                <p className="feature-row-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}