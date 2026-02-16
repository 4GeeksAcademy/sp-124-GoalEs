import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const CompleteProfileUser = () =>{

    const navigate = useNavigate();
    const { dispatch, store } = useGlobalReducer();

    return(
        <>
        </>
    )
}