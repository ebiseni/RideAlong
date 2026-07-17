import bannerImage from "../../assets/images/getStarted-banner-image.jpeg";
import arrowRightIcon from "../../assets/icons/arrow-right-icon.svg";
import "../../styles/components/marketing/GetStartedCta.css";

interface GetStartedCtaProps {
  onGetStartedClick: () => void;
}

export default function GetStartedCta({
  onGetStartedClick,
}: GetStartedCtaProps) {
  return (
    <section className="get-started-cta">
      <div className="cta-content">
        <div className="cta-left">
          <span className="cta-badge">Get Started</span>
          <h2 className="cta-headline">
            Ready to stay <span className="highlight">road-ready?</span>
          </h2>
          <p className="cta-subtext">
            Keep your vehicle documents organized, secure, and always within
            reach with RideAlong.
          </p>
          <button
            className="btn btn-primary cta-button"
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

        <div className="cta-right">
          <img
            src={bannerImage}
            alt="RideAlong app preview"
            className="cta-image"
          />
        </div>
      </div>
    </section>
  );
}
