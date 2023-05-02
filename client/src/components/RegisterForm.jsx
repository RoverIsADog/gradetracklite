// @ts-check
import React, { useContext, useState } from "react";
import TermsPopup from "./Popup";
import { apiLocation } from "../App";
import { networkPost } from "@/utils/NetworkUtils";

export const RegisterForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  // const [email, setEmail] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [error, setError] = useState('');

  const apiURL = useContext(apiLocation);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username);
    try {
      if (password!==confirmpassword){
        setError('Please make sure to confirm your password');
        return;
      }

      // Response ignored as any error => networkPost throws an error,
      // so necessarily there is no error.
      await networkPost(`${apiURL}/auth/register`, {
        username,
        password,
        //email
      });

      alert("Account successfully created");

      props.onFormSwitch("login");

    } catch (err) {
      setError('Error: invalid username or password');
      console.log('Request failed:');
      console.log(err);
    }
    
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="center-header">Registration</h2>

        {/* USERNAME */}
        <label className="auth-label" htmlFor="username">Username</label>
        <input
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          required id="username"
          name="username" />

        {/* PASSWORD */}
        <label className="auth-label" htmlFor="password">Password</label>
        <input
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="*********"
          required id="password"
          name="password" />
        {/* PASSWORD */}
        <label className="auth-label" htmlFor="confirmpassword">Confirm Password</label>
        <input
          className="auth-input"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="*********"
          required id="confirmpassword"
          name="confirmpassword" />



        {/* Email */}
        {/* <label className="auth-label" htmlFor="email">Email address (optional)</label>
        <input
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="youremail@mail.com"></input> */}

        {/* Checkbox for Terms and Condition */}
        <label className="auth-label" htmlFor="checkbox">
          <input className="auth-input" checked={checkbox} onClick={() => setCheckbox(prev => !prev)} type="checkbox" required id="checkbox" name="checkbox" /> I have agreed to
          <button className="popup-btn auth-button " onClick={() => setButtonPopup(true)} type="button">
            the privacy policy and terms of use.
          </button>
        </label>

        {/* Popup after clicking terms and conditions */}
        <TermsPopup trigger={buttonPopup} setTrigger={setButtonPopup} />

        {/* ERROR */}
        {error && <p className="error-message">{error}</p>}

        {/* Register Button */}
        <button className="register-btn auth-button" type="submit">
          Register
        </button>
        <br />

        {/* Back to Login button */}
        <button className="link-btn auth-button" onClick={() => props.onFormSwitch("login")}>
          Already have an account? Login!
        </button>
      </form>
    </div>
  );
};
