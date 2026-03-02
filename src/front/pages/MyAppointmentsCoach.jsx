import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/myappointmentsCoach.css"

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
      <div className="coach-appointments-layout">
        <div className="coach-appointments-container">

          <div className="coach-warning">
            Coach token not found. Please login again.
          </div>

          <button
            className="coach-primary-btn"
            onClick={() => navigate("/coaches/login")}
          >
            Go to Coach Login
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="coach-appointments-layout">

      <div className="coach-appointments-container">

        <div className="coach-appointments-header">

          <h1 className="coach-appointments-title">
            My Appointments
          </h1>

          <div className="coach-appointments-actions">

            <button
              className="coach-outline-btn"
              type="button"
              onClick={fetchAppointments}
            >
              Refresh
            </button>

            <button
              className="coach-secondary-btn"
              type="button"
              onClick={() => navigate("/coach/private")}
            >
              Back to Dashboard
            </button>

          </div>

        </div>

        {error && (
          <div className="coach-error">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="coach-appointments-sections">

            <Section
              title={`Pending (${pending.length})`}
              items={pending}
            >
              {(a) => (
                <div className="coach-appointment-actions">
                  <button
                    className="coach-approve-btn"
                    onClick={() => updateStatus(a.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="coach-reject-btn"
                    onClick={() => updateStatus(a.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </Section>

            <Section
              title={`Approved (${approved.length})`}
              items={approved}
            >
              {(a) => (
                <div className="coach-appointment-actions">
                  <button
                    className="coach-cancel-btn"
                    onClick={() => updateStatus(a.id, "canceled")}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </Section>

            <Section
              title={`Rejected (${rejected.length})`}
              items={rejected}
            >
              {() => <span className="coach-muted">—</span>}
            </Section>

            <Section
              title={`Canceled (${canceled.length})`}
              items={canceled}
            >
              {() => <span className="coach-muted">—</span>}
            </Section>

          </div>
        )}

      </div>

    </div>
  );
};