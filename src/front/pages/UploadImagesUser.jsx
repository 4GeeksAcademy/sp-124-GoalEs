import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const UploadImagesUser = ({ onUpload }) => {

    const { dispatch, store } = useGlobalReducer();

    const [imageUrl, setImageUrl] = useState(store.user.profile_picture || "");
    const [loading, setLoading] = useState(false);


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
        formData.append("upload_preset", "profile_pictures");

        try {
            setLoading(true);

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/del56a9ta/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const data = await res.json();

            setImageUrl(data.secure_url);

            if (onUpload) {
                onUpload(data.secure_url);
            }

            dispatch({
                type: "update-user",
                payload: {
                    ...store.user,
                    profile_picture: data.secure_url
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
        <>
            {loading && <p>Uploading...</p>}

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Profile"
                    style={{ width: "200px", borderRadius: "30%", marginTop: "10px" }}
                />
            )}
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(event) => uploadImage(event.target.files[0])}
            />
        </>
    );
};
