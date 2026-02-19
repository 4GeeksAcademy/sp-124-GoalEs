import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FaceAnalyzer = () => {

    const [analysis, setAnalysis] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const API_LUXAND = import.meta.env.VITE_LUXAND_API
    const API_TOKEN = import.meta.env.VITE_LUXAND_TOKEN

    const analyzeFace = async (file) => {

        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        try {

            const formData = new FormData();
            formData.append("photo", file);

            const response = await fetch(
                API_LUXAND,
                {
                    method: "POST",
                    headers: {
                        "token": API_TOKEN
                    },
                    body: formData
                }
            );

            const result = await response.json();
            console.log("Luxand FULL result:", result);

            const face = result?.faces?.[0];

            if (!face) {
                console.log("No face detected");
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
        }
    };


    return (
        <>
            {!imagePreview &&
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => analyzeFace(e.target.files[0])}
                />
            }

            {imagePreview && (
                <div className="mt-3 text-center">
                    <img
                        src={imagePreview}
                        alt="Uploaded"
                        style={{
                            width: "250px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
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
