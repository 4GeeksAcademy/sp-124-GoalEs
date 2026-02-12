import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";


export default function CoachPrivate() {
    const { store } = useGlobalReducer();
    const { dispatch } = useGlobalReducer();
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleTestPrivate = async () => { 
        setMsg("");

        try {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const resp = await fetch(`${backendURL}/coach/private`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + store.token
      }
    });

    const data = await resp.json();

    if (!resp.ok) {
      setMsg(JSON.stringify(data));
      return;
    }

    setMsg("OK: " + JSON.stringify(data));
  } catch (err) {
    setMsg("fetch failed");
  }


    }

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("jwt-token");
        if (!store.isAuthenticated && !tokenFromStorage) {
            navigate("/coaches/login");
        }
    }, [store.isAuthenticated, navigate]);


    const handleLogout = () => {
        localStorage.removeItem("jwt-token");

        dispatch({type: "logout" });

        navigate("/");
    };

    return (
        <>
        <div style={{padding: 40}}>
            <h2>Coach Dashboard</h2>

            <p>Coach ID: {store.coach?.id}</p>

            <button className="btn btn-primary" onClick={handleLogout}>Log out</button>
            <button className="btn btn-outline-primary ms-2" onClick={handleTestPrivate}>
  Test Private
</button>

{msg && <p>{msg}</p>}
        </div>
        
        </>
    );
    };