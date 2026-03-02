import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { UploadCourseImage } from "./UploadCourseImage";
import "./styles/editCourse.css"


export const EditCourse = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { store } = useGlobalReducer();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: "",
    image_url: "",
    category_id: "",
    tag_ids: []
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach");
  const isAdmin = !!localStorage.getItem("token-admin");

  const handleBack = () => {
    if (localStorage.getItem("token-admin")) navigate("/admin/home");
    else navigate("/coach/private");
  };

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error loading course");

      const data = await res.json();
      const course = data.course ?? data;
      const tagIdsFromCourse = Array.isArray(course.tags) ? course.tags.map(t => t.id) : [];

      setForm({
        title: course.title,
        description: course.description,
        cost: course.cost,
        image_url: course.image_url || "",
        category_id: course.category_id || "",
        tag_ids: tagIdsFromCourse
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/categories`);
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

  const updateCourse = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error updating course");

      if (isAdmin) navigate("/courses");
      else navigate("/coach/private");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="container py-4">Loading...</p>;
  if (error) return <p className="container py-4 text-danger">{error}</p>;

  return (
    <div className="coach-edit-course-layout">

      <div className="coach-edit-course-container">

        <h1 className="coach-edit-course-title">
          Edit Course #{id}
        </h1>

        <form onSubmit={updateCourse} className="coach-edit-course-form">

          {/* Category */}
          <div className="coach-edit-course-field">
            <label>Category</label>
            <select
              className="coach-edit-course-select"
              value={form.category_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, category_id: e.target.value }))
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="coach-edit-course-field">
            <label>Tags (optional)</label>

            {tags.length === 0 ? (
              <div className="coach-edit-course-muted">
                No tags available.
              </div>
            ) : (
              <div className="coach-edit-course-tags">
                {tags.map((t) => {
                  const tagId = Number(t.id);
                  const checked = (form.tag_ids || []).includes(tagId);

                  return (
                    <label key={t.id} className="coach-edit-course-tag">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setForm((prev) => {
                            const prevIds = (prev.tag_ids || []).map(Number);
                            const nextIds = e.target.checked
                              ? [...prevIds, tagId]
                              : prevIds.filter((id) => id !== tagId);
                            return { ...prev, tag_ids: nextIds };
                          });
                        }}
                      />
                      <span>{t.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="coach-edit-course-field">
            <label>Title</label>
            <input
              className="coach-edit-course-input"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>

          {/* Description */}
          <div className="coach-edit-course-field">
            <label>Description</label>
            <textarea
              className="coach-edit-course-textarea"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>

          {/* Cost */}
          <div className="coach-edit-course-field">
            <label>Cost</label>
            <input
              type="number"
              max={999999999}
              className="coach-edit-course-input"
              value={form.cost}
              onChange={(e) =>
                setForm((p) => ({ ...p, cost: e.target.value }))
              }
            />
          </div>

          {/* Image Upload */}
          <div className="coach-edit-course-field">
            <label>Course Image</label>
            <UploadCourseImage
              initialUrl={form.image_url}
              onUpload={(url) =>
                setForm((p) => ({ ...p, image_url: url }))
              }
            />
          </div>

          <button className="coach-edit-course-save-btn">
            Save Changes
          </button>

        </form>

        <div className="coach-edit-course-actions">
          <button
            className="coach-edit-course-secondary-btn"
            onClick={handleBack}
            type="button"
          >
            Back to Dashboard
          </button>

          <button
            className="coach-edit-course-outline-btn"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>

      </div>

    </div>
  );
};

