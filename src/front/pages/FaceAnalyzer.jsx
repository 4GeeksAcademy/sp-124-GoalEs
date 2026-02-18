import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FaceAnalyzer = () => {

    const [analysis, setAnalysis] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const base64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });

    const analyzeFace = async (file) => {

        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("image", file);

        const options = {
            method: "POST",
            headers: {
                "x-rapidapi-key": "1f25046d98msh8487c466e02ac7dp1710ccjsnbd11d3fb1d06",
                "x-rapidapi-host": "faceanalyzer-ai.p.rapidapi.com"
            },
            body: formData
        };

        try {
            const response = await fetch(
                "https://faceanalyzer-ai.p.rapidapi.com/faceanalysis",
                options
            );

            const result = await response.json();
            const face = result.body.faces[0];

            setAnalysis({
                emotion: face.facialFeatures.Emotions[0],
                gender: face.facialFeatures.Gender,
                ageRange: `${face.facialFeatures.AgeRange.Low}-${face.facialFeatures.AgeRange.High}`
            });

        } catch (error) {
            console.error(error);
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
                    <p><strong>Emotion:</strong> {analysis.emotion}</p>
                    <p><strong>Gender detected:</strong> {analysis.gender}</p>
                    <p><strong>Estimated age:</strong> {analysis.ageRange}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/users/home")}>Dashboard</button>
                </div>
                
            )}
        </>
    );
};
