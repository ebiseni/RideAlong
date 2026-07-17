import { useState } from "react";
import faqsLogo from "../../assets/logos/faqs-ridAlong-logo.svg";
import chevronDownIcon from "../../assets/icons/chevron-down.svg";
import "../../styles/components/marketing/FAQs.css";

const FAQ_ITEMS = [
  {
    question: "What is RideAlong?",
    answer:
      "RideAlong helps you securely store your vehicle documents, track renewal dates, and receive reminders before they expire.", 
  },
  {
    question: "Which documents can I store?",
    answer:
      "RideAlong helps you securely store your vehicle documents, track renewal Store your Driver’s Licence, Vehicle Licence, Insurance Certificate, Roadworthiness Certificate, and other essential vehicle documents.dates, and receive reminders before they expire.", 
  },
  {
    question: "Will I receive reminders?",
    answer:
      "Yes. RideAlong sends reminders before your renewal dates, giving you enough time to stay up to date.", 
  },
  {
    question: "Is my information secure?",
    answer:
      "Absolutely. Your documents are securely stored and protected, with access limited to your account.", 
  },
  {
    question: "Can I manage multiple vehicles?",
    answer:
      "Yes. You can organize and manage documents for multiple vehicles from a single account.", 
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faqs" id="faqs">
      <div className="faqs-header">
        <span className="faqs-badge">FAQs</span>
        <h2 className="faqs-headline">
          Questions? We've got <span className="highlight">answers.</span>
        </h2>
        <p className="faqs-subtext">
          Everything you need to know about using RideAlong.
        </p>
      </div>

      <div className="faqs-list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              className={`faq-item ${isOpen ? "open" : ""}`}
              key={item.question}
            >
              <button
                className="faq-question"
                onClick={() => toggleIndex(index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <img
                  src={chevronDownIcon}
                  alt=""
                  aria-hidden="true"
                  className="faq-chevron"
                />
              </button>
              {isOpen && <p className="faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

      <div className="faqs-contact-card">
        <div className="faqs-contact-left">
          <div className="faqs-contact-logo">
            <img src={faqsLogo} alt="RideAlong" />
          </div>
          <div>
            <p className="faqs-contact-title">Still have questions?</p>
            <p className="faqs-contact-description">
              We'd love to help. Reach out to our team anytime.
            </p>
          </div>
        </div>
        <a href="#contact" className="btn btn-primary faqs-contact-button">
          Contact Us
        </a>
      </div>
    </section>
  );
}
