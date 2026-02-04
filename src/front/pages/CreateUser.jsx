import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const back_url = "https://glorious-engine-wr4pp7xr49g5c5gj9-3001.app.github.dev";

const CreateUser = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", surname: "", email: "", password: "" });
    const [error, setError] = useState("");
   
    const userCreate = async (e) => {
        e.preventDefault();

         if (!form.name || !form.surname || !form.email) {
      setError("Fill name, surname and email to complete.");
      return;
    }

    try {
      setError("");
      const res = await fetch(`${back_url}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error to create user");

      navigate("/users");
    } catch (e) {
        setError(e.message);
    }
};
   
    return (
        <>
<div className="container py-4">
    <h1>Create User</h1>
{error && <div className="text-danger mb-3">{error}</div>}

      <form onSubmit={userCreate} className="mt-3">
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

        <button className="btn btn-success">Create</button>
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
        </>
     
    );
};

export default CreateUser