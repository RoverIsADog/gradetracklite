import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";

export const RegisterForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username);
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        password,
        email
      });
      
      if (response.data.error === 0) {
        props.onFormSwitch("login");
      } else {
        setError('Error: invalid username or password');
      }
    } catch (err) {
      console.log('Request failed:');
      console.log(err);
    }
    
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="center-header">Registration</h2>

        {/* USERNAME */}
        <label htmlFor="username">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          required id="username"
          name="username" />

        {/* PASSWORD */}
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="*********"
          required id="password"
          name="password" />

        {/* Email */}
        <label htmlFor="email">Email address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="youremail@mail.com"></input>

        {/* Checkbox for Terms and Condition */}
        <label htmlFor="checkbox">
          <input value={checkbox} onClick={() => setCheckbox(true)} type="checkbox" required id="checkbox" name="checkbox" /> I have agreed to
          <button className="popup-btn " onClick={() => setButtonPopup(true)} type="button">
            the terms and conditions
          </button>
        </label>

        {/* Popup after clicking terms and conditions */}
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>Terms and Conditions</h3>
          <p>Lorem ipsum...</p>
        </Popup>

        {/* ERROR */}
        {error && <p className="error-message">{error}</p>}

        {/* Register Button */}
        <button className="register-btn" type="submit">
          Register
        </button>
        <br />

        {/* Back to Login button */}
        <button className="link-btn" onClick={() => props.onFormSwitch("login")}>
          Already have an account? Login!
        </button>
      </form>
    </div>
  );
};
