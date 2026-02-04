import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const back_url = "https://glorious-engine-wr4pp7xr49g5c5gj9-3001.app.github.dev";

const UserDetails = () => {
   const {id} = useParams();
   const navigate = useNavigate();

   const [users, setUsers] = useState([]);
   const [error, setError] = useState("");
   
    const fetchUser = async () => {
    try {
      setError("");
      const res = await fetch(`${back_url}/api/users/${id}`);
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