import React from "react";
import "./public.css";

export const FAQ = () => {
  const items = [
    {
      group: "Pricing",
      qas: [
        { q: "Is GoalEs free?", a: "Yes. GoalEs is free for now (early version). Some features may become paid later." },
        { q: "Are payments real or demo?", a: "Currently payments are for testing/demo (depending on environment). If you see Stripe, it’s used for integration testing." },
      ],
    },
    {
      group: "Reservations",
      qas: [
        { q: "How to book?", a: "Open a coach profile → click Reserve → choose date/time → submit." },
        { q: "What does “pending” mean?", a: "Your request is sent but not confirmed yet. The coach must approve or reject it." },
        { q: "When is it confirmed?", a: "When the coach changes status to approved. Then it appears as an upcoming reservation." },
      ],
    },
    {
      group: "Cancellations",
      qas: [
        { q: "Can a user cancel?", a: "Yes. Users can cancel their own reservations from “My Appointments”." },
        { q: "What if the coach rejects/cancels?", a: "If rejected, it won’t happen and you can book another slot. If canceled, it moves from upcoming to history." },
      ],
    },
    {
      group: "Coaches",
      qas: [
        { q: "How to publish a course?", a: "Coach dashboard → Create Course → add title/description/price/category/tags → save." },
        { q: "How do coaches manage reservations?", a: "Coach dashboard → My Reservations → approve/reject pending requests and cancel approved ones if needed." },
      ],
    },
    {
      group: "Support",
      qas: [
        { q: "How to contact?", a: "Use the Contact page or email us at the address shown there." },
        { q: "Login issues?", a: "Make sure you’re using the correct role (User / Coach / Admin). If stuck, log out, clear token from localStorage, and log in again." },
      ],
    },
  ];

  return (
    <div className="public-page">
      <div className="public-container">
        {/* HERO */}
        <header className="public-hero text-center">
          <span className="public-kicker">HELP CENTER</span>
          <h1 className="public-title">FAQ</h1>
          <p className="public-subtitle" style={{ margin: "0 auto" }}>
            Quick answers to common questions about GoalEs.
          </p>
        </header>

        {/* ACCORDION */}
        <div className="public-faq">
          <div className="accordion" id="faqAccordion">
            {items.map((section, sIdx) => (
              <div key={section.group} className="public-faq-group">
                <h3 className="public-h2 public-faq-title">{section.group}</h3>

                {section.qas.map((qa, qIdx) => {
                  const itemId = `faq-${sIdx}-${qIdx}`;
                  const headingId = `heading-${itemId}`;
                  const collapseId = `collapse-${itemId}`;

                  return (
                    <div className="accordion-item public-faq-item" key={itemId}>
                      <h2 className="accordion-header" id={headingId}>
                        <button
                          className={`accordion-button ${qIdx === 0 ? "" : "collapsed"}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${collapseId}`}
                          aria-expanded={qIdx === 0 ? "true" : "false"}
                          aria-controls={collapseId}
                        >
                          {qa.q}
                        </button>
                      </h2>

                      <div
                        id={collapseId}
                        className={`accordion-collapse collapse ${qIdx === 0 ? "show" : ""}`}
                        aria-labelledby={headingId}
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">{qa.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="public-spacer" />
      </div>
    </div>
  );
};

export default FAQ;