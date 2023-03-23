import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password,
      });
      
      if (response.data.error === 0) {
        console.log('Login successful');
        document.cookie = `token=${response.data.token}`;
        navigate("/app");
      } else {
        console.log('Login failed');
        setError('Error: invalid username or password');
      }
    } catch (err) {
      console.log("Error while logging in!")
      console.log(err);
    }
    
  };


  return (
    <div className="auth-form-container">
      <h2 className="center-header">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* USERNAME */}
        <label htmlFor="username">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required id="username" name="username" />

        {/* PASSWORD */}
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*********" required id="password" name="password" />

        {/* ERROR */}
        {error && <p className="error-message">{error}</p>}

        <button className="login-btn" type="submit">
          Log In
        </button>
      </form>

      {/* Back to Login button */}
      <button className="link-btn" onClick={() => props.onFormSwitch("register")}>
        Register here!
      </button>
    </div>
  );
};
