import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; //added by arash
import { CoachMap } from "./CoachMap";

export const CoachDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { store } = useGlobalReducer(); //added by arash

    const [coach, setCoach] = useState();

    const getCoachDetails = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}`,{
                headers: { Authorization: `Bearer ${store.token}` } //added by arash, to send the token in the request header for authentication
            })

            if (!res.ok) throw new Error("Coach not found")

            const data = await res.json();

            setCoach(data.coach)
            console.log(data.coach)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getCoachDetails();
    }, [id])

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
                                <div className="form-flotating">
                                    <ul>
                                        <li><strong>Name:</strong> {coach.name}</li>
                                        <li><strong>Last Name:</strong> {coach.last_name}</li>
                                        <li><strong>Email:</strong> {coach.email}</li>
                                    </ul>
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