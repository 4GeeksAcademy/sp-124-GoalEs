import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Single = () => {
    const { theId } = useParams();
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const searchItem = store.demo.find((item) => item.id == theId);
        setItem(searchItem);
        setLoading(false);
    }, [theId, store.demo]);

    return (
        <div className="jumbotron">
            <h1 className="display-4">This will show the demo item:</h1>

            {loading || !item ? (
                <h5 className="display-4">Loading...</h5>
            ) : (
                <div>
                    <h5>{item.name}</h5>
                    <p>{item.description}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-primary btn-lg"
                        href="#"
                        role="button"
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );
};
