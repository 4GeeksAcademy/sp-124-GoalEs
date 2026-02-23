import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Tags = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const token = localStorage.getItem("token-admin");
  const isAdmin = !!token;

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add new
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Edit inline
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const fetchTags = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/tags`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Error fetching tags");

      setTags(data.tags || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [BACKEND_URL]);

  const addTag = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAdmin) {
      setError("Admin token not found.");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error creating tag");

      setName("");
      setDescription("");
      await fetchTags();
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (tag) => {
    setEditingId(tag.id);
    setEditName(tag.name || "");
    setEditDescription(tag.description || "");
    setEditIsActive(tag.is_active ?? true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditIsActive(true);
  };

  const saveEdit = async (tagId) => {
    setError("");

    if (!isAdmin) {
      setError("Admin token not found.");
      return;
    }

    if (!editName.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/tags/${tagId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || null,
          is_active: !!editIsActive
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error updating tag");

      cancelEdit();
      await fetchTags();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteTag = async (tagId) => {
    setError("");

    if (!isAdmin) {
      setError("Admin token not found.");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this tag?");
    if (!ok) return;

    try {
      const res = await fetch(`${BACKEND_URL}/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error deleting tag");

      await fetchTags();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Manage Tags</h1>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/home")}
          type="button"
        >
          Back to Admin Dashboard
        </button>
      </div>

      {!isAdmin && (
        <div className="alert alert-warning">
          You must be logged in as <strong>Admin</strong> to manage tags.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add new */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add new tag</h5>

          <form onSubmit={addTag} className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Name (required)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-success" disabled={!isAdmin}>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Tags</h5>

          {loading ? (
            <p>Loading...</p>
          ) : tags.length === 0 ? (
            <p className="text-muted">No tags found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{ width: 110 }}>Active</th>
                    <th style={{ width: 220 }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => {
                    const isEditing = editingId === tag.id;

                    return (
                      <tr key={tag.id}>
                        <td>{tag.id}</td>

                        <td>
                          {isEditing ? (
                            <input
                              className="form-control"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          ) : (
                            tag.name
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="form-control"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          ) : (
                            tag.description || <span className="text-muted">—</span>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="form-select"
                              value={editIsActive ? "true" : "false"}
                              onChange={(e) => setEditIsActive(e.target.value === "true")}
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                            String(tag.is_active ?? true)
                          )}
                        </td>

                        <td className="text-end">
                          {!isAdmin ? (
                            <span className="text-muted">—</span>
                          ) : isEditing ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => saveEdit(tag.id)}
                                type="button"
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={cancelEdit}
                                type="button"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => startEdit(tag)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteTag(tag.id)}
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};