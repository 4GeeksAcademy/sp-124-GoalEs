import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export const Categories = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate(); 

    const token = localStorage.getItem("token-admin");
    const isAdmin = !!token;

    const [categories, setCategories] = useState([]);
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

    const fetchCategories = async () => {
        try {
            setError("");
            setLoading(true);

            const res = await fetch(`${BACKEND_URL}/categories`);
            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || "Error fetching categories");

            setCategories(data.categories || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [BACKEND_URL]);

    const addCategory = async (e) => {
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
            const res = await fetch(`${BACKEND_URL}/categories`, {
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
            if (!res.ok) throw new Error(data?.error || "Error creating category");

            setName("");
            setDescription("");
            await fetchCategories();
        } catch (e) {
            setError(e.message);
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditName(cat.name || "");
        setEditDescription(cat.description || "");
        setEditIsActive(cat.is_active ?? true);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditDescription("");
        setEditIsActive(true);
    };

    const saveEdit = async (catId) => {
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
            const res = await fetch(`${BACKEND_URL}/categories/${catId}`, {
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
            if (!res.ok) throw new Error(data?.error || "Error updating category");

            cancelEdit();
            await fetchCategories();
        } catch (e) {
            setError(e.message);
        }
    };

    const deleteCategory = async (catId) => {
        setError("");

        if (!isAdmin) {
            setError("Admin token not found.");
            return;
        }

        const ok = window.confirm("Are you sure you want to delete this category?");
        if (!ok) return;

        try {
            const res = await fetch(`${BACKEND_URL}/categories/${catId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Error deleting category");

            await fetchCategories();
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="container py-4">
            {/* ✅ add: header row with back button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">Manage Categories</h1>

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
                    You must be logged in as <strong>Admin</strong> to manage categories.
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Add new */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Add new category</h5>

                    <form onSubmit={addCategory} className="row g-2">
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
                    <h5 className="card-title mb-3">Categories</h5>

                    {loading ? (
                        <p>Loading...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-muted">No categories found.</p>
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
                                    {categories.map((cat) => {
                                        const isEditing = editingId === cat.id;

                                        return (
                                            <tr key={cat.id}>
                                                <td>{cat.id}</td>

                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            className="form-control"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                        />
                                                    ) : (
                                                        cat.name
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
                                                        cat.description || <span className="text-muted">—</span>
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
                                                        String(cat.is_active ?? true)
                                                    )}
                                                </td>

                                                <td className="text-end">
                                                    {!isAdmin ? (
                                                        <span className="text-muted">—</span>
                                                    ) : isEditing ? (
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => saveEdit(cat.id)}
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
                                                                onClick={() => startEdit(cat)}
                                                                type="button"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => deleteCategory(cat.id)}
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