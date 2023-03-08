import React, {useState} from "react";

export const Login = (props)=> {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
    }
   
    return (
        <div className="auth-form-container">
            <h2 className="center-header">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* USERNAME */}
                <label htmlFor= "username">Username</label>
                <input value={username} onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Username" id="username" name="username"/>

                {/* PASSWORD */}
                <label htmlFor= "password">Password</label>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="*********" id="password" name="password"/>
                <button className='login-btn' type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Register here!</button>
        </div>
    )
}