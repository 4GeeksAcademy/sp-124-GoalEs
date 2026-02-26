import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const LoginUser = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const { dispatch, store } = useGlobalReducer();

  const [welcome, setWelcome] = useState(false)

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState(null)

  const login = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();

      const normalizedUser = {
        id: data.user.data?.id ?? data.user.id,
        name: data.user.data?.name ?? data.user.name,
        email: data.user.data?.email ?? data.user.email,
        age: data.user.data?.age ?? data.user.age,
        gender: data.user.data?.gender ?? data.user.gender,
        surname: data.user.data?.surname ?? data.user.surname,
        profile_picture: data.user.data?.profile_picture ?? data.user.profile_picture,
      };

      localStorage.setItem("token-user", data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("role", "user")

      dispatch({
        type: "login-user",
        payload: {
          token: data.token,
          user: normalizedUser,
        }
      });

      setWelcome(true)
      setError("")

      setTimeout(() => {
        navigate("/users/profile")
      }, 3000)

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="container py-4">
        <h1>Login User</h1>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {welcome && (
          <div className="alert alert-success" role="alert">
            Bienvenido {store.user.name}
          </div>
        )}

        <form onSubmit={login} className="mt-3">

          <input
            className="form-control mb-2"
            placeholder="email"
            value={form.email}
            onChange={(e) => setForm((form) => ({ ...form, email: e.target.value }))}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="password"
            value={form.password}
            onChange={(e) => setForm((form) => ({ ...form, password: e.target.value }))}
          />

          <button type="submit" className="btn btn-success">Login</button>
        </form>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigate("/users")}>
            Back to Users
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

        <div>
          <p className="mt-3">Do you not have a account?</p>
          <button className="btn btn-outline-primary" onClick={() => navigate("/users/signup")}>Create Account</button>
        </div>

      </div>
    </>
  )
}