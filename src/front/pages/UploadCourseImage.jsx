import React, { useState, useEffect } from "react";
import "./styles/createCoursesCoach.css"


export const UploadCourseImage = ({ initialUrl = "", onUpload }) => {
  const [imageUrl, setImageUrl] = useState(initialUrl || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImageUrl(initialUrl || "");
  }, [initialUrl]);

  const uploadImage = async (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG or PNG allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max size is 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    formData.append("upload_preset", "course_image");

    try {
      setLoading(true);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtggyj30o/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Upload failed");

      setImageUrl(data.secure_url);

      if (onUpload) onUpload(data.secure_url);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-image-section">

      {loading && (
        <p className="course-image-loading">
          Uploading...
        </p>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Course"
          className="course-preview-image"
        />
      )}

      <label className="course-upload-btn">
        Select Course Image
        <input
          className="course-file-input"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => uploadImage(e.target.files?.[0])}
        />
      </label>

    </div>
  );
};