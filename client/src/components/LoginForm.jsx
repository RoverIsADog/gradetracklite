import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLocation } from "../App";
import { networkPost } from "@/utils/NetworkUtils";


export const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const apiURL = useContext(apiLocation);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await networkPost(`${apiURL}/auth/login`, {
        username,
        password,
      });
      
      console.log('Login successful');
      document.cookie = `token=${response.token}; SameSite=Strict`;
      navigate("/app");
      
    } catch (err) {
      console.log('Login failed');
      setError('Error: invalid username or password');
    }
    
  };


  return (
    <div className="auth-form-container">
      <h2 className="center-header">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* USERNAME */}
        <label className="auth-label" htmlFor="username">Username</label>
        <input className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required id="username" name="username" />

        {/* PASSWORD */}
        <label className="auth-label" htmlFor="password">Password</label>
        <input className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*********" required id="password" name="password" />

        {/* ERROR */}
        {error && <p className="error-message">{error}</p>}

        <button className="login-btn auth-button" type="submit">
          Log In
        </button>
      </form>

      {/* Back to Login button */}
      <button className="link-btn auth-button" onClick={() => props.onFormSwitch("register")}>
        Register here!
      </button>
    </div>
  );
};
