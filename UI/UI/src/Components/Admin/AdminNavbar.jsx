import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar.css";

// eslint-disable-next-line react/prop-types
function AdminNavbar({ firstName, lastName, userId }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="nav-left">
        <li><Link to={`/admin/dashboard/${userId}`}>
          <h2 className="admin-greeting">👋 Hello, {firstName} {lastName}</h2>
        </Link></li>
      </div>

      <div className="nav-center">
        <ul>
          <li><Link to={`/admin/${userId}/students`}>Students</Link></li>
          <li><Link to={`/admin/${userId}/faculty`}>Faculty</Link></li>
          <li><Link to={`/admin/${userId}/courses`}>Courses</Link></li>
        </ul>
      </div>

      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
