import React from "react";
import "./public.css";

export const LegalTerms = () => {
  const lastUpdated = "2026-03-02";

  return (
    <div className="public-page">
      <div className="public-container" style={{ maxWidth: 980 }}>
        {/* HERO */}
        <header className="public-hero">
          <span className="public-kicker">LEGAL</span>
          <h1 className="public-title">Terms of Service</h1>
          <p className="public-subtitle">
            Last updated: <strong>{lastUpdated}</strong>
          </p>
        </header>

        {/* CONTENT CARD */}
        <div className="card public-card">
          <div className="card-body public-legal">
            <h5 className="public-h">1) Acceptable use</h5>
            <ul className="public-list">
              <li>No abuse, harassment, or harmful content.</li>
              <li>No attempts to break, exploit, or disrupt the platform.</li>
              <li>Use the service only for lawful purposes.</li>
            </ul>

            <h5 className="public-h mt-4">2) Accounts</h5>
            <ul className="public-list">
              <li>You are responsible for activity under your account.</li>
              <li>Provide accurate information and keep it up to date.</li>
            </ul>

            <h5 className="public-h mt-4">3) Reservations rules</h5>
            <ul className="public-list">
              <li>
                <strong>Pending</strong>: created by a user and awaiting coach decision.
              </li>
              <li>
                <strong>Approved</strong>: coach confirmed the reservation.
              </li>
              <li>
                <strong>Rejected</strong>: coach declined the reservation.
              </li>
              <li>
                <strong>Canceled</strong>: reservation canceled by user/coach/admin (depending on rules).
              </li>
            </ul>

            <h5 className="public-h mt-4">4) Demo disclaimer</h5>
            <p className="public-p">
              GoalEs may include demo functionality (including demo payments). Features may change
              during development.
            </p>

            <h5 className="public-h mt-4">5) Contact</h5>
            <p className="public-p mb-0">
              For questions or support, contact{" "}
              <a className="public-link" href="mailto:support@goales.app?subject=GoalEs%20Support">
                support@goales.app
              </a>
              .
            </p>
          </div>
        </div>

        <div className="public-spacer" />
      </div>
    </div>
  );
};

export default LegalTerms;