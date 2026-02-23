import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const LoginAdmin = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [welcome, setWelcome] = useState(false);

  const loginAdmin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const resp = await fetch(`${backendURL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Invalid credentials");

      // only ONE key
      localStorage.setItem("token-admin", data.token);

      // store session in global store
      dispatch({
        type: "login_admin",
        payload: {
          token: data.token,
          role: "Admin",
          user: data.admin || null,
        },
      });

      setWelcome(true);
      setTimeout(() => navigate("/admin/home"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <h1>Login Admin</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {welcome && <div className="alert alert-success">Welcome boss!</div>}

      <form onSubmit={loginAdmin} className="mt-3">
        <input
          className="form-control mb-2"
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />

        <button className="btn btn-success" type="submit">
          Login
        </button>

        <div className="mt-3">
          <p>Don't have an admin account?</p>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => navigate("/admin/signup")}
          >
            Create Admin Account
          </button>
          <button
            className="m-2 btn btn-outline-secondary"
            type="button"
            onClick={() => navigate("/")}
          >
            Back Home
          </button>
        </div>
      </form>
    </div>
  );
};