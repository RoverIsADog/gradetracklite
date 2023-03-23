import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../img/logo.png";

function About() {
  return (
    <div style={{padding: '2rem'}}>
      <Link to='/'>{'< Back to homepage'}</Link><br /><br />
      <img src={logoImg} className="not-icon" style={{ height: "5rem" }} alt="Logo" />
      <h1>About</h1>
      <p>
        GradeTrackLite is a simple privacy-oriented grade tracking webapp.
      </p>
      <p>
        Your host is your data processor and you are subject to their terms of use and privacy notice. Contact them for more information. 
      </p>
      <p>
        GradeTrackLite authors: COMP555 Project Group 7
      </p>
      <h1>Privacy Notice</h1>
      <p>
        TODO LOAD THIS FROM A FILE!!
      </p>
      <h1>Terms of Use</h1>
      <p>
        TODO LOAD THIS FROM A FILE!!!
      </p>
      <h1>Attributions</h1>
      <p>
        This webapp uses open-licensed resources. Their authors and copies of their respective licenses (if required) are listed below.
      </p>
      <p>
        TODO (File is in client/src/img/attributions.md)
      </p>
    </div>
  );
}

export default About;
