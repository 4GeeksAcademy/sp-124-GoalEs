import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Home = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadMessage = async () => {
    try {
      if (!BACKEND_URL) {
        throw new Error("VITE_BACKEND_URL is not defined");
      }

      const res = await fetch(`${BACKEND_URL}/api/hello`);
      if (!res.ok) throw new Error("Backend not responding");

      const data = await res.json();
      setMessage(data.message);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-3">Course Platform</h1>
      <p className="text-muted mb-4">
        Manage courses from a single place
      </p>

      {/* NAV BUTTONS */}
      <div className="d-flex justify-content-center gap-3 mb-4">

        <button
          className="btn btn-success"
          onClick={() => navigate("/courses")}
        >
          Courses
        </button>
      </div>

      {/* BACKEND STATUS */}
      <div className="mt-4">
        {error ? (
          <div className="alert alert-danger">
            ❌ {error}
          </div>
        ) : message ? (
          <div className="alert alert-info">
            ✅ {message}
          </div>
        ) : (
          <div className="alert alert-secondary">
            ⏳ Connecting to backend...
          </div>
        )}
      </div>
    </div>
  );
};