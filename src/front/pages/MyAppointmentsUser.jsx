import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyAppointmentsUser = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  const token = store.token || localStorage.getItem("token-user");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchMyAppointments = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/appointments/my`, {
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
    fetchMyAppointments();
  }, [BACKEND_URL]);

  const cancelAppointment = async (apptId) => {
    const ok = window.confirm("Cancel this reservation?");
    if (!ok) return;

    try {
      setError("");

      const res = await fetch(`${BACKEND_URL}/appointments/${apptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: "cancel" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error canceling appointment");

      await fetchMyAppointments();
    } catch (e) {
      setError(e.message);
    }
  };

  const nowMs = Date.now();

  const { upcoming, history } = useMemo(() => {
    const parseMs = (iso) => {
      const t = Date.parse(iso || "");
      return Number.isFinite(t) ? t : null;
    };

    const upcoming = [];
    const history = [];

    for (const a of appointments) {
      const startsMs = parseMs(a.starts_at);

      const isApprovedFuture =
        a.status === "approved" && startsMs !== null && startsMs > nowMs;

      if (isApprovedFuture) upcoming.push(a);
      else history.push(a);
    }

    // sort nice
    upcoming.sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at));
    history.sort((a, b) => Date.parse(b.starts_at) - Date.parse(a.starts_at));

    return { upcoming, history };
  }, [appointments, nowMs]);

  if (!token) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">User token not found. Please login again.</div>
        <button className="btn btn-primary" onClick={() => navigate("/users/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">My Reservations</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* UPCOMING */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Upcoming reservations ({upcoming.length})
              </h5>

              {upcoming.length === 0 ? (
                <div className="text-muted">No upcoming reservations.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>ID</th>
                        <th>Starts at</th>
                        <th style={{ width: 120 }}>Coach</th>
                        <th>Note</th>
                        <th style={{ width: 150 }}>Status</th>
                        <th style={{ width: 180 }} className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcoming.map((a) => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td>{fmt(a.starts_at)}</td>
                          <td>{a.coach_id}</td>
                          <td>{a.note || <span className="text-muted">—</span>}</td>
                          <td>
                            <span className="badge text-bg-success">{a.status}</span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              type="button"
                              onClick={() => cancelAppointment(a.id)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* HISTORY / CLOSED */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Past / Closed reservations ({history.length})
              </h5>

              {history.length === 0 ? (
                <div className="text-muted">No history yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>ID</th>
                        <th>Starts at</th>
                        <th style={{ width: 120 }}>Coach</th>
                        <th>Note</th>
                        <th style={{ width: 150 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((a) => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td>{fmt(a.starts_at)}</td>
                          <td>{a.coach_id}</td>
                          <td>{a.note || <span className="text-muted">—</span>}</td>
                          <td>
                            <span className="badge text-bg-secondary">{a.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};