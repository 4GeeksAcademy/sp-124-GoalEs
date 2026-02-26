import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const back_url = import.meta.env.VITE_BACKEND_URL;

export const UserDetails = () => {
   const {id} = useParams();
   const navigate = useNavigate();

   const [users, setUsers] = useState([]);
   const [error, setError] = useState("");
   
    const fetchUser = async () => {
    try {
      setError("");
      const res = await fetch(`${back_url}/users/${id}`, {
        //added by arash
        headers: { Authorization: `Bearer ${localStorage.getItem("token-user") || localStorage.getItem("token-admin")}` },
      });
      if (!res.ok) throw new Error("Error fetching user details");

      const data = await res.json();
      setUsers(data.user ?? data);
    } catch (e) {
      setError(e.message);
    }
};

   useEffect(() => {
    fetchUser();
   },[id]);
   
   if (error) return <div style={{color: "red"}}>{error}</div>;


    return (
        <div className="container py-4">
            <h1 className="mb-4">User details</h1>
            <div className="card shadow-sm">
                <div className="card-body">
                    <img
                        src={users?.profile_picture || "https://via.placeholder.com/40"}
                        alt="Profile"
                        style={{
                            width: "380px",
                            height: "400px",
                            objectFit: "cover",
                            marginRight: "10px"
                        }}
                    />
                    <p><strong>Name:</strong>{users.name}</p>
                    <p><strong>Surname:</strong>{users.surname}</p>
                    <p><strong>Email:</strong>{users.email}</p>
                </div>
            </div>
            <div className="mt-4 d-flex gap-2">
                <button className="btn btn-secondary" onClick={() => navigate("/users")}>Back to users</button>
                <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to home</button>
            </div>
        </div>
    );
};

export default UserDetails;