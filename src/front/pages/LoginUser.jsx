import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const LoginUser = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const[token, setToken] = useState("")

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState(null)

    const login = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch(`${backendURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if(!res.ok) throw new Error("We can not create a user")

            const data = await res.json();

            setToken(data)

        } catch (err) {
            setError(err)
            console.error(err)
        }
    }

    return (
        <>
        <div className="container py-4">
        <h1>Login</h1>

        {error && <div className="text-danger mb-3">{error}</div>}
        
        <form onSubmit={login} className="mt-3">

          <input
            className="form-control mb-2"
            placeholder="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />

          <button className="btn btn-success">Login</button>
        </form>

        {token && <h1>{token.token}</h1>}
        {token && <h2>{token.msg}</h2>}
        {token && <h3>{token.user}</h3>}

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigate("/users")}>
            Back to Users
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

      </div>
        </>
    )
}