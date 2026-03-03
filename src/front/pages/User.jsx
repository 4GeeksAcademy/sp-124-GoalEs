import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/users.css"

export const User = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const token =
    localStorage.getItem("token-user") ||
    localStorage.getItem("token-coach") || localStorage.getItem("token-admin")

  const role = localStorage.getItem("role");

  // GET

  const userFetch = async () => {
    try {
      const res = await fetch(`${backendURL}/users`, {
        //added by arash
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error to search users");
      const data = await res.json();
      setUsers(data.users);
    } catch (e) {
      setError(e.message);
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
    userFetch();
  }, []);

  //DELETE

  const deleteUser = async (id) => {
    try {
      setError("");

      const res = await fetch(`${backendURL}/users/${id}`, {
        method: "DELETE",
        //added by arash
        headers: { Authorization: `Bearer ${localStorage.getItem("token-user") || localStorage.getItem("token-admin")}` },
      });

      if (!res.ok) throw new Error("Error to delete user");

      setUsers(prev => prev.filter(users => users.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  // UI

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="admin-users-layout">

      <div className="admin-users-container">

        {/* HEADER */}
        <div className="admin-users-header">

          <h1 className="admin-users-title">
            Users
          </h1>

          <div className="admin-users-actions">

            <button
              className="admin-primary-btn"
              onClick={() => navigate("/users/new")}
            >
              Create New User
            </button>

          </div>

        </div>

        {/* GRID */}
        <div className="admin-users-grid">

          {users && users.map((user) => (

            <div key={user.id} className="admin-user-card">

              <div className="admin-user-image-wrapper">
                <img
                  src={user.profile_picture || "https://via.placeholder.com/400"}
                  alt="Profile"
                  className="admin-user-image"
                />
              </div>

              <div className="admin-user-content">

                <h3 className="admin-user-name">
                  {user.name} {user.surname}
                </h3>

                <p className="admin-user-email">
                  {user.email}
                </p>

                <div className="admin-user-card-actions">

                  <button
                    className="admin-outline-btn small"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    View
                  </button>

                  <button
                    className="admin-primary-btn small"
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="admin-delete-btn small"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="admin-outline-btn small"
                    onClick={() => navigate(`/users/${user.id}/courses/select`)}
                  >
                    Add Courses
                  </button>

                  <button
                    className="admin-outline-btn small"
                    onClick={() => navigate(`/users/${user.id}/courses`)}
                  >
                    View Courses
                  </button>

                  <button
                    className="admin-outline-btn small"
                    onClick={() => handleCreateChat(user.id)}
                  >
                    Chat
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        <div className="admin-users-footer">
          <button
            className="admin-primary-btn"
            onClick={userFetch}
          >
            Reload
          </button>
        </div>

      </div>

    </div>
  );
};


export default User