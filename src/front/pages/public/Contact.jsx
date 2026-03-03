import React, { useMemo, useState } from "react";
import "./public.css";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const mailtoHref = useMemo(() => {
    const to = "support@goales.app";
    const subject = "GoalEs Support";
    const body = [
      `Name: ${form.name || "-"}`,
      `Email: ${form.email || "-"}`,
      "",
      form.message || ""
    ].join("\n");

    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  return (
    <div className="public-page">
      <div className="public-container">
        {/* HERO */}
        <header className="public-hero text-center">
          <span className="public-kicker">SUPPORT</span>
          <h1 className="public-title">Contact</h1>
          <p className="public-subtitle" style={{ margin: "0 auto" }}>
            We usually reply within <strong>24–48 hours</strong>.
          </p>
        </header>

        <div className="row g-4">
          {/* LEFT: INFO */}
          <div className="col-md-5">
            <div className="card public-card h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Contact info</h5>

                <div className="mb-3">
                  <div className="public-muted small">Email</div>
                  <a className="public-link" href="mailto:support@goales.app?subject=GoalEs%20Support">
                    support@goales.app
                  </a>
                </div>

                <div className="mb-3">
                  <div className="public-muted small">Location</div>
                  <div className="public-text">Madrid, Spain</div>
                </div>

                <hr className="public-hr" />

                <h6 className="fw-bold mb-2">Social</h6>
                <div className="d-flex gap-3 flex-wrap">
                  <a href="#" className="public-link">Instagram</a>
                  <a href="#" className="public-link">LinkedIn</a>
                  <a href="#" className="public-link">GitHub</a>
                </div>

                <p className="public-muted small mt-3 mb-0">
                  Tip: If you have a screenshot or error message, include it in your email.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM (MAILTO) */}
          <div className="col-md-7">
            <div className="card public-card">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Send a message</h5>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label public-label">Name</label>
                    <input
                      className="form-control public-input"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label public-label">Email</label>
                    <input
                      className="form-control public-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@email.com"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label public-label">Message</label>
                    <textarea
                      className="form-control public-input"
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us what you need help with..."
                    />
                  </div>

                  <div className="col-12 d-flex gap-2 flex-wrap">
                    <a className="btn public-btn-primary" href={mailtoHref}>
                      Open Email App
                    </a>

                    <button
                      className="btn public-btn-secondary"
                      type="button"
                      onClick={() => setForm({ name: "", email: "", message: "" })}
                    >
                      Clear
                    </button>
                  </div>

                  <p className="public-muted small mb-0">
                    This form does not submit to our server. It opens your email app with the message pre-filled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="public-spacer" />
      </div>
    </div>
  );
};

export default Contact;