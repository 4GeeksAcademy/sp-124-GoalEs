import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";



export const CoachDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [coach, setCoach] = useState();

    const getCoachDetails = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}`)

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