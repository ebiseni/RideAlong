import { useState } from "react";
import { useNavigate } from "react-router-dom";
import splashImg from "../../assets/Vector.png";
import img1 from "../../assets/images/onboarding1.svg";
import img2 from "../../assets/images/onboarding2.svg";
import img3 from "../../assets/images/onboarding3.svg";
import img4 from "../../assets/images/onboarding4.svg";
import "../../styles/pages/onboarding/Onboarding.css";

const onboardingData = [
  { id: 1, title: "", description: "", image: splashImg, isSplash: true },
  {
    id: 2,
    title: "Store Securely",
    description: "Keep all your vehicle documents in one secure place.",
    image: img1,
    isSplash: false,
  },
  {
    id: 3,
    title: "Get Reminders",
    description: "Receive timely alerts before your documents expire.",
    image: img2,
    isSplash: false,
  },
  {
    id: 4,
    title: "Access Anywhere",
    description: "Access your documents anytime, anywhere on any device.",
    image: img3,
    isSplash: false,
  },
  {
    id: 5,
    title: "Stay Protected",
    description:
      "Avoid fines, penalties and police harassment with valid documents.",
    image: img4,
    isSplash: false,
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const currentData = onboardingData[step - 1];

  const handleNext = () => {
    if (step < onboardingData.length) {
      setStep(step + 1);
    } else {
      navigate("/register");
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/register");
  };

  return (
    <div
      className={`onboarding-container ${currentData.isSplash ? "splash" : ""}`}
      onClick={handleNext}
    >
      {currentData.isSplash ? (
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

          <div className="onboarding-footer">
            <div className="progress-bar-container">
              {onboardingData.slice(1).map((_, index) => (
                <div
                  key={index}
                  className={`progress-bar-dot ${step === index + 2 ? "active" : ""}`}
                />
              ))}
            </div>

            <button onClick={handleSkip} className="skip-button">
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
