import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const back_url = import.meta.env.VITE_BACKEND_URL;

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({ name: "", surname: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setError("");
      const res = await fetch(`${back_url}/users/${id}`);
      if (!res.ok) throw new Error("Error to fetch user");

      const data = await res.json();
      const user = data.user ?? data;

      setForm({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        password: user.password || "", 
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // PUT 
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.surname || !form.email) {
      setError("Fill name, surname and email to update.");
      return;
    }

    try {
      setError("");
      const res = await fetch(`${back_url}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error to update user");

      navigate("/users");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="container py-4">Loading...</p>;
  if (error) return <p className="container py-4 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <h1>Edit User #{id}</h1>

      <form onSubmit={handleUpdate} className="mt-3">
        <input
          className="form-control mb-2"
          placeholder="name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />

        <input
          className="form-control mb-2"
          placeholder="surname"
          value={form.surname}
          onChange={(e) => setForm((p) => ({ ...p, surname: e.target.value }))}
        />

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

        <button className="btn btn-primary">Save</button>
      </form>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/users")}>
          Back to Users
        </button>

        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default EditUser;