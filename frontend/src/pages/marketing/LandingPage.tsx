import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Navbar from "../../components/marketing/Navbar";
import Hero from "../../components/marketing/Hero";
import heroBg from "../../assets/images/hero-bg.jpg";
import WhyRideAlong from "../../components/marketing/WhyRideAlong";
import Features from "../../components/marketing/Features";
import HowItWorks from "../../components/marketing/HowItWorks";
import FAQs from "../../components/marketing/FAQs";
import GetStartedCta from "../../components/marketing/GetStartedCta";
import Footer from "../../components/marketing/Footer";
import ScrollToTopButton from "../../components/marketing/ScrollToTopButton";

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
const footerRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => navigate("/login");
  const handleGetStarted = () => navigate("/onboarding");

  return (
    <div className="landing-page">
      <div
        className="hero-wrapper"
        ref={heroRef}
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-overlay"></div>

        <Navbar onLoginClick={handleLogin} onGetStartedClick={handleGetStarted} />
        <Hero onGetStartedClick={handleGetStarted} />
      </div>
      <WhyRideAlong />
      <Features />
      <HowItWorks />
      <FAQs />
      <GetStartedCta onGetStartedClick={handleGetStarted} />
      <div ref={footerRef}>
        <Footer />
      </div>
      <ScrollToTopButton heroRef={heroRef} footerRef={footerRef} />
    </div>
  );
}