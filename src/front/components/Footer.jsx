import { Link } from "react-router-dom";


export const Footer = () => {
	return (
    <footer className="goales-footer">
      <div className="container">
        <div className="row py-5">

        
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-title">Address</h5>
            <p className="footer-text">Calle Gran Via 45, 28013 Madrid, España</p>
            <p className="footer-text">+34 (91) 123-4567 (9am - 6pm CET, Mon - Fri)</p>
            <p className="footer-text">goales@gmail.com</p>
            <div className="footer-socials mt-3">
              <a href="#"><i className="fa-brands fa-facebook"></i></a>
              <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>

          
          <div className="col-lg-2 col-md-3 mb-4 offset-lg-2">
            <h5 className="footer-title">Explore</h5>
            <ul className="footer-links">
              <li><Link to="/">Our Story</Link></li>
              <li><Link to="/coaches">Our Coaches</Link></li>
              <li><Link to="/courses">Our Courses</Link></li>
              <li><Link to="/#contact">Contact Us</Link></li>
            </ul>
          </div>

          
          <div className="col-lg-3 col-md-3 mb-4">
            <h5 className="footer-title">Information</h5>
            <ul className="footer-links">
              <li><Link to="/#become-coach">How to become a Coach?</Link></li>
              <li><Link to="/#privacy">Privacy Policy</Link></li>
              <li><Link to="/#terms">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

     
        <div className="footer-bottom">
          <p>© 2025 GoalEs. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};