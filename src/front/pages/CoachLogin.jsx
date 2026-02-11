import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function CoachLogin() {
const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const resp = await fetch(`${backendURL}/coach/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await resp.json();

      if (!resp.ok) {
        
        setMsg(data.error || "Login failed");
        return;
      }

      localStorage.setItem("jwt-token", data.token);

    
    } catch (err) {
      setMsg("Error to login (fetch failed)");
    }
  };

  const handlePrivate = async () => {
    setMsg("");

    const token = localStorage.getItem("jwt-token");
    if (!token) {
      setMsg("You have no saved tokens. Log in first");
      return;
    }

    try {
      const resp = await fetch(`${backendURL}/coach/private`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      const data = await resp.json();

      if (!resp.ok) {
  setMsg(data.error || data.Attention || data.msg || JSON.stringify(data));
  return;
}

      setMsg("Private ok: " + JSON.stringify(data));
    } catch (err) {
      setMsg("Error in private (fetch failed)");
    }
  };

  return (
<>
    <button
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Back to home
            </button>

    <div style={{ padding: 20 }}>
      <h2>Coach Login</h2>

      <form onSubmit={handleLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        <br />
        <button className="btn btn-primary">Login</button>
        <button className="btn btn-outline-primary mt-2" type="button" onClick={handlePrivate}>
  Test Private
</button>
        

        
      </form>
      {msg && <p>{msg}</p>}
    </div>
    </>
  );
}
