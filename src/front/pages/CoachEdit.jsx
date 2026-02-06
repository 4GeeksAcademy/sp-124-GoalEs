import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const CoachEdit = () => {

    const { id } = useParams();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    const [coach, setCoach] = useState(null);

    const getCoach = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}`)

            if (!res.ok) throw new Error("Coach not found")

            const data = await res.json();

            setCoach(data.coach)
        } catch (err) {
            console.error(err)
        }
    }

    const updateCoach = async () => {
        await fetch(`${backendURL}/coach/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coach)
        });
        navigate("/coaches");
    };

    useEffect(() => {
        getCoach();
    }, [id])

    return (
        <>
            {!coach && <p className="text-center mt-5">Cargando...</p>}
            {coach &&
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card mt-3">
                                <div className="card-body">
                                    <div class="form-floating mb-3">
                                        <p>Name</p>
                                        <input type="text"input className="form-control my-3" id="floatingInput" placeholder="Pepe" value={coach.name} onChange={e => setCoach({ ...coach, name: e.target.value })} />
                                        <p>Last Name</p>
                                        <input input className="form-control my-3" id="floatingPassword" placeholder="Pepito" value={coach.last_name} onChange={e => setCoach({ ...coach, last_name: e.target.value })} />
                                        <p>Email</p>
                                        <input input type="email" className="form-control my-3" id="floatingInput" placeholder="name@example.com" value={coach.email} onChange={e => setCoach({ ...coach, email: e.target.value })} />
                                        <p>Password</p>
                                        <input input type="password" className="form-control my-3" id="floatingInput" placeholder="name@example.com" value={coach.password} onChange={e => setCoach({ ...coach, password: e.target.value })} />
                                    </div>

                                    <button className="btn btn-primary" onClick={updateCoach}>Guardar cambios</button>

                                </div>
                            </div>
                            <button className="btn btn-danger mt-3" onClick={() => navigate("/coaches")}>Cancelar</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}