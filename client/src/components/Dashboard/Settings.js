import React, { useContext } from "react";
import { apiLocation } from "../../App";
import "../../css/dashboard/content.css";
import useFetch from "../../hooks/useFetch";
import plusIco from "../../img/plus-svgrepo-com.svg";
import PlaceholderPreview from "./PlaceholderPreview";

function Settings() {

  // FIXME THIS ENTIRE FILE IS FOR TESTING ONLY

  return (
    <div id="course-container">
      <div>
        <h1>Account Info</h1>
        <h1>Download Data</h1>
        <h1>Delete Account</h1>
      </div>
    </div>
  );
}

export default Settings;
