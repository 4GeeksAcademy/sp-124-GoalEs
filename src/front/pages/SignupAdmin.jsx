import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const SignupAdmin = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { dispatch, store } = useGlobalReducer();

  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const [welcome, setWelcome] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const signup = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.last_name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error)
        throw new Error("Signup failed");
      }

      dispatch({
        type: "login_admin",
        payload: {
          token: data.token,
          user: data.admin,
          role: "Admin"
        }
      });

      setWelcome(true);

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <h1 className="mb-3">Signup Admin</h1>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>)}

      {welcome && store?.user && (
        <div className="alert alert-success" role="alert">
          Account Created {store.user.name} {store.user.last_name}
        </div>
      )}

      <form onSubmit={signup} className="mt-3">
        <input
          className="form-control mb-2"
          placeholder="First name"
          value={form.name}
          onChange={onChange("name")}/>

        <input
          className="form-control mb-2"
          placeholder="Last name"
          value={form.last_name}
          onChange={onChange("last_name")}/>

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={onChange("email")}/>

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange("password")} />

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Admin Account"}
        </button>
      </form>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/admin/login")}>
          Back to Admin Login
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>Back Home</button>
      </div>
    </div>
  );
};

export default SignupAdmin;