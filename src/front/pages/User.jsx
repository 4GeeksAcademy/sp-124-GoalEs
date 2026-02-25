import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const back_url = import.meta.env.VITE_BACKEND_URL;

export const User = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // GET

  const userFetch = async () => {
    try {
      const res = await fetch(`${back_url}/users`, {
        //added by arash
        headers: { Authorization: `Bearer ${localStorage.getItem("token-user") || localStorage.getItem("token-admin")}` },
      });
      if (!res.ok) throw new Error("Error to search users");
      const data = await res.json();
      setUsers(data.users);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    userFetch();
  }, []);

  //DELETE

  const deleteUser = async (id) => {
    try {
      setError("");

      const res = await fetch(`${back_url}/users/${id}`, {
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
    <>

      <div className="container py-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">Users</h1>

          <div className="d-flex gap-2">
            <button
              className="d-flex gap-2 justify-content-md-end btn btn-primary"
              onClick={() => navigate("/users/new")}
            >
              Create new user
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/admin/home")}
            >
              Back to Admin Dashboard
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="row">
          {users && users.map((user) => (
            <div key={user.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column mb-3">
                  <img
                    src={user.profile_picture || "https://via.placeholder.com/40"}
                    alt="Profile"
                    style={{
                      width: "380px",
                      height: "400px",
                      objectFit: "cover",
                      marginRight: "10px"
                    }}
                  />
                  <h5 className="card-title">
                    {user.name} {user.surname}
                  </h5>

                  <p className="card-text text-muted">{user.email}</p>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      View details
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => navigate(`/users/${user.id}/courses/select`)}
                    >
                      Add courses
                    </button>


                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate(`/users/${user.id}/courses`)}
                    >
                      View courses
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-primary" onClick={userFetch}>
            Reload
          </button>
        </div>
      </div>
    </>
  );
};


export default User