import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../pages/styles/navbar.css"

export const Navbar = () => {

  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const token = store.token || localStorage.getItem("token-user");
  const isLogged = !!token;

  const isAdmin = !!localStorage.getItem("token-admin");
  const isUser = !!localStorage.getItem("token-user");
  const isCoach = !!localStorage.getItem("token-coach") || !!localStorage.getItem("coach");
  const isPublic = !isAdmin && !isUser && !isCoach;

  const coach = store.coach?.profile_image || ""
  const data_coach = coach.coach;

  const logout_user = () => {
    dispatch({ type: "logout-user" });
    localStorage.removeItem("token-user");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/", { state: { logoutMessage: true } });
  };
  const logout_coach = () => {
    dispatch({ type: "logout-coach" });
    localStorage.removeItem("token-coach");
    localStorage.removeItem("coach");
    localStorage.removeItem("role");
    localStorage.removeItem("coach_id");

    navigate("/", { state: { logoutMessage: true } });
  };

  return (
    <nav className="navbar navbar-expand-lg goales-navbar">
      <div className="container">

        <Link className="navbar-brand" to="/">
          Goal<span>Es</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">


          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <Link className="nav-link nav-main-link" to="/coaches">Our Coaches</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-main-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-main-link" to="/features">Features</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-main-link" to="/contact">Contact</Link>
            </li>
          </ul>


          <ul className="navbar-nav gap-2 align-items-center">

            {isAdmin && (
              <div className="role-dashboard-wrapper">
                <button
                  className="role-dashboard-btn"
                  onClick={() => navigate("/admin/home")}
                >
                  Dashboard Admin
                </button>
              </div>
            )}

            {isUser && (
              <div className="role-dashboard-wrapper">
                <button
                  className="role-dashboard-btn"
                  onClick={() => navigate("/users/home")}
                >
                  Dashboard
                </button>
              </div>
            )}

            {isCoach && (
              <div className="role-dashboard-wrapper">
                <button
                  className="role-dashboard-btn"
                  onClick={() => navigate("/coach/private")}
                >
                  Dashboard
                </button>
              </div>
            )}

            {!isLogged ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link btn-login dropdown-toggle"
                    href="#"
                    data-bs-toggle="dropdown"
                  >
                    Log in
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/users/login">User</Link></li>
                    <li><Link className="dropdown-item" to="/coaches/login">Coach</Link></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link btn-signup dropdown-toggle"
                    href="#"
                    data-bs-toggle="dropdown"
                  >
                    Sign up
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/users/signup">User</Link></li>
                    <li><Link className="dropdown-item" to="/coaches/new">Coach</Link></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                {!isAdmin &&
                  <li className="nav-item dropdown d-flex align-items-center">

                    <img
                      src={store.user?.profile_picture || store.coach?.profile_image 
                        || `https://ui-avatars.com/api/?name=${store.user?.name}+${store.user?.surname}&background=random&color=fff&size=256` 
                        || `https://ui-avatars.com/api/?name=${store.coach?.name}+${store.coach?.surname}&background=random&color=fff&size=256`}
                      alt="Profile"
                      className="navbar-avatar"
                    />

                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      data-bs-toggle="dropdown"
                    >
                      {store.user?.name}
                    </a>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        {isUser &&
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/users/profile")}
                          >
                            Edit Profile
                          </button>
                        }
                        {isCoach &&
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/coaches/profile")}
                          >
                            Edit Profile
                          </button>
                        }
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/")}
                        >
                          Home
                        </button>
                      </li>
                      {isUser &&
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={logout_user}
                          >
                            Logout
                          </button>
                        </li>
                      }
                      {isCoach &&
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={logout_coach}
                          >
                            Logout
                          </button>
                        </li>
                      }
                    </ul>
                  </li>
                }
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};