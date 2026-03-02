import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AuthSplitLayout } from "./Layouts/AuthSplitLayout";

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error)
        throw new Error("Signup failed");
      }

      localStorage.setItem("token-user", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", "user")

      dispatch({
        type: "login-user",
        payload: {
          token: data.token,
          user: data.user,
        }
      });

      setWelcome(true);

      setTimeout(() => {
        navigate("/users/login");
      }, 3000);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthSplitLayout
      title="Signup User"
      subtitle="Create your account in seconds"
      bottomText="Already have an account?"
      bottomLinkText="Login"
      bottomLinkTo="/users/login"
    >
      {error && <div className="alert alert-danger">{error}</div>}

      {welcome && (
        <div className="alert alert-success" role="alert">
          Welcome {store.user.name}
        </div>
      )}

      <form onSubmit={signup} className="mt-3">
        <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <input className="form-control mb-2" placeholder="Surname" value={form.surname} onChange={(e) => setForm((f) => ({ ...f, surname: e.target.value }))} />
        <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <input className="form-control mb-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />

        <button type="submit" className="btn btn-success w-100">
          Signup
        </button>

        <button className="btn btn-outline-secondary w-100 mt-2" type="button" onClick={() => navigate("/")}>
          Back Home
        </button>
      </form>
    </AuthSplitLayout>
  );
};