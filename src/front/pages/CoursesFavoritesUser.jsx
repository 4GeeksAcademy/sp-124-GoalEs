import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/favoritescoursesUser.css"

export const CoursesFavoritesUser = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState("");


    const userId = store.user?.id;

    const loadFavorites = async () => {
        try {
            const res = await fetch(`${backendURL}/users/${userId}/favorites`, {
                headers: { Authorization: `Bearer ${store.token}` },
            });


            if (!res.ok) throw new Error("Error loading favorites");


            const data = await res.json();

            setFavorites(data.favorites);
        } catch (err) {
            setError(err.message);
        }
    };

    const removeFavorite = async (courseId) => {
        try {
            const res = await fetch(
                `${backendURL}/users/${userId}/favorites/${courseId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${store.token}` },
                });

            if (!res.ok) throw new Error("Error removing favorite");

            loadFavorites();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (userId) loadFavorites();
    }, [userId]);

    return (
        <div className="favorites-layout">

            <div className="favorites-container">

                <h1 className="favorites-title">My Favorite Courses</h1>

                {error && (
                    <div className="favorites-error">
                        {error}
                    </div>
                )}

                {favorites.length === 0 && (
                    <p className="favorites-empty">
                        No favorite courses yet.
                    </p>
                )}

                <div className="favorites-grid">

                    {favorites.map(fav => (
                        <div key={fav.id} className="favorite-card">

                            <img
                                src={fav.course?.image_url || "https://picsum.photos/400/200"}
                                className="favorite-image"
                                alt="course"
                            />

                            <div className="favorite-content">

                                <h5 className="favorite-title">
                                    {fav.course.title}
                                </h5>

                                <p className="favorite-description">
                                    {fav.course.description}
                                </p>

                                <p className="favorite-price">
                                    ${fav.course.cost}
                                </p>

                                <p className="favorite-meta">
                                    Category: {fav.course.category?.name || "—"}
                                </p>

                                <p className="favorite-meta">
                                    Tags: {fav.course.tags?.map(t => t.name).join(", ") || "—"}
                                </p>

                                <div className="favorite-actions">
                                    <button
                                        className="favorite-remove-btn"
                                        onClick={() => removeFavorite(fav.course.id)}
                                    >
                                        Remove from Favorites
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};