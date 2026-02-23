import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; 
import { CoachMap } from "./CoachMap";

export const CoachDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { store } = useGlobalReducer(); 

    const [coach, setCoach] = useState();
    const [courses, setCourses] = useState([]);
    const getCoachCourses = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}/courses`);
            const data = await res.json();
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCoachDetails();
        getCoachCourses();
    }, [id]);

    const getCoachDetails = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}`, {
                headers: { Authorization: `Bearer ${store.token}` } 
            })

            if (!res.ok) throw new Error("Coach not found")

            const data = await res.json();

            setCoach(data.coach)
            console.log(data.coach)

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="card">
                        <div className="card-body">
                            {!coach &&
                                <div className="form-flotating">
                                    <p>Loading...</p>
                                </div>
                            }
                            {coach &&
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <img
                                            src={coach.profile_image || `https://ui-avatars.com/api/?name=${coach.name}`}
                                            alt="Profile"
                                            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                        <div>
                                            <h2 className="mb-0">{coach.name} {coach.last_name}</h2>
                                            <p className="text-muted mb-0">{coach.email}</p>
                                            {coach.city && (
                                                <p className="mb-0">📍 {coach.city}, {coach.province}, {coach.country}</p>
                                            )}
                                        </div>
                                    </div>
                                    <h5 className="mt-4">Available Courses</h5>
                                    {courses.length === 0 && <p className="text-muted">No courses available.</p>}
                                    <div className="row mt-2">
                                        {courses.map(course => (
                                            <div key={course.id} className="col-md-4 mb-3">
                                                <div className="card h-100 shadow-sm">
                                                     <img
                                                        src={course.image_url || "https://picsum.photos/400/200"}
                                                        className="card-img-top"
                                                        alt={course.title}
                                                    />
                                                    <div className="card-body">
                                                        <h6 className="card-title">{course.title}</h6>
                                                        <p className="card-text small">{course.description}</p>
                                                        <p className="fw-bold">${course.cost}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <h5 className="mt-3">Where am I?</h5>
                                    <CoachMap
                                        latitude={coach.latitude}
                                        longitude={coach.longitude}
                                        name={`${coach.name} ${coach.last_name}`}
                                    />
                                    <button className="btn btn-secondary me-2" onClick={() => navigate('/coaches')}>
                                        Back to Coaches
                                    </button>
                                    <button className="btn btn-success" onClick={() => navigate('/main')}>
                                        Back to Main
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}