import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyAppointmentsCoach = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  const token =
    store.token ||
    localStorage.getItem("token-coach") ||
    localStorage.getItem("token-admin"); // اگر خواستی admin هم بعداً ببینه

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/coach/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error fetching appointments");

      setAppointments(data.appointments || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAppointments();
  }, [BACKEND_URL]);

  const updateStatus = async (apptId, status) => {
    try {
      setError("");

      const res = await fetch(`${BACKEND_URL}/coach/appointments/${apptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error updating appointment");

      await fetchAppointments();
    } catch (e) {
      setError(e.message);
    }
  };

  const fmt = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return iso;
    }
  };

  const pending = appointments.filter((a) => a.status === "pending");
  const approved = appointments.filter((a) => a.status === "approved");
  const rejected = appointments.filter((a) => a.status === "rejected");
  const canceled = appointments.filter((a) => a.status === "canceled");

  const Section = ({ title, items, children }) => (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title mb-3">{title}</h5>

        {items.length === 0 ? (
          <div className="text-muted">No items.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>ID</th>
                  <th>Starts at</th>
                  <th style={{ width: 120 }}>User</th>
                  <th>Note</th>
                  <th style={{ width: 160 }}>Status</th>
                  <th style={{ width: 240 }} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{fmt(a.starts_at)}</td>
                    <td>{a.user_id}</td>
                    <td>{a.note || <span className="text-muted">—</span>}</td>
                    <td>
                      <span className="badge text-bg-secondary">{a.status}</span>
                    </td>
                    <td className="text-end">{children(a)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  if (!token) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Coach token not found. Please login again.
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/coaches/login")}>
          Go to Coach Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">My Appointments</h1>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" type="button" onClick={fetchAppointments}>
            Refresh
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate("/coach/private")}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Section title={`Pending (${pending.length})`} items={pending}>
            {(a) => (
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-success btn-sm"
                  type="button"
                  onClick={() => updateStatus(a.id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  type="button"
                  onClick={() => updateStatus(a.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </Section>

          <Section title={`Approved (${approved.length})`} items={approved}>
            {(a) => (
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-outline-warning btn-sm"
                  type="button"
                  onClick={() => updateStatus(a.id, "canceled")}
                >
                  Cancel
                </button>
              </div>
            )}
          </Section>

          <Section title={`Rejected (${rejected.length})`} items={rejected}>
            {() => <span className="text-muted">—</span>}
          </Section>

          <Section title={`Canceled (${canceled.length})`} items={canceled}>
            {() => <span className="text-muted">—</span>}
          </Section>
        </>
      )}
    </div>
  );
};