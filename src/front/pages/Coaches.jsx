import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { CoachMap } from "./CoachMap";

export const Coaches = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [coach, setCoach] = useState([]);

  const [cargando, setCargando] = useState(false)

  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach"); 


  const getAllCoaches = async () => {
    try {
      setCargando(true);

      const res = await fetch(backendURL + "/coach"); 


      if (!res.ok) throw new Error("We can’t get coaches right now");

      const data = await res.json();
      setCargando(false)
      setCoach(data.coaches);

    } catch (err) {
      setCargando(false)
      console.error(err);
    }
  };

  const deletedCoach = async (id) => {
    try {
      if (!token) throw new Error("Missing token, login as admin/coach"); 
      const res = await fetch(`${backendURL}/coach/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Not deleted the coach");

      setCoach(prev => prev.filter(coach => coach.id !== id));

    } catch (err) {
      alert(err.message);
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
              Loading...
            </div>
          </div>
        }
        {!cargando && coach.map((coach) => (
          <div className="col-md-4 key={coach.id}">
           <div className="card mt-3 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <img
                        src={coach.profile_image || `https://ui-avatars.com/api/?name=${coach.name}`}
                        alt="Profile"
                        style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                        <h5 className="card-title mb-0">{coach.name} {coach.last_name}</h5>
                        {coach.city && (
                            <p className="text-muted mb-0 small">
                                📍 {coach.city}, {coach.province}, {coach.country}
                            </p>
                        )}
                    </div>
                </div>

                <CoachMap
                    latitude={coach.latitude}
                    longitude={coach.longitude}
                    name={`${coach.name} ${coach.last_name}`}
                />

                <button
                    className="btn btn-primary btn-sm mt-2 w-100"
                    onClick={() => navigate(`/coaches-details/${coach.id}`)}>
                    show profile
                </button>
            </div>
        </div>
        </div>
))}

        <button className="btn btn-primary mt-3" onClick={() => navigate("/coaches/new")}>
          New Coach
        </button>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/main")}>
          Back to main
        </button>
      </div>
    </div>
  );
};
