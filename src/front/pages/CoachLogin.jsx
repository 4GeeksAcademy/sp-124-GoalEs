import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
  },[store.token])
 

  return (
<>
   <div className="container py-4" style={{ maxWidth: 720 }}>
      <h1 className="mb-4">Coach Login</h1>

      {msg && <div className="alert alert-danger">{msg}</div>}

      <form onSubmit={handleLogin}>
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

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            Login
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>
      </form>
    </div>
    </>
  );
}