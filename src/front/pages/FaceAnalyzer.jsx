import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FaceAnalyzer = () => {

    const [analysis, setAnalysis] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_LUXAND = import.meta.env.VITE_LUXAND_API;
    const API_TOKEN = import.meta.env.VITE_LUXAND_TOKEN;

    const analyzeFace = async (file) => {

        if (!file) return;

        setError(null);
        setAnalysis(null);

        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            setError("Only JPEG and PNG images are allowed.");
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("Image must be smaller than 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        try {

            const myHeaders = new Headers();
            myHeaders.append("token", API_TOKEN);

            const formData = new FormData();
            
            formData.append("photo", file, file.name);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formData,
                redirect: "follow"
            };

            const response = await fetch(API_LUXAND, requestOptions);

            if (!response.ok) {
                const raw = await response.text();
                console.log("Luxand error raw:", raw);
                setError("Error analyzing image.");
                return;
            }

            const result = await response.json();
            console.log("Luxand FULL result:", result);

            const face = result?.faces?.[0];

            if (!face) {
                setError("No face detected.");
                return;
            }

            setAnalysis({
                dominantEmotion: face.dominant_emotion,
                emotions: face.emotion,
                gender: face.gender || "unknown",
                ageRange: face.age ? `${face.age}` : "unknown"
            });

        } catch (error) {
            console.error("Error analyzing face:", error);
            setError("Unexpected error occurred.");
        }
    };

    return (
        <>
            {!imagePreview &&
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => analyzeFace(e.target.files[0])}
                />
            }

            {error && (
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}

            {imagePreview && (
                <div className="mt-3 text-center">
                    <img
                        src={imagePreview}
                        alt="Uploaded"
                        style={{
                            width: "250px",
                            borderRadius: "10px"
                        }}
                    />
                </div>
            )}

            {analysis && (
                <div className="alert alert-info mt-3">
                    <p><strong>Dominant Emotion:</strong> {analysis.dominantEmotion}</p>

                    {analysis.emotions && (
                        <div className="mt-3">
                            <h5>Emotion breakdown:</h5>
                            {Object.entries(analysis.emotions)
                                .sort((a, b) => b[1] - a[1])
                                .map(([key, value]) => (
                                    <p key={key}>
                                        <strong>{key}:</strong> {value.toFixed(2)}%
                                    </p>
                                ))}
                        </div>
                    )}

                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => navigate("/users/home")}
                    >
                        Dashboard
                    </button>
                </div>
            )}
        </>
    );
};