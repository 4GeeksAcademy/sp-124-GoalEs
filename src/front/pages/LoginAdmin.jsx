import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AuthSplitLayout } from "./Layouts/AuthSplitLayout";

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
    <AuthSplitLayout
      title="Login Admin"
      subtitle="Sign in with your admin account"
      bottomText="Don't have an admin account?"
      bottomLinkText="Create Admin Account"
      bottomLinkTo="/admin/signup"
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {welcome && <div className="alert alert-success">Welcome Boss!</div>}

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

        <button className="btn btn-success w-100" type="submit">
          Login
        </button>

        <button
          className="btn btn-outline-secondary w-100 mt-2"
          type="button"
          onClick={() => navigate("/")}
        >
          Back Home
        </button>
      </form>
    </AuthSplitLayout>
  );
};