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