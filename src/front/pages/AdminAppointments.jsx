import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminAppointments = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const token = localStorage.getItem("token-admin");
  const isAdmin = !!token;

  // data
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);     // for dropdown
  const [coaches, setCoaches] = useState([]); // for dropdown

  //state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create form
  const [userId, setUserId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [startsAtLocal, setStartsAtLocal] = useState(""); // yyyy-MM-ddTHH:mm (local)
  const [note, setNote] = useState("");

  const headersAuth = useMemo(() => ({
    Authorization: `Bearer ${token}`,
  }), [token]);

  //helpers
  const fmtMadrid = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const localToISO = (localValue) => {
    if (!localValue) return null;
    const d = new Date(localValue);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString(); // includes Z
  };

  //  fetcher
  const fetchAllAppointments = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/appointments/my`, {
        headers: headersAuth,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error fetching appointments");

      setAppointments(data.appointments || []);
    } catch (e) {
      setError(e.message || "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const res = await fetch(`${BACKEND_URL}/users`, { headers: headersAuth });
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
  };

  const fetchCoaches = async () => {
    // public
    const res = await fetch(`${BACKEND_URL}/coach`);
    const data = await res.json();
    if (res.ok) setCoaches(data.coaches || []);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchAllAppointments();
    fetchUsers();
    fetchCoaches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BACKEND_URL, isAdmin]);

  //  actions 
  const createAppointment = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) return setError("Please select a user");
    if (!coachId) return setError("Please select a coach");
    if (!startsAtLocal) return setError("Please select date & time");

    const starts_at = localToISO(startsAtLocal);
    if (!starts_at) return setError("Invalid date/time");

    try {
      const res = await fetch(`${BACKEND_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headersAuth,
        },
        body: JSON.stringify({
          user_id: Number(userId),
          coach_id: Number(coachId),
          starts_at,
          note: note.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error creating appointment");

      // reset form
      setUserId("");
      setCoachId("");
      setStartsAtLocal("");
      setNote("");

      await fetchAllAppointments();
    } catch (e) {
      setError(e.message || "Error creating appointment");
    }
  };

  const updateStatus = async (apptId, status) => {
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/coach/appointments/${apptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headersAuth,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error updating status");

      await fetchAllAppointments();
    } catch (e) {
      setError(e.message || "Error updating status");
    }
  };

  // sections
  const pending = appointments.filter((a) => a.status === "pending");
  const approved = appointments.filter((a) => a.status === "approved");
  const canceledRejected = appointments.filter(
    (a) => a.status === "canceled" || a.status === "rejected"
  );

  const userNameById = (id) => {
    const u = users.find((x) => Number(x.id) === Number(id));
    if (!u) return `User #${id}`;
    return `${u.name ?? ""} ${u.surname ?? ""}`.trim() || `User #${id}`;
  };

  const coachNameById = (id) => {
    const c = coaches.find((x) => Number(x.id) === Number(id));
    if (!c) return `Coach #${id}`;
    return `${c.name ?? ""} ${c.last_name ?? ""}`.trim() || `Coach #${id}`;
  };

  const Section = ({ title, items, renderActions }) => (
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
                  <th style={{ width: 80 }}>ID</th>
                  <th>User</th>
                  <th>Coach</th>
                  <th style={{ width: 190 }}>Starts at (Madrid)</th>
                  <th>Note</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th style={{ width: 240 }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{userNameById(a.user_id)}</td>
                    <td>{coachNameById(a.coach_id)}</td>
                    <td>{fmtMadrid(a.starts_at)}</td>
                    <td>{a.note || <span className="text-muted">—</span>}</td>
                    <td>
                      <span className="badge text-bg-secondary">{a.status}</span>
                    </td>
                    <td className="text-end">{renderActions?.(a) || <span className="text-muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Admin token not found. Please login as admin.
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/login")}>
          Go to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Manage Appointments </h1>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" type="button" onClick={fetchAllAppointments}>
            Refresh
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate("/admin/home")}>
            Back to Admin Dashboard
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* CREATE */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create an appointment</h5>

          <form onSubmit={createAppointment} className="row g-2">
            <div className="col-md-4">
              <select
                className="form-select"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.surname}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={coachId}
                onChange={(e) => setCoachId(e.target.value)}
              >
                <option value="">Select coach</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <input
                className="form-control"
                type="datetime-local"
                value={startsAtLocal}
                onChange={(e) => setStartsAtLocal(e.target.value)}
              />
              
            </div>

            <div className="col-md-10">
              <input
                className="form-control"
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-grid">
              <button className="btn btn-success">Create</button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Section
            title={`Pending (${pending.length})`}
            items={pending}
            renderActions={(a) => (
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
                <button
                  className="btn btn-outline-warning btn-sm"
                  type="button"
                  onClick={() => updateStatus(a.id, "canceled")}
                >
                  Cancel
                </button>
              </div>
            )}
          />

          <Section
            title={`Approved (${approved.length})`}
            items={approved}
            renderActions={(a) => (
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
          />

          <Section
            title={`Canceled / Rejected (${canceledRejected.length})`}
            items={canceledRejected}
          />
        </>
      )}
    </div>
  );
};