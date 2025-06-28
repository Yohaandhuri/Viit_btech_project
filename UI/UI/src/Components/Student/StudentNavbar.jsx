/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentNavbar.css"; // Using the same CSS file for consistency

function StudentNavbar({ firstName, lastName, id}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/student/login"); // Redirect to Student Login
  };

  return (
    // <nav className="admin-navbar"> {/* Reusing the same class for consistent styling */}
    //   {/* Left Section - Greeting */}
    //   <div className="nav-left">
    //     <li>
    //       <Link to={`/student/dashboard/${id}`}>
    //       🎓 Hello, {firstName} {lastName}
    //       </Link>
    //     </li>
    //   </div>

    //   {/* Right Section - Logout Button */}
    //   <div className="nav-right">
    //     <button onClick={handleLogout} className="logout-btn">Logout</button>
    //   </div>
    // </nav>
    <nav className="admin-navbar">
      <ul className="nav-left">
        <li>
          <Link to={`/student/dashboard/${id}`}>
          🎓 Student: {firstName} {lastName}
          </Link>
        </li>
      </ul>
      <div className="nav-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default StudentNavbar;
