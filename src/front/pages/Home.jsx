import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Home = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
      return data;
    } catch (error) {
      if (error.message) throw new Error(`Could not fetch the message from the backend.`);
    }
  };

  useEffect(() => { loadMessage(); }, []);

  const isAdmin = !!localStorage.getItem("token-admin");
  const isUser = !!localStorage.getItem("token-user");
  const isCoach = !!localStorage.getItem("token-coach") || !!localStorage.getItem("coach");
  const isPublic = !isAdmin && !isUser && !isCoach;

  return (
    <>
      
      <section className="home-hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row align-items-center" style={{ minHeight: "90vh" }}>
            <div className="col-lg-6">
              <p className="hero-eyebrow">GOALES IS YOUR JOURNEY</p>
              <h1 className="hero-title">
                Achieve Your Goals With The Right Course.
              </h1>
              <p className="hero-subtitle">
                Find expert coaches, quality courses and the right path to grow — personally and professionally.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn-hero-primary" onClick={() => navigate("/courses")}>Explore Courses</button>
<button className="btn-hero-secondary" onClick={() => navigate("/coaches")}>Meet Our Coaches</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="become-coach-section" id="become-coach">
  <div className="container">
    <div className="row align-items-center gy-5">

      
      <div className="col-lg-6">
        <p className="section-eyebrow">JOIN OUR COMMUNITY</p>
        <h2 className="section-title">How to Become a Coach?</h2>
        <p className="section-text">
          At GoalEs, we believe that quality education starts with exceptional coaches. 
          That's why we are committed to partnering only with certified professionals 
          who are passionate about helping others grow.
        </p>
        <p className="section-text">
          Our coaches go through a careful selection process to ensure they meet our 
          high standards — because our students deserve the best. Whether you specialize 
          in Finance, Psychology, Software, or Nutrition, there's a place for you here.
        </p>
        <p className="section-text">
          Ready to share your expertise? Sign up as a coach through our menu and start 
          making a difference today.
        </p>
        <button className="btn-coach-cta" onClick={() => navigate("/coaches/new")}>
          Become a Coach →
        </button>
      </div>

      
      <div className="col-lg-5 offset-lg-1">
        <div className="coach-stats-card">
          <div className="coach-stat">
            <span className="stat-number">100+</span>
            <span className="stat-label">Certified Coaches</span>
          </div>
          <div className="coach-stat-divider"></div>
          <div className="coach-stat">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="coach-stat-divider"></div>
          <div className="coach-stat">
            <span className="stat-number">4</span>
            <span className="stat-label">Areas of Expertise</span>
          </div>
          <p className="coach-card-quote">
            "Joining GoalEs was the best decision for my coaching career. 
            The platform is amazing and the community is incredibly supportive."
          </p>
          <p className="coach-card-author">— Maria García, Finance Coach</p>
        </div>
      </div>

    </div>
  </div>
  </section> 

  <section className="stats-section">
  <div className="container">
    <p className="section-eyebrow text-center">OUR NUMBERS SPEAK FOR THEMSELVES</p>
    <h2 className="section-title text-center mb-5">Making a Real Difference</h2>
    <div className="row text-center gy-4">

      <div className="col-md-4">
        <div className="stat-box">
          <span className="stat-box-number">1.000+</span>
          <span className="stat-box-label">Students Graduated</span>
        </div>
      </div>

      <div className="col-md-4">
        <div className="stat-box">
          <span className="stat-box-number">4.8★</span>
          <span className="stat-box-label">Average Rating</span>
        </div>
      </div>

      <div className="col-md-4">
        <div className="stat-box">
          <span className="stat-box-number">3.500+</span>
          <span className="stat-box-label">Sessions Completed</span>
        </div>
      </div>

    </div>

    {/* Chatbot mention */}
    <div className="chatbot-mention">
      <div className="chatbot-mention-inner">
        <span className="chatbot-icon">💬</span>
        <div>
          <p className="chatbot-mention-title">Not sure where to start?</p>
          <p className="chatbot-mention-text">Our AI assistant is available on the side of the page to help you find the perfect course for your goals.</p>
        </div>
      </div>
    </div>

  </div>
</section>


    
      {isAdmin && (
        <div className="text-center py-3">
          <button className="btn btn-success ms-3" onClick={() => navigate("/admin/home")}>Admin Dashboard</button>
        </div>
      )}
      {isUser && (
        <div className="text-center py-3">
          <button className="btn btn-success ms-3" onClick={() => navigate("/users/home")}>User Dashboard</button>
          <button className="btn btn-primary ms-3" onClick={() => navigate("/courses")}>Go to Courses</button>
        </div>
      )}
      {isCoach && (
        <div className="text-center py-3">
          <button className="btn btn-success ms-3" onClick={() => navigate("/coach/private")}>Coach Dashboard</button>
          <button className="btn btn-primary ms-3" onClick={() => navigate("/courses")}>Go to Courses</button>
        </div>
      )}
    </>
  );
};