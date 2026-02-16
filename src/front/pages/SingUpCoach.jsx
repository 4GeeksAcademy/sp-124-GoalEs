import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SingUpCoach = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

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

      if (!res.ok) throw new Error("Error creating coach");

      navigate("/coaches");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sing Coach</h2>

      <form onSubmit={createCoach} className="col-md-6">

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-3"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="form-control mb-3"
          value={form.last_name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn btn-success">Create Coach</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/main")}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};
