import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { CoachMap } from "./CoachMap";
import "./styles/coaches.css"

export const Coaches = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [coach, setCoach] = useState([]);

  const [cargando, setCargando] = useState(false)

  const isAdmin = !!localStorage.getItem("token-admin");
  const isUser = !!localStorage.getItem("token-user");
  const isCoach = !!localStorage.getItem("token-coach") || !!localStorage.getItem("coach");

  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach");
  const role = localStorage.getItem("role");

  const handleBack = () => {
    if (localStorage.getItem("token-admin")) navigate("/admin/home");
    else if (localStorage.getItem("token-user")) navigate("/users/home");
    else navigate("/")
  };

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

  const handleCreateChat = async (otherUserId) => {
    try {
      const res = await fetch(`${backendURL}/chat/create/${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          secondary_id: otherUserId,
        }),
      });

      if (!res.ok) throw new Error("Error creating chat");

      const chat = await res.json();

      if (role === "user") {
        navigate("/users/chats", { state: { openChatId: chat.id } });
      } else {
        navigate("/coach/chats", { state: { openChatId: chat.id } });
      }

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    getAllCoaches();
  }, []);

  return (
    <div className="coaches-layout">

      <div className="coaches-container">

        <h1 className="coaches-title">
          Our Coaches
        </h1>

        {cargando && (
          <div className="coaches-loading">
            Loading...
          </div>
        )}

        <div className="coaches-grid">

          {!cargando && coach.map((coach) => (
            <div className="coach-card" key={coach.id}>

              <div className="coach-image-wrapper">
                <img
                  src={
                    coach.profile_image ||
                    `https://ui-avatars.com/api/?name=${coach.name}`
                  }
                  alt="Profile"
                  className="coach-image"
                />
              </div>

              <div className="coach-card-content">

                <h3 className="coach-name">
                  {coach.name} {coach.last_name}
                </h3>

                {coach.city && (
                  <p className="coach-location">
                    📍 {coach.city}, {coach.province}, {coach.country}
                  </p>
                )}

                <div className="coach-card-actions">

                  <button
                    className="coach-view-btn"
                    onClick={() =>
                      navigate(`/coaches-details/${coach.id}`)
                    }
                  >
                    View Profile
                  </button>

                  {isUser && (
                    <button
                      className="coach-chat-btn"
                      onClick={() => handleCreateChat(coach.id)}
                    >
                      Start Chat
                    </button>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>

        <div className="coaches-footer-actions">

          <button
            className="coach-primary-btn"
            onClick={() => navigate("/coaches/new")}
          >
            Do you want to be one?
          </button>
          {isCoach || isAdmin &&
            <button
              className="coach-secondary-btn"
              onClick={handleBack}
              type="button"
            >
              Back to Dashboard
            </button>
          }

        </div>

      </div>

    </div>
  );
};
