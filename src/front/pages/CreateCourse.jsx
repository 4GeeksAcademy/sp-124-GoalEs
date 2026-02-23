import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { UploadCourseImage } from "./UploadCourseImage"; 

export const CreateCourse = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { store } = useGlobalReducer();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: "",
    coach_id: store.coach?.id || "",
    image_url: "",
    category_id: "",
    tag_ids: [] 
  });

  const [error, setError] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]); 

  const token =
    store.token ||
    localStorage.getItem("token-admin") ||
    localStorage.getItem("token-coach");

  const isAdmin = !!localStorage.getItem("token-admin");

  useEffect(() => { 
    if (!isAdmin) return;

    fetch(`${BACKEND_URL}/coach`) 
      .then(res => res.json())
      .then(data => setCoaches(data.coaches || []));
  }, [isAdmin, BACKEND_URL]);

  useEffect(() => {
    if (store.coach?.id) {
      setForm(prev => ({ ...prev, coach_id: store.coach.id }));
    }
  }, [store.coach]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let res = await fetch(`${BACKEND_URL}/categories`);
        if (!res.ok) res = await fetch(`${BACKEND_URL}/api/categories`);

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error fetching categories");
        setCategories(data.categories || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, [BACKEND_URL]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        let res = await fetch(`${BACKEND_URL}/tags`);
        if (!res.ok) res = await fetch(`${BACKEND_URL}/api/tags`);

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error fetching tags");
        setTags(data.tags || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTags();
  }, [BACKEND_URL]);

  const createCourse = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.cost) {
      setError("All fields are required");
      return;
    }

    if (!form.category_id) {
      setError("Category is required");
      return;
    }

    if (isAdmin && !form.coach_id) {
      setError("Coach not found. Please login again.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form) 
      });

      if (!res.ok) throw new Error("Error creating course");

      if (isAdmin) navigate("/courses");
      else navigate("/coach/private");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container py-4">
      <h1>Create Course</h1>

      {error && <div className="text-danger mb-3">{error}</div>}

      <form onSubmit={createCourse}>
        <select
          className="form-select mb-2"
          value={form.coach_id}
          onChange={(e) => setForm(p => ({ ...p, coach_id: e.target.value }))}
        >
          <option value="">Select coach</option>
          {coaches.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.last_name} (id: {c.id})
            </option>
          ))}
        </select>

        <select
          className="form-select mb-2"
          value={form.category_id}
          onChange={(e) => setForm(p => ({ ...p, category_id: e.target.value }))}
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="mt-3 mb-2">
          <label className="form-label">Tags (optional)</label>

          {tags.length === 0 ? (
            <div className="text-muted">No tags available.</div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {tags.map((t) => {
                const checked = (form.tag_ids || []).includes(t.id);
                const tagId = Number(t.id);

                return (
                  <label key={t.id} className="border rounded px-2 py-1">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={checked}
                      onChange={(e) => {
                        setForm((prev) => {
                          const prevIds = prev.tag_ids || [];
                          const nextIds = e.target.checked
                            ? [...prevIds, tagId]
                            : prevIds.filter((id) => id !== tagId);
                          return { ...prev, tag_ids: nextIds };
                        });
                      }}
                    />
                    {t.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Cost"
          value={form.cost}
          onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
        />

        <UploadCourseImage
          initialUrl={form.image_url}
          onUpload={(url) => setForm(p => ({ ...p, image_url: url }))}
        />

        <button className="btn btn-success">Create</button>
      </form>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
};