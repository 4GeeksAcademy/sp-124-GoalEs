import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Coaches = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [coach, setCoach] = useState([]);

  const [cargando, setCargando] = useState(false)

  const getAllCoaches = async () => {
    try {
      setCargando(true)
      const res = await fetch(backendURL + "/coach");

      if (!res.ok) throw new Error("We can’t get coaches right now");

      const data = await res.json();
      setCargando(false)
      setCoach(data.coaches);
      console.log(data)

    } catch (err) {
      console.error(err);
    }
  };

  const deletedCoach = async (id) => {
    try {
      const res = await fetch(`${backendURL}/coach/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Not deleted the coach");

      setCoach(prev => prev.filter(coach => coach.id !== id));

    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    getAllCoaches();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {cargando &&
          <div className="card">
            <div className="card-body">
              Cargando...
            </div>
          </div>
          }
        {!cargando && coach.map((coach) => (
          <div className="col-md-4" key={coach.id}>
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">{coach.name} {coach.last_name}</h5>
                <p className="card-text">{coach.email}</p>
                <button className="btn btn-success me-2" onClick={() => navigate(`/coaches/${coach.id}`)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => deletedCoach(coach.id)}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="btn btn-primary mt-3" onClick={() => navigate("/singup")}>
          Crear Coach
        </button>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/home")}>
          Volver a home
        </button>
      </div>
    </div>
  );
};
