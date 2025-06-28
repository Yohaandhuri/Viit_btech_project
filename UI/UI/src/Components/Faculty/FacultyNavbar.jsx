import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FacultyNavbar.css"; // Importing the new CSS file for Faculty Navbar

function FacultyNavbar({ firstName, lastName, id }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/faculty/login"); // Redirect to Faculty Login
  };

  return (
    <nav className="faculty-navbar"> {/* Applying new class for Faculty Navbar */}
      {/* Left Section - Greeting */}
      <ul className="nav-left">
        <li>
          <Link to={`/faculty/dashboard/${id}`}>
            🧑‍🏫  Faculty: {firstName} {lastName}
          </Link>
        </li>
      </ul>

      {/* Right Section - Logout Button */}
      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default FacultyNavbar;
