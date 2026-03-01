import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/completeprofileCoach.css"

export const CoachUploadImage = ({ uploadPhoto }) => {

    const { dispatch, store } = useGlobalReducer();
    const [img, setImg] = useState(store.coach.profile_image || "");
    const [loading, setLoading] = useState(false);

    const sendImage = async (photo) => {
        if (!photo) return;

        if (!["image/jpeg", "image/png"].includes(photo.type)) {
            alert("Only JPG or PNG format");
            return;
        }

        if (photo.size > 1 * 1024 * 1024) {
            alert("Max is 1MB");
            return;
        }

        const formAdd = new FormData();
        formAdd.append("file", photo);
        formAdd.append("upload_preset", "coach pictures");

        try {
            setLoading(true);

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/db3f4alnp/image/upload", {
                method: "POST",
                body: formAdd
            }
            );

            if (!res.ok) {
                const errorPhoto = await res.json();
                throw new Error(errorPhoto.error?.message || "Upload failed");
            }

            const data = await res.json();

            setImg(data.secure_url);

            if (uploadPhoto) {
                uploadPhoto(data.secure_url);
            }

            dispatch({
                type: "upload-coach",
                payload: {
                    ...store.coach,
                    profile_image: data.secure_url
                }
            });

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coach-image-section">

            {loading && (
                <p className="coach-image-loading">
                    Waiting for upload...
                </p>
            )}

            {img && (
                <img
                    src={img}
                    alt="Profile picture"
                    className="coach-avatar"
                />
            )}

            <label className="coach-upload-btn">
                Select Image
                <input
                    className="coach-file-input"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(event) => sendImage(event.target.files[0])}
                />
            </label>

        </div>
    );
};