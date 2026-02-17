import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const CoachProfile = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        birthday: "",
        city: "",
        country: "",
        phone: "",
        gender: ""

    });

  



    return (
        <h1> Hola</h1>
    )
}