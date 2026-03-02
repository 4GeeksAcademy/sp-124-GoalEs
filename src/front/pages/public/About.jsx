import React from "react";
import "./public.css";

import arashPhoto from "../../assets/img/Arash.jpeg";
import cristianPhoto from "../../assets/img/Cristian.png";
import sarahPhoto from "../../assets/img/Sara.jpg";

export const About = () => {
  const team = [
    {
      name: "Arash Tahamtan",
      role: "Full-Stack",
      bio:
        "Focused on building a simple, reliable experience for users.\n" +
        "Turns messy ideas into clear features and shipped pages.",
      photo: arashPhoto,
    },
    {
      name: "Cristian David Trapiello",
      role: "Full-Stack",
      bio:
        "Brings the UI to life with clean components and strong styling.\n" +
        "Obsessed with usability, consistency, and polished flows.",
      photo: cristianPhoto,
    },
    {
      name: "Sarah Cardoso",
      role: "Full-Stack",
      bio:
        "I’m a lifelong learner who believes in the power of education to drive both personal\n" +
        "and professional growth. I’m constantly seeking new challenges that help me evolve and expand my skills.",
      photo: sarahPhoto,
    },
  ];

  const values = [
    { title: "Trust", text: "Clear scheduling, predictable flows, and transparent actions." },
    { title: "Simplicity", text: "Only what matters — less noise, more progress." },
    { title: "Progress", text: "A system designed to help people improve step by step." },
  ];

  return (
    <div className="public-page">
      <div className="public-container">
        {/* HERO */}
        <header className="public-hero">
          <span className="public-kicker">GOALES</span>
          <h1 className="public-title">About GoalEs</h1>
          <p className="public-subtitle">
            GoalEs is a coaching & learning platform that helps users find the right coach,
            reserve sessions, and follow courses — all in one organized place.
          </p>
        </header>

        {/* ABOUT PARAGRAPH */}
        <section className="public-section">
          <div className="public-card public-card--soft">
            <p className="public-paragraph">
              We built GoalEs to make personal improvement easier to manage. Instead of switching between
              chats, calendars, notes, and random links, GoalEs brings coaching, reservations, and learning
              content into one workflow. Whether you’re a user looking for guidance, a coach managing clients,
              or an admin maintaining the platform — everything stays clear, simple, and trackable.
            </p>
          </div>
        </section>

        {/* MISSION / VISION */}
        <section className="public-section">
          <div className="public-grid-2">
            <div className="public-card">
              <h3 className="public-card-title">Mission</h3>
              <p className="public-muted">
                Help people improve faster by making coaching and learning simple, structured, and accessible.
              </p>
            </div>

            <div className="public-card">
              <h3 className="public-card-title">Vision</h3>
              <p className="public-muted">
                Become the most user-friendly place where goals, coaching, and progress live together.
              </p>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="public-section">
          <div className="public-card">
            <h3 className="public-card-title">Why we built it</h3>
            <p className="public-muted">
              Scheduling and tracking progress should not feel like a second job. We noticed that users
              struggle to keep sessions, plans, and course content organized. GoalEs solves that with a clean
              flow: <strong>discover → reserve → learn → track</strong> — with clear roles for user, coach, and admin.
            </p>
          </div>
        </section>

        {/* TEAM */}
        <section className="public-section">
          <div className="public-section-head">
            <h2 className="public-h2">Team</h2>
            <span className="public-badge">3 creators</span>
          </div>

          <div className="public-grid-3">
            {team.map((m) => (
              <div className="public-card" key={m.name}>
                <div className="public-team-head">
                  <img className="public-avatar" src={m.photo} alt={m.name} />
                  <div>
                    <div className="public-team-name">{m.name}</div>
                    <div className="public-team-role">{m.role}</div>
                  </div>
                </div>

                <p className="public-muted" style={{ whiteSpace: "pre-line" }}>
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* VALUES */}
        <section className="public-section">
          <h2 className="public-h2">Values</h2>
          <div className="public-grid-3">
            {values.map((v) => (
              <div className="public-card" key={v.title}>
                <h3 className="public-card-title">{v.title}</h3>
                <p className="public-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="public-spacer" />
      </div>
    </div>
  );
};

export default About;