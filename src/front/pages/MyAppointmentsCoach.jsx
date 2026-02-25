import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyAppointmentsCoach = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("token-coach");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMine = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/coach/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error fetching appointments");

      setItems(data.appointments || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, [BACKEND_URL]);

  const setStatus = async (id, status) => {
    try {
      const res = await fetch(`${BACKEND_URL}/coach/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error updating appointment");

      await fetchMine();
    } catch (e) {
      alert(e.message);
    }
  };

  if (!token) return <div className="container py-4">Please login as coach.</div>;
  if (loading) return <div className="container py-4">Loading...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="mb-3">My Appointments (Coach)</h1>

      {items.length === 0 ? (
        <p className="text-muted">No appointments yet.</p>
      ) : (
        <div className="list-group">
          {items.map((a) => (
            <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div><strong>User ID:</strong> {a.user_id}</div>
                <div><strong>Starts:</strong> {a.starts_at}</div>
                <div><strong>Status:</strong> {a.status}</div>
                {a.note ? <div><strong>Note:</strong> {a.note}</div> : null}
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-success btn-sm" onClick={() => setStatus(a.id, "approved")}>
                  Approve
                </button>
                <button className="btn btn-warning btn-sm" onClick={() => setStatus(a.id, "rejected")}>
                  Reject
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => setStatus(a.id, "canceled")}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};