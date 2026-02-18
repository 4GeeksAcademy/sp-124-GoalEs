import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"; //added by arash

export const CoachEdit = () => {
  const { id } = useParams();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { store } = useGlobalReducer(); //added by arash
  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach"); //added by arash

  const [coach, setCoach] = useState(null);

  const getCoach = async () => {
    try {
      const res = await fetch(`${backendURL}/coach/${id}`, { //added by arash (removed extra space)
        headers: { Authorization: `Bearer ${token}` } //added by arash
      });

      if (!res.ok) throw new Error("Coach not found");

      const data = await res.json();
      setCoach(data.coach);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCoach = async () => {
    await fetch(`${backendURL}/coach/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` //added by arash
      },
      body: JSON.stringify(coach)
    });

    navigate("/coaches");
  };

  useEffect(() => {
    if (!token) return; //added by arash
    getCoach();
  }, [id, token]); //added by arash

  return (
    <>
      {!coach && <p className="text-center mt-5">Cargando...</p>}

      {coach && (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card mt-3">
                <div className="card-body">
                  <div className="form-floating mb-3">
                    <p>Name</p>
                    <input
                      type="text"
                      className="form-control my-3"
                      id="floatingInput"
                      placeholder="Pepe"
                      value={coach.name}
                      onChange={(e) => setCoach({ ...coach, name: e.target.value })}
                    />

                    <p>Last Name</p>
                    <input
                      className="form-control my-3"
                      id="floatingPassword"
                      placeholder="Pepito"
                      value={coach.last_name}
                      onChange={(e) => setCoach({ ...coach, last_name: e.target.value })}
                    />

                    <p>Email</p>
                    <input
                      type="email"
                      className="form-control my-3"
                      id="floatingInputEmail"
                      placeholder="name@example.com"
                      value={coach.email}
                      onChange={(e) => setCoach({ ...coach, email: e.target.value })}
                    />

                    <p>Password</p>
                    <input
                      type="password"
                      className="form-control my-3"
                      id="floatingInputPassword"
                      placeholder="password"
                      value={coach.password}
                      onChange={(e) => setCoach({ ...coach, password: e.target.value })}
                    />
                  </div>

                  <button className="btn btn-primary" onClick={updateCoach}>
                    Guardar cambios
                  </button>
                </div>
              </div>

              <button className="btn btn-danger mt-3" onClick={() => navigate("/coaches")}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};