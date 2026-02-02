import React, { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const MainSection = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-xl-4 col-md-6 col-sm-12">
                        <div className="card mt-3" style={{ width: "18rem" }}>
                            <img src="https://img.freepik.com/foto-gratis/entrenamiento-entrenador-personal-interiores_23-2148795206.jpg?semt=ais_hybrid&w=740&q=80" className="card-img-top" alt="Imagen representativa sobre que es un posible coach dentro de la aplicación" />
                            <div className="card-body">
                                <h5 className="card-title">¡Descubre cuantos coaches hay en nuestra comunidad!</h5>
                                <p className="card-text">Recuerda ser amigable y respetuoso, en caso de querer a un coach para ti ¡puedes enviarle mensajes!</p>
                                <button className="btn btn-primary" onClick={() => navigate("/coaches")}>
                                    Ver Coaches
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6 col-sm-12">
                        <div className="card mt-3" style={{ width: "18rem" }}>
                            <img src="https://nb.scene7.com/is/image/NB/mj43504ikw_nb_70_i?$pdpflexf2$&wid=440&hei=440" className="card-img-top" alt="Imagen representativa sobre que es un posible coach dentro de la aplicación" />
                            <div className="card-body">
                                <h5 className="card-title">¡Quieres ayudar a la gente en progresar en sus metas?</h5>
                                <p className="card-text">¡Rellena el la información neecsaria y conviertete en coach! ¡Haz del mundo un sitio mucho mejor! <br/>¡ole!</p>
                                <button className="btn btn-primary" onClick={() => navigate("/singup")}>
                                    Empezar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};