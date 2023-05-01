// @ts-check
import React, { useContext, useState } from "react";
import Popup from "./Popup";
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
      const response = await networkPost(`${apiURL}/auth/register`, {
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
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>This privacy policy and terms are provided by your host. Contact them for more details.</h3>
          <h3>Privacy Policy</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac tempus turpis. Suspendisse ultrices vulputate nunc, in sodales lacus iaculis at. In at justo sed lectus dictum tristique. Phasellus iaculis pulvinar diam. Aliquam laoreet non mauris in commodo. Maecenas id ex quis lectus lacinia accumsan. Phasellus sed velit non massa feugiat elementum. Cras viverra risus eu nulla volutpat ultrices. Sed et dui sed orci aliquam sollicitudin in eget quam. Aliquam quis odio vel eros laoreet molestie. Suspendisse consectetur porttitor arcu, vel suscipit massa venenatis in. Nulla eleifend erat sit amet mi pellentesque, ut volutpat orci lobortis. Mauris et nunc id justo semper dictum ac sit amet erat. Praesent sed diam vel leo fermentum varius. Proin pellentesque erat dui, at auctor ligula placerat vel. Mauris sagittis lacus eu diam viverra aliquet.</p>
          <p>Morbi eget dictum dolor. Phasellus tristique malesuada varius. Nunc nisi justo, efficitur a dapibus non, elementum sit amet felis. Aliquam et semper urna. Curabitur ultrices ligula turpis, id tempus odio pretium ut. In gravida, tellus quis suscipit gravida, ex magna fermentum nisl, a consequat erat quam ut lacus. Nullam fringilla sapien sit amet gravida malesuada. Nullam sollicitudin pretium urna et ultricies. Vestibulum sit amet auctor felis. Nunc et diam semper, imperdiet dolor in, maximus arcu.</p>
          <p>Nulla id neque quis tortor aliquet lacinia vitae sed leo. Donec nec mauris eget nulla maximus consectetur bibendum nec mi. Maecenas bibendum at nunc a rutrum. Curabitur vitae condimentum dui. Sed consectetur porttitor dolor in dictum. Proin lacinia mauris vitae urna imperdiet imperdiet. Vestibulum convallis imperdiet tincidunt. Ut et eleifend augue. Sed vitae sodales orci. Curabitur rutrum mauris at ex fermentum, ut scelerisque nibh mollis. Donec eu elit magna. Cras volutpat lacus vitae nisl luctus ultrices. Cras finibus turpis ac justo semper egestas. Mauris interdum lorem ac tellus dignissim, sit amet volutpat tellus laoreet. Maecenas eget erat condimentum, rhoncus sapien at, luctus risus.</p>
          <p>Aliquam sed ligula ac odio commodo gravida. Ut volutpat nibh et cursus cursus. Phasellus sollicitudin massa quis turpis sagittis ultrices. Maecenas euismod dolor vel tellus vulputate bibendum quis ut lacus. Cras pellentesque sodales ante id volutpat. Nam commodo ut metus at mattis. Proin ipsum mi, auctor id sodales et, vestibulum eu tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean congue eleifend porttitor. Sed ac sapien efficitur arcu lobortis molestie sed eget ipsum. Nam orci eros, tristique vel nulla ut, venenatis dignissim diam. Mauris sed bibendum metus. Quisque aliquet odio id dui pretium, eu tempus magna mattis. In ornare at arcu et elementum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
          <p>Aliquam at quam nulla. Suspendisse condimentum purus sed dui imperdiet, tristique luctus dolor rhoncus. Praesent ac consequat odio. Curabitur vestibulum est nec iaculis suscipit. Cras euismod auctor augue ac imperdiet. Proin eget odio libero. Etiam vestibulum mi id dui tempor, vel dignissim felis aliquam. Suspendisse consequat pharetra hendrerit. Aenean volutpat gravida feugiat. Aliquam vitae est et lacus tincidunt tincidunt. Nam nisi sapien, viverra convallis nisl et, blandit blandit elit. Ut placerat sed tellus sit amet consequat. Curabitur lectus eros, aliquam consectetur elit ac, congue hendrerit ipsum.</p>
          <h3>Terms of Use</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac tempus turpis. Suspendisse ultrices vulputate nunc, in sodales lacus iaculis at. In at justo sed lectus dictum tristique. Phasellus iaculis pulvinar diam. Aliquam laoreet non mauris in commodo. Maecenas id ex quis lectus lacinia accumsan. Phasellus sed velit non massa feugiat elementum. Cras viverra risus eu nulla volutpat ultrices. Sed et dui sed orci aliquam sollicitudin in eget quam. Aliquam quis odio vel eros laoreet molestie. Suspendisse consectetur porttitor arcu, vel suscipit massa venenatis in. Nulla eleifend erat sit amet mi pellentesque, ut volutpat orci lobortis. Mauris et nunc id justo semper dictum ac sit amet erat. Praesent sed diam vel leo fermentum varius. Proin pellentesque erat dui, at auctor ligula placerat vel. Mauris sagittis lacus eu diam viverra aliquet.</p>
          <p>Morbi eget dictum dolor. Phasellus tristique malesuada varius. Nunc nisi justo, efficitur a dapibus non, elementum sit amet felis. Aliquam et semper urna. Curabitur ultrices ligula turpis, id tempus odio pretium ut. In gravida, tellus quis suscipit gravida, ex magna fermentum nisl, a consequat erat quam ut lacus. Nullam fringilla sapien sit amet gravida malesuada. Nullam sollicitudin pretium urna et ultricies. Vestibulum sit amet auctor felis. Nunc et diam semper, imperdiet dolor in, maximus arcu.</p>
          <p>Nulla id neque quis tortor aliquet lacinia vitae sed leo. Donec nec mauris eget nulla maximus consectetur bibendum nec mi. Maecenas bibendum at nunc a rutrum. Curabitur vitae condimentum dui. Sed consectetur porttitor dolor in dictum. Proin lacinia mauris vitae urna imperdiet imperdiet. Vestibulum convallis imperdiet tincidunt. Ut et eleifend augue. Sed vitae sodales orci. Curabitur rutrum mauris at ex fermentum, ut scelerisque nibh mollis. Donec eu elit magna. Cras volutpat lacus vitae nisl luctus ultrices. Cras finibus turpis ac justo semper egestas. Mauris interdum lorem ac tellus dignissim, sit amet volutpat tellus laoreet. Maecenas eget erat condimentum, rhoncus sapien at, luctus risus.</p>
          <p>Aliquam sed ligula ac odio commodo gravida. Ut volutpat nibh et cursus cursus. Phasellus sollicitudin massa quis turpis sagittis ultrices. Maecenas euismod dolor vel tellus vulputate bibendum quis ut lacus. Cras pellentesque sodales ante id volutpat. Nam commodo ut metus at mattis. Proin ipsum mi, auctor id sodales et, vestibulum eu tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean congue eleifend porttitor. Sed ac sapien efficitur arcu lobortis molestie sed eget ipsum. Nam orci eros, tristique vel nulla ut, venenatis dignissim diam. Mauris sed bibendum metus. Quisque aliquet odio id dui pretium, eu tempus magna mattis. In ornare at arcu et elementum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
          <p>Aliquam at quam nulla. Suspendisse condimentum purus sed dui imperdiet, tristique luctus dolor rhoncus. Praesent ac consequat odio. Curabitur vestibulum est nec iaculis suscipit. Cras euismod auctor augue ac imperdiet. Proin eget odio libero. Etiam vestibulum mi id dui tempor, vel dignissim felis aliquam. Suspendisse consequat pharetra hendrerit. Aenean volutpat gravida feugiat. Aliquam vitae est et lacus tincidunt tincidunt. Nam nisi sapien, viverra convallis nisl et, blandit blandit elit. Ut placerat sed tellus sit amet consequat. Curabitur lectus eros, aliquam consectetur elit ac, congue hendrerit ipsum.</p>
        </Popup>

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
