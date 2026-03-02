import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/categories.css"

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
    <div className="admin-categories-layout">

      <div className="admin-categories-container">

        {/* HEADER */}
        <div className="admin-categories-header">

          <h1 className="admin-categories-title">
            Manage Tags
          </h1>

        </div>

        {!isAdmin && (
          <div className="admin-warning">
            You must be logged in as <strong>Admin</strong> to manage tags.
          </div>
        )}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ADD TAG */}
        <div className="admin-card">

          <h2 className="admin-section-title">
            Add New Tag
          </h2>

          <form onSubmit={addTag} className="admin-form-grid">

            <input
              className="admin-input"
              placeholder="Name (required)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isAdmin}
            />

            <input
              className="admin-input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isAdmin}
            />

            <button
              className="admin-success-btn"
              disabled={!isAdmin}
            >
              Add
            </button>

          </form>

        </div>

        {/* LIST */}
        <div className="admin-card">

          <h2 className="admin-section-title">
            Tags
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : tags.length === 0 ? (
            <p className="admin-muted">No tags found.</p>
          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Active</th>
                    <th className="admin-table-actions-header">
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
                              className="admin-input"
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
                              className="admin-input"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          ) : (
                            tag.description || <span className="admin-muted">—</span>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="admin-input"
                              value={editIsActive ? "true" : "false"}
                              onChange={(e) =>
                                setEditIsActive(e.target.value === "true")
                              }
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                            <span className={`admin-status ${tag.is_active ? "active" : "inactive"}`}>
                              {String(tag.is_active ?? true)}
                            </span>
                          )}
                        </td>

                        <td className="admin-table-actions">

                          {!isAdmin ? (
                            <span className="admin-muted">—</span>
                          ) : isEditing ? (
                            <>
                              <button
                                className="admin-primary-btn small"
                                onClick={() => saveEdit(tag.id)}
                                type="button"
                              >
                                Save
                              </button>

                              <button
                                className="admin-secondary-btn small"
                                onClick={cancelEdit}
                                type="button"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="admin-outline-btn small"
                                onClick={() => startEdit(tag)}
                                type="button"
                              >
                                Edit
                              </button>

                              <button
                                className="admin-delete-btn small"
                                onClick={() => deleteTag(tag.id)}
                                type="button"
                              >
                                Delete
                              </button>
                            </>
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