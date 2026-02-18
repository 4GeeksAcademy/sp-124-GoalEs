import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const NavbarUser = ({ logout }) => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <img
                                src={store.user?.profile_picture || "https://via.placeholder.com/40"}
                                alt="Profile"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "10px"
                                }}
                            />
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {store.user?.name}
                                </a>
                                <ul className="dropdown-menu">
                                    <li><button
                                        className="dropdown-item"
                                        onClick={logout}>
                                        Logout
                                    </button></li>
                                    <li><button className="dropdown-item" onClick={() => navigate("/users/profile")}>Edit Profile</button></li>
                                    <li><a className="dropdown-item" href="https://www.youtube.com/watch?v=-4GC_zrxDCk">More</a></li>
                                </ul>
                            </li>
                            <li className="nav-item"><button className="btn btn-success" onClick={() => navigate("/users/faceanalyzer")}>Read Your Face</button></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}