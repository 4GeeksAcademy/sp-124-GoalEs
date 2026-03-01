import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/auth.css";

const copyByRole = {
  user: {
    title: "Your goals, your plan",
    text: "Pick a coach\nReserve sessions\nand keep everything organized in one place."
  },
  coach: {
    title: "Build your coaching business",
    text: "Create courses, approve reservations, and support your students"
  },
  admin: {
    title: "Control the platform",
    text: "Manage the entire system and keep everything running smoothly."
  }
};

function inferRoleFromPath(pathname) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/coach") || pathname.startsWith("/coaches")) return "coach";
  if (pathname.startsWith("/users")) return "user";
}

export const AuthSplitLayout = ({
  role,
  title = "Welcome",
  subtitle = "Sign in to continue",
  bottomText,
  bottomLinkText,
  bottomLinkTo,
  children
}) => {
  const { pathname } = useLocation();
  const resolvedRole = role || inferRoleFromPath(pathname);
  const c = copyByRole[resolvedRole] || copyByRole.user;

  return (
    <section className="auth-radial-bg auth-page">
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          {/* LEFT */}
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1 className="auth-left-title display-5 fw-bold lh-1 mb-3">
              {c.title}{" "}
            </h1>
            <p className="auth-left-text lead mb-0">{c.text}</p>
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

                {bottomText && bottomLinkText && bottomLinkTo && (
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