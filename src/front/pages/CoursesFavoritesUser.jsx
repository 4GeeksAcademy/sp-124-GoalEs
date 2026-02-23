import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
                headers: {Authorization: `Bearer ${store.token}`},
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
                { method: "DELETE" ,
                    headers: {Authorization: `Bearer ${store.token}`},
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
        <div className="container py-4">
            <h1 className="mb-4">My Favorite Courses</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {favorites.length === 0 && (
                <p>No favorite courses yet.</p>
            )}

            <div className="row">
                {favorites.map(favorites => (
                    <div key={favorites.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={favorites.course?.image_url || "https://picsum.photos/400/200"}
                                className="card-img-top"
                                alt="course"
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{favorites.course.title}</h5>
                                <p className="card-text">{favorites.course.description}</p>
                                <p className="fw-bold">${favorites.course.cost}</p>
                                <p className="text-muted mb-1"> Category: {favorites.course.category?.name || "—"} </p>
                                <p className="text-muted mb-1"> Tags: {favorites.course.tags?.map(t => t.name).join(", ") || "—"} </p>

                                <div className="mt-auto">
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={() =>
                                            removeFavorite(favorites.course.id)
                                        }>
                                        Remove from Favorites
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};