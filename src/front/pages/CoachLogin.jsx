import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AuthSplitLayout } from "./Layouts/AuthSplitLayout";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function CoachLogin() {
  const navigate = useNavigate();
  const { dispatch, store } = useGlobalReducer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const resp = await fetch(`${backendURL}/coach/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await resp.json();

      if (!resp.ok) {

        setMsg(data.error || "Login failed");
        return;
      }


      localStorage.setItem("token-coach", data.token);
      localStorage.setItem("coach", JSON.stringify(data.coach));
      localStorage.setItem("role", "coach")

      dispatch({
        type: "login-coach",
        payload: {
          token: localStorage.getItem("token-coach"),
          coach: data.coach,
        }
      });

      navigate("/coaches/profile");


    } catch (err) {
      setMsg("Error to login (fetch failed)");
    }
  };

  useEffect(() => {
    console.log(store.token)
  }, [store.token])


  return (
    <AuthSplitLayout
      title="Coach Login"
      subtitle="Sign in to manage your courses and reservations"
      bottomText="Don't have an account?"
      bottomLinkText="Create Coach Account"
      bottomLinkTo="/coaches/new"
    >
      {msg && <div className="alert alert-danger">{msg}</div>}

      <form onSubmit={handleLogin} className="mt-3">
        <input
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />

        <input
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <button className="btn btn-success w-100" type="submit">
          Login
        </button>

        <button className="btn btn-outline-secondary w-100 mt-2" type="button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </form>
    </AuthSplitLayout>
  );
}