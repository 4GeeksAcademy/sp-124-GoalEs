import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/userDetails.css"

const back_url = import.meta.env.VITE_BACKEND_URL;

export const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        try {
            setError("");
            const res = await fetch(`${back_url}/users/${id}`, {
                //added by arash
                headers: { Authorization: `Bearer ${localStorage.getItem("token-user") || localStorage.getItem("token-admin")}` },
            });
            if (!res.ok) throw new Error("Error fetching user details");

            const data = await res.json();
            setUsers(data.user ?? data);
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (error) return <div style={{ color: "red" }}>{error}</div>;


    return (
        <div className="user-details-layout">

            <div className="user-details-container">

                <h1 className="user-details-title">
                    User Details
                </h1>

                <div className="user-details-card">

                    <div className="user-details-image-wrapper">
                        <img
                            src={users?.profile_picture || "https://via.placeholder.com/400"}
                            alt="Profile"
                            className="user-details-image"
                        />
                    </div>

                    <div className="user-details-info">

                        <div className="user-details-row">
                            <span className="user-details-label">Name</span>
                            <span className="user-details-value">{users.name}</span>
                        </div>

                        <div className="user-details-row">
                            <span className="user-details-label">Surname</span>
                            <span className="user-details-value">{users.surname}</span>
                        </div>

                        <div className="user-details-row">
                            <span className="user-details-label">Email</span>
                            <span className="user-details-value">{users.email}</span>
                        </div>

                    </div>

                </div>

                <div className="user-details-actions">

                    <button
                        className="user-details-secondary-btn"
                        onClick={() => navigate("/users")}
                    >
                        Back to Users
                    </button>

                    <button
                        className="user-details-outline-btn"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>

                </div>

            </div>

        </div>
    );
};

export default UserDetails;