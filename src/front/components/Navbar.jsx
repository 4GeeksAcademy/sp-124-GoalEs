import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<>
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
                <a className="nav-link" href="#our-story">Our Story</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/coaches">Our Coaches</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/courses">Our Courses</Link>
              </li>
            </ul>

           
            <ul className="navbar-nav gap-2 align-items-center">

              
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
                  <li><Link className="dropdown-item" to="/admin/login">Admin</Link></li>
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
                  <li><Link className="dropdown-item" to="/admin/signup">Admin</Link></li>
                </ul>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};