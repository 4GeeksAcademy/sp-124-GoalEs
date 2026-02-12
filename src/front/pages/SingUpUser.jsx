import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const SignupUser = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const { dispatch, store } = useGlobalReducer();

  const [welcome, setWelcome] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  const signup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error)
        throw new Error("Signup failed");
      }

      dispatch({
        type: "login",
        payload: {
          token: data.token,
          user: data.user,
          role: "User"
        }
      });

      setWelcome(true);

      setTimeout(() => {
        navigate("/users/home");
      }, 3000);

    } catch (error) {
      console.error();
    }
  };

  return (
    <>
      <div className="container py-4">
        <h1>Signup User</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {welcome && (
          <div className="alert alert-success" role="alert">
            Welcome {store.user.name}
          </div>
        )}

        <form onSubmit={signup} className="mt-3">

          <input
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((form) => ({ ...form, name: e.target.value }))}
          />

          <input
            className="form-control mb-2"
            placeholder="Surname"
            value={form.surname}
            onChange={(e) => setForm((form) => ({ ...form, surname: e.target.value }))}
          />

          <input
            className="form-control mb-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((form) => ({ ...form, email: e.target.value }))}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((form) => ({ ...form, password: e.target.value }))}
          />

          <button type="submit" className="btn btn-success">
            Signup
          </button>
        </form>

        <div className="mt-4 d-flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/users/login")}
          >
            Back to Login
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>

      </div>
    </>
  );
};