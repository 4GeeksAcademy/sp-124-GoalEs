import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { UploadCourseImage } from "./UploadCourseImage";


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
    category_id: " "
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach"); 
  const isAdmin = !!localStorage.getItem("token-admin"); 

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      if (!res.ok) throw new Error("Error loading course");

      const data = await res.json();
      const course = data.course ?? data;

      setForm({
        title: course.title,
        description: course.description,
        cost: course.cost,
        image_url: course.image_url || "",
        category_id: course.category_id || ""
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

  const updateCourse = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` 
         },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error updating course");

      if (isAdmin) navigate ("/courses");
      else navigate("/coach/private");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="container py-4">Loading...</p>;
  if (error) return <p className="container py-4 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <h1>Edit Course #{id}</h1>

      <form onSubmit={updateCourse}>
        <select
          className="form-select mb-2"
          value={form.category_id}
          onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        
        <input
          className="form-control mb-2"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        />

        <textarea
          className="form-control mb-2"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        />

        <input
          className="form-control mb-3"
          type="number"
          value={form.cost}
          max={999999999}
          onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
        />

        <UploadCourseImage
        initialUrl={form.image_url}
        onUpload={(url) => setForm((p) => ({ ...p, image_url: url}))}
        />

        <button className="btn btn-primary">Save</button>
      </form>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/coach/private")}>
          Back to Dashboard
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
};

