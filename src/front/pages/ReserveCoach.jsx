import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ReserveCoach = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams(); // coach id
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  const token = store.token || localStorage.getItem("token-user");

  const [coach, setCoach] = useState(null);
  const [startsAt, setStartsAt] = useState(""); // datetime-local string
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        setError("");
        const res = await fetch(`${BACKEND_URL}/coach/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error loading coach");
        setCoach(data.coach || data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [BACKEND_URL, id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Please login as user first.");
      return;
    }
    if (!startsAt) {
      setError("Please select date & time.");
      return;
    }

    const starts_at = new Date(startsAt).toISOString();

    try {
      const res = await fetch(`${BACKEND_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          coach_id: Number(id),
          starts_at,
          note: note || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error creating appointment");

      navigate(-1);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="mb-3">Reserve with {coach?.name} {coach?.last_name}</h1>

      <form onSubmit={submit} className="card p-3">
        <label className="form-label">Date & time</label>
        <input
          type="datetime-local"
          className="form-control mb-3"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          min={new Date().toISOString().slice(0, 16)} 
        />

        <label className="form-label">Note (optional)</label>
        <textarea
          className="form-control mb-3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any details..."
        />

        <button className="btn btn-success">Reserve</button>
      </form>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="btn btn-primary"  type="button" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </div>
    </div>
  );
};