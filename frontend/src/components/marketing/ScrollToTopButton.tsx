import { useEffect, useState, type RefObject } from "react";
import upArrowIcon from "../../assets/icons/up-arrow-icon.svg";
import "../../styles/components/marketing/ScrollToTopButton.css";

interface ScrollToTopButtonProps {
  heroRef: RefObject<HTMLDivElement | null>;
  footerRef: RefObject<HTMLDivElement | null>;
}

export default function ScrollToTopButton({ heroRef, footerRef }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    const footerEl = footerRef.current;
    if (!heroEl || !footerEl) return;

    let pastHero = false;
    let atFooter = false;

    const update = () => setVisible(pastHero && !atFooter);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        atFooter = entry.isIntersecting;
        update();
      },
      { threshold: 0.5 }
    );

    heroObserver.observe(heroEl);
    footerObserver.observe(footerEl);

    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, [heroRef, footerRef]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-top-fab ${visible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <img src={upArrowIcon} alt="" aria-hidden="true" />
    </button>
  );
}