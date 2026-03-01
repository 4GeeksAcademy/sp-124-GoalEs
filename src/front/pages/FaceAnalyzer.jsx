import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/faceanalyzer.css"

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
        <div className="emotion-layout">

            <div className="emotion-container">

                <h1 className="emotion-title">
                    Face Emotion Analyzer
                </h1>

                {!imagePreview && (
                    <label className="emotion-upload-btn">
                        Upload Your Photo
                        <input
                            className="emotion-file-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => analyzeFace(e.target.files[0])}
                        />
                    </label>
                )}

                {imagePreview && (
                    <div className="emotion-image-wrapper">
                        <img
                            src={imagePreview}
                            alt="Uploaded"
                            className="emotion-image"
                        />
                    </div>
                )}

                {analysis && (
                    <div className="emotion-results">

                        <p className="emotion-dominant">
                            Dominant Emotion:
                            <span className="emotion-highlight">
                                {analysis.dominantEmotion}
                            </span>
                        </p>

                        {analysis.emotions && (
                            <div className="emotion-breakdown">

                                <h5 className="emotion-breakdown-title">
                                    Emotion Breakdown
                                </h5>

                                {Object.entries(analysis.emotions)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([key, value]) => (
                                        <div key={key} className="emotion-bar-item">
                                            <span className="emotion-bar-label">
                                                {key}
                                            </span>

                                            <div className="emotion-bar">
                                                <div
                                                    className="emotion-bar-fill"
                                                    style={{ width: `${value}%` }}
                                                />
                                            </div>

                                            <span className="emotion-bar-value">
                                                {value.toFixed(2)}%
                                            </span>
                                        </div>
                                    ))}

                            </div>
                        )}

                        <button
                            className="emotion-back-btn"
                            onClick={() => navigate("/users/home")}
                        >
                            Back to Dashboard
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};
