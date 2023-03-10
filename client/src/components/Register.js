import React, {useState} from "react";
import  Popup  from "./Popup";


export const Register = (props)=> {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
    }

    return (
        <div className="auth-form-container">
            <form className="register-form" onSubmit={handleSubmit}>

                <h2 className="center-header">Registration</h2>

                {/* USERNAME */}
                <label htmlFor= "username">Username</label>
                <input value={username} onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Username" required id="username" name="username"/>

                {/* PASSWORD */}
                <label htmlFor= "password">Password</label>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="*********" required id="password" name="password"/>
                
                {/* Name */}
                <label htmlFor="name">Full name</label>
                <input value={name} onChange={(e)=> setName(e.target.value)} type='text' name="name" required id="name" placeholder="Full Name"></input>

                {/* Checkbox for Terms and Condition */}
                <label htmlFor="checkbox">
                    <input value={checkbox} onClick={()=>setCheckbox(true)} type="checkbox" required id='checkbox' name="checkbox"/>
                        I have agreed to 
                    <button className="popup-btn " onClick={()=>setButtonPopup(true)} type='button' >the terms and conditions</button>
                 </label>
            
            {/* Popup after clicking terms and conditions */}
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h3>Terms and Conditions</h3>
                <p>Lorem ipsum...</p>
            </Popup>
            
            {/* Register Button */}
            {/* <button className="register-btn" onClick={()=>props.onFormSwitch('login')} type="submit">Register</button> */}
            <button className="register-btn" type="submit">Register</button>
            <br/>

            {/* Back to Login button */}
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login!</button>

            </form>

            

            
        </div>
    )
}