import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "./Graphql/Queries";
import "./Login.css";

function Login({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { error }] = useLazyQuery(LOGIN_USER);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginUser({
        variables: { loginInput: { email, password } },
      });

      const userId = data.loginUser;

      if (role === "Admin") {
        navigate(`/admin/dashboard/${userId}`);
      } else if (role === "Faculty") {
        navigate(`/faculty/dashboard/${userId}`);
      } else if (role === "Student") {
        navigate(`/student/dashboard/${userId}`);
      }
    } catch (err) {
      if (err.message.includes("USER_DOES_NOT_EXISTS")) {
        alert("User does not exist");
      } else if (err.message.includes("INCORRECT_PASSWORD")) {
        alert("Incorrect password");
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔑 {role} Login</h1>
        <p className="login-subtext">Welcome back! Please enter your credentials.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="✉️ Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="🔒 Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="forgot-password">Forgot Password? <a href="#">Reset here</a></p>
      </div>
    </div>
  );
}

export default Login;
