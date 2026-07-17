import folderUploadIcon from "../../assets/icons/folder-upload.svg";
import qrcodeIcon from "../../assets/icons/qrcode-icon.svg";
import guardCheckIcon from "../../assets/icons/gaurd-check.svg";
import arrowConnector from "../../assets/images/Arrow 2.svg";
import "../../styles/components/marketing/HowItWorks.css";

const STEPS = [
  {
    icon: folderUploadIcon,
    title: "1. Upload your documents",
    description:
      "Securely add your Driver's Licence, Vehicle Licence, Insurance and other important vehicle documents.",
  },
  {
    icon: qrcodeIcon,
    title: "2. Receive timely reminders",
    description:
      "We'll notify you well before expiry, so you always have enough time to renew.",
  },
  {
    icon: guardCheckIcon,
    title: "3. Drive with confidence",
    description:
      "Access your documents anytime and stay prepared whenever they're requested.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-header">
        <span className="how-badge">How It Works</span>
        <h2 className="how-headline">
          One place, Every <span className="highlight">document.</span>
        </h2>
        <p className="how-subtext">
          Keep your vehicle documents organized, secure, and always within reach.
        </p>
      </div>

      <div className="how-steps">
        {STEPS.map((step, index) => (
          <div className="how-step" key={step.title}>
            <div className="how-step-icon">
              <img src={step.icon} alt="" aria-hidden="true" />
            </div>
            <h3 className="how-step-title">{step.title}</h3>
            <p className="how-step-description">{step.description}</p>

            {index < STEPS.length - 1 && (
              <img
                src={arrowConnector}
                alt=""
                aria-hidden="true"
                className="how-connector"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}