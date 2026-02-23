import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { UploadImagesUser } from "./UploadImagesUser";

export const CompleteProfileUser = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        profile_picture: ""
    });

    useEffect(() => {
        if (store.user) {
            setForm(prev => ({
                ...prev,
                name: store.user.name || "",
                surname: store.user.surname || "",
                email: store.user.email || "",
                age: store.user.age || "",
                gender: store.user.gender || "",
                profile_picture: store.user.profile_picture || "",
                id: store.user.id
            }));

            console.log(form)
        }
    }, [store.user]);

    const [error, setError] = useState("");

    const updateProfileUser = async (e) => {
        e.preventDefault();
        setError("");

        const body = {
            name: form.name,
            surname: form.surname,
            email: form.email,
            age: form.age,
            gender: form.gender,
            profile_picture: form.profile_picture,
            id: form.id
        };

        if (form.password.trim() !== "") {
            body.password = form.password;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/users/${store.user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}` //added by arash, to send the token in the request header for authentication
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error("Error updating profile");

            const data = await res.json();

            localStorage.setItem("user", JSON.stringify(data));

            dispatch({
                type: "update-user",
                payload: data
            });

            navigate("/users/home");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container py-4">
            <h1>Your Profile</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <UploadImagesUser
                onUpload={(url) =>
                    setForm(prev => ({ ...prev, profile_picture: url }))
                }
            />

            <form onSubmit={updateProfileUser}>

                <input
                    className="form-control mb-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, name: event.target.value }))
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Surname"
                    value={form.surname}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, surname: event.target.value }))
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Email"
                    value={form.email}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, email: event.target.value }))
                    }
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="New Password"
                    value={form.password}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, password: event.target.value }))
                    }
                />

                <input
                    className="form-control mb-3"
                    type="number"
                    placeholder="Age"
                    value={form.age}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, age: event.target.value }))
                    }
                />

                <select
                    className="form-control mb-3"
                    value={form.gender}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, gender: event.target.value }))
                    }
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <button className="btn btn-primary">
                    Save Profile
                </button>
            </form>

        </div>
    );
};
