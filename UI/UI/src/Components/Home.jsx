import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="chalkboard">
        <h1>📚 Welcome to E-Classroom 📚</h1>
        <p>Select your role to continue</p>

        <div className="button-container">
          <button onClick={() => navigate("/student/login")} className="student-btn">
            🎒 Student Login
          </button>
          <button onClick={() => navigate("/faculty/login")} className="faculty-btn">
            🧑‍🏫 Faculty Login
          </button>
        </div>

        <p className="admin-link">
          <a href="/admin/login">🔑 If you are an admin, click here</a>
        </p>
      </div>
    </div>
  );
}

export default Home;
