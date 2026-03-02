import React from "react";
import "./public.css";

export const Features = () => {
  return (
    <div className="public-page">
      <div className="public-container">
        {/* HERO */}
        <header className="public-hero text-center">
          <span className="public-kicker">GOALES</span>
          <h1 className="public-title">Features</h1>
          <p className="public-subtitle" style={{ margin: "0 auto" }}>
            GoalEs connects learners and coaches in one platform — with role-based dashboards
            for users, coaches, and admins.
          </p>
        </header>

        {/* 3 CARDS */}
        <section className="public-section">
          <div className="public-grid-3">
            <div className="public-card public-feature-card">
              <h3 className="public-card-title public-feature-title">For Users</h3>
              <ul className="public-list">
                <li>Browse coaches by profile and location</li>
                <li>Reserve sessions in a few clicks</li>
                <li>Explore courses with details and pricing</li>
                <li>Save favorites (coaches/courses) for later</li>
                <li>Track your active courses in your dashboard</li>
                <li>Get help from the AI assistant anytime</li>
              </ul>
            </div>

            <div className="public-card public-feature-card">
              <h3 className="public-card-title public-feature-title">For Coaches</h3>
              <ul className="public-list">
                <li>Create and manage your courses (CRUD)</li>
                <li>Upload course images and keep content updated</li>
                <li>See your reservations in one place</li>
                <li>Approve / Reject / Cancel requests</li>
                <li>View enrolled students per course</li>
                <li>Manage your public profile (bio, photo, location)</li>
              </ul>
            </div>

            <div className="public-card public-feature-card">
              <h3 className="public-card-title public-feature-title">For Admins</h3>
              <ul className="public-list">
                <li>Manage users and coaches</li>
                <li>Manage courses across the platform</li>
                <li>Create/edit categories and tags</li>
                <li>Monitor reservations and status changes</li>
                <li>Keep data consistent and organized</li>
                <li>Support platform operations and content quality</li>
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="public-section">
          <div className="public-section-head" style={{ justifyContent: "center" }}>
            <h2 className="public-h2">How it works</h2>
          </div>

          <div className="public-grid-3">
            <div className="public-card public-step-card">
              <div className="public-step-num">1</div>
              <div className="public-step-title">Choose</div>
              <div className="public-muted">Find a coach or course that matches your goals.</div>
            </div>

            <div className="public-card public-step-card">
              <div className="public-step-num">2</div>
              <div className="public-step-title">Reserve</div>
              <div className="public-muted">Book a session and wait for coach approval.</div>
            </div>

            <div className="public-card public-step-card">
              <div className="public-step-num">3</div>
              <div className="public-step-title">Improve</div>
              <div className="public-muted">Follow your plan, track progress, and keep learning.</div>
            </div>
          </div>
        </section>

        <div className="public-spacer" />
      </div>
    </div>
  );
};

export default Features;