import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken]=useState(null);

  const navigate= useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
  };

  const loginClickHandle= () => {
    console.log('i ran');
    navigate("/app");
    
  }
  //   fetch('https://localhost:8000', {method: 'POST', body: {username:username, password:password}})
  //   .then(res=>{
  //     return res.json();
  // })
  //   .then(data =>{
  //     setToken(data.token);
      
  //   })

  return (
    <div className="auth-form-container">
      <h2 className="center-header">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* USERNAME */}
        <label htmlFor="username">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" id="username" name="username" />

        {/* PASSWORD */}
        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*********" id="password" name="password" />
        <button className="login-btn" onClick={loginClickHandle} type="submit">
          Log In
        </button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch("register")}>
        Register here!
      </button>
    </div>
  );
};
