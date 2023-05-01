import React, { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { LoginForm } from "../components/LoginForm";
import "@/css/authpage.css";
import { useNavigate } from "react-router-dom";

/**
 * Component responsible for rendering the login and register pages.
 * CSS file
 */
function AuthPage() {
  const [currentForm, setCurrentForm] = useState("login");
  const navigate = useNavigate();

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <main>
      <div className="top-bar">
        <button className="top-bar-text">GradeTrackLite</button>
        <button className= "about-btn" onClick={()=>navigate('/about')}>About page</button>
        
      </div>
      <div className="auth-page">
        <br />
        {currentForm === "login" ? <LoginForm onFormSwitch={toggleForm} /> : <RegisterForm onFormSwitch={toggleForm} />}
      </div>
    </main>
  );
}

export default AuthPage;
