import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export const AuthSplitLayout = ({
  title = "Welcome",
  subtitle = "Sign in to continue",
  leftTitle = "Train smarter\nReach your Goals",
  leftText = "Pick a coach, book a session, follow a plan — and track your progress",
  bottomText,
  bottomLinkText,
  bottomLinkTo,
  children
}) => {
  return (
    <section className="auth-radial-bg auth-page">

      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        
        <div className="row gx-lg-5 align-items-center mb-5">
          {/* LEFT */}
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            

            <h1 className="my-4 display-5 fw-bold ls-tight auth-left-title">
              {String(leftTitle).split("\n").map((line, idx) => (
                <span key={idx} className="d-block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mb-4 opacity-75 auth-left-text">{leftText}</p>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div id="auth-shape-1" className="position-absolute rounded-circle shadow-5-strong" />
            <div id="auth-shape-2" className="position-absolute shadow-5-strong" />

            <div className="card auth-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <div className="mb-4">
                  <h2 className="auth-form-title mb-1">{title}</h2>
                  {subtitle && <div className="auth-form-subtitle">{subtitle}</div>}
                </div>

                {children}

                {(bottomText && bottomLinkText && bottomLinkTo) && (
                  <div className="mt-4 auth-bottom">
                    <span className="auth-bottom-text">{bottomText} </span>
                    <Link className="auth-bottom-link" to={bottomLinkTo}>
                      {bottomLinkText}
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};