import { useNavigate } from "react-router-dom";

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
                                <h5 className="card-title">Discover how many coaches there are in our community!</h5>
                                <p className="card-text">Remember to be friendly and respectful. If you'd like a coach for yourself, you can send them a message!</p>
                                <button className="btn btn-primary" onClick={() => navigate("/coaches")}>
                                    See Coaches
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6 col-sm-12">
                        <div className="card mt-3" style={{ width: "18rem" }}>
                            <img src="https://nb.scene7.com/is/image/NB/mj43504ikw_nb_70_i?$pdpflexf2$&wid=440&hei=440" className="card-img-top" alt="Imagen representativa sobre que es un posible coach dentro de la aplicación" />
                            <div className="card-body">
                                <h5 className="card-title">Do you want to help people progress towards their goals?</h5>
                                <p className="card-text">Fill in the required information and become a coach! Make the world a much better place!</p>
                                <button className="btn btn-primary" onClick={() => navigate("/coaches/singup")}>
                                    Start
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
                        Back to main
                    </button>
                </div>
            </div>
        </>
    );
};