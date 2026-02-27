import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSplitLayout } from "./Layouts/AuthSplitLayout";

const SignupAdmin = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [welcome, setWelcome] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Signup failed");

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
    <AuthSplitLayout
      title="Signup Admin"
      subtitle="Create a new admin account"
      bottomText="Already have an account?"
      bottomLinkText="Login"
      bottomLinkTo="/admin/login"
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {welcome && <div className="alert alert-success">Account Created!</div>}

      <form onSubmit={signup} className="mt-3">
        <input className="form-control mb-2" placeholder="First name" value={form.name} onChange={onChange("name")} />
        <input className="form-control mb-2" placeholder="Last name" value={form.last_name} onChange={onChange("last_name")} />
        <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={onChange("email")} />
        <input className="form-control mb-3" type="password" placeholder="Password" value={form.password} onChange={onChange("password")} />

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Admin Account"}
        </button>

        <button className="btn btn-outline-secondary w-100 mt-2" type="button" onClick={() => navigate("/")}>
          Back Home
        </button>
      </form>
    </AuthSplitLayout>
  );
};

export default SignupAdmin;