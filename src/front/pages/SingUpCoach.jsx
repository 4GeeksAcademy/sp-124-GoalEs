import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AuthSplitLayout } from "./Layouts/AuthSplitLayout";

export const SingUpCoach = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createCoach = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendURL}/coach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      localStorage.setItem("token-coach", data.token);
      localStorage.setItem("coach", JSON.stringify(data.coach));
      localStorage.setItem("role", "coach")

      dispatch({
        type: "login-coach",
        payload: {
          token: data.token,
          coach: data.coach,
        }

      });

      if (!res.ok) throw new Error("Error to singup coach");

      navigate("/coaches/login");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthSplitLayout
      title="Coach Signup"
      subtitle="Create your coach account"
      bottomText="Already have an account?"
      bottomLinkText="Login"
      bottomLinkTo="/coaches/login"
    >
      <form onSubmit={createCoach} className="mt-3">
        <input type="text" name="name" placeholder="Name" className="form-control mb-3" value={form.name} onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" className="form-control mb-3" value={form.last_name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="form-control mb-3" value={form.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="form-control mb-3" value={form.password} onChange={handleChange} />

        <button type="submit" className="btn btn-success w-100">
          Create Coach
        </button>

        <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </form>
    </AuthSplitLayout>
  );
};
