import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { CoachUploadImage } from "./CoachUploadImage";

export const CoachProfile = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        birthday: "",
        city: "",
        country: "",
        phone: "",
        gender: "",
        profile_image: ""

    });
  
    useEffect(() => {
        if (store.coach) {
            setForm(prev => ({
                ...prev,
                name: store.coach.name || "",
                last_name: store.coach.last_name || "",
                email: store.coach.email || "",
                birthday: store.coach.birthday || "",
                city: store.coach.city || "",
                country: store.coach.country || "",
                phone: store.coach.phone || "",
                gender: store.coach.gender || "",
                profile_image: store.coach.profile_image || ""
            }));
        }
    }, [store.coach]);


const [error, setError] = useState("");

    const updateCoachProfile = async (e) => {
        e.preventDefault();
        setError("");

        const body = {
            name: form.name,
            last_name: form.last_name,
            email: form.email,
            birthday: form.birthday,
            city: form.city,
            country: form.country,
            phone: form.phone,
            gender: form.gender,
            profile_image: form.profile_image
        };

        if (form.password.trim() !== "") {
            body.password = form.password;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/coach/${store.coach.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error("Error updating profile");
            
            const data = await res.json();
            console.log("Backend return:", data)

            localStorage.setItem("coach", JSON.stringify(data));

            dispatch({
                type: "login-coach",
                payload: {
                    token: store.token,
                    coach: data
                }
            });

            navigate("/coach/private");

        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className="container py-4">
            <h1>Complete Your Profile</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <CoachUploadImage
            uploadPhoto={(photo) =>
                setForm(prev => ({...prev, profile_image: photo}))
            }
            />

            <form onSubmit={updateCoachProfile}>

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
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, last_name: event.target.value }))
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
                    className="form-control mb-2"
                    type="date"
                    placeholder="YYYY/MM/DD"
                    value={form.birthday}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, birthday: event.target.value }))
                    }
                />
                <input
                    className="form-control mb-2"
                    placeholder="City"
                    value={form.city}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, city: event.target.value }))
                    }
                />
                <input
                    className="form-control mb-2"
                    placeholder="Country"
                    value={form.country}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, country: event.target.value }))
                    }
                />
                <input
                    className="form-control mb-2"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(event) =>
                        setForm(prev => ({ ...prev, phone: event.target.value }))
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