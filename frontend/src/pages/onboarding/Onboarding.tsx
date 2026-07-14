import { useState } from "react";
import splashImg from "../../assets/Vector.png";
import img1 from "../../assets/onboarding1.png";
import img2 from "../../assets/onboarding2.png";
import img3 from "../../assets/onboarding3.png";
import img4 from "../../assets/onboarding4.png";
import "../../styles/pages/onboarding/Onboarding.css";

const onboardingData = [
  { id: 1, title: "", description: "", image: splashImg },
  {
    id: 2,
    title: "Store Securely",
    description: "Keep all your vehicle documents in one secure place.",
    image: img1,
  },
  {
    id: 3,
    title: "Get Reminders",
    description: "Receive timely alerts before your documents expire.",
    image: img2,
  },
  {
    id: 4,
    title: "Access Anywhere",
    description: "Access your documents anytime, anywhere on any device.",
    image: img3,
  },
  {
    id: 5,
    title: "Stay Protected",
    description:
      "Avoid fines, penalties and police harassment with valid documents.",
    image: img4,
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const currentData = onboardingData[step - 1];
  const isSplash = currentData.id === 1;

  const handleNext = () => {
    if (step < onboardingData.length) {
      setStep(step + 1);
    } else {
      // Final screen: Navigate to login
      window.location.href = "/login";
    }
  };

  return (
    <div
      className={`onboarding-container ${isSplash ? "splash" : ""}`}
      onClick={handleNext}
      style={{ cursor: "pointer" }}
    >
      {isSplash ? (
        <div className="onboarding-content">
          <img src={currentData.image} alt="Logo" className="splash-logo" />
        </div>
      ) : (
        <div className="onboarding-content">
          <div className="onboarding-image">
            <img src={currentData.image} alt={currentData.title} />
          </div>

          <div className="onboarding-text">
            <h1>{currentData.title}</h1>
            <p>{currentData.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
