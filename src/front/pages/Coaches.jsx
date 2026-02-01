import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Coaches = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [coach, setCoach] = useState([]);

  const get_all_coaches = async () => {
    try {
      const res = await fetch(backendURL + "/coach");

      if (!res.ok) throw new Error("We can’t get coaches right now");

      const data = await res.json();
      setCoach(data.coaches);
      console.log(data)

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    get_all_coaches();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {coach.map((coach, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">{coach.name} {coach.last_name}</h5>
                <p className="card-text">{coach.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
