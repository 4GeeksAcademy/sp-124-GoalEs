import React from "react";
import "./public.css";

export const LegalPrivacy = () => {
  const lastUpdated = "2026-03-02"; // change anytime

  return (
    <div className="public-page">
      <div className="public-container" style={{ maxWidth: 980 }}>
        {/* HERO */}
        <header className="public-hero">
          <span className="public-kicker">LEGAL</span>
          <h1 className="public-title">Privacy Policy</h1>
          <p className="public-subtitle">
            Last updated: <strong>{lastUpdated}</strong>
          </p>
        </header>

        {/* CONTENT CARD */}
        <div className="card public-card">
          <div className="card-body public-legal">
            <h5 className="public-h">1) Data we collect</h5>
            <ul className="public-list">
              <li>
                <strong>Account data:</strong> email, name, surname, profile picture (if provided).
              </li>
              <li>
                <strong>Coach profile data:</strong> public profile details (name, city, country, etc.).
              </li>
              <li>
                <strong>Bookings:</strong> reservation time, coach/user id, status, optional note.
              </li>
            </ul>

            <h5 className="public-h mt-4">2) How we use your data</h5>
            <ul className="public-list">
              <li>To create and manage your account.</li>
              <li>To let you book sessions and view reservations.</li>
              <li>To operate and improve the platform.</li>
            </ul>

            <h5 className="public-h mt-4">3) Storage & security</h5>
            <p className="public-p">
              For session management, authentication tokens may be stored in your browser (e.g.{" "}
              <code className="public-code">localStorage</code>). Please log out on shared devices.
            </p>

            <h5 className="public-h mt-4">4) Sharing</h5>
            <p className="public-p">
              We do <strong>not</strong> sell your personal data. We only share information when needed
              to provide the service (e.g., showing a reservation to the related coach/user) or if
              required by law.
            </p>

            <h5 className="public-h mt-4">5) Data deletion</h5>
            <p className="public-p mb-0">
              You can request deletion of your account and data by contacting us at{" "}
              <a
                className="public-link"
                href="mailto:support@goales.app?subject=GoalEs%20Data%20Deletion%20Request"
              >
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

export default LegalPrivacy;