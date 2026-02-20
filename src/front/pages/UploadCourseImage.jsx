import React, { useState, useEffect } from "react";


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
    <>
      {loading && <p>Uploading...</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Course"
          style={{ width: "100%", maxWidth: "400px", borderRadius: "12px", margin: "10px 0" }}
        />
      )}

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => uploadImage(e.target.files?.[0])}
      />
    </>
  );
};