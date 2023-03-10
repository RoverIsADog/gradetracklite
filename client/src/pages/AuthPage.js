import React, { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { LoginForm } from "../components/LoginForm";
import "../css/authpage.css";

/**
 * Component responsible for rendering the login and register pages.
 * CSS file
 */
function AuthPage() {
  const [currentForm, setCurrentForm] = useState("login");

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <main>
      <div className="top-bar">
        <h2 className="top-bar-text">Grade Tracker</h2>
      </div>
      <div className="auth-page">
        <br />
        {currentForm === "login" ? <LoginForm onFormSwitch={toggleForm} /> : <RegisterForm onFormSwitch={toggleForm} />}
      </div>
    </main>
  );
}

export default AuthPage;
