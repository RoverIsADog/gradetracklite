// @ts-check
import React, { useContext } from "react";
import { apiLocation } from "App";
import "css/dashboard/content.css";
import { networkGet, networkPost } from "utils/NetworkUtils";
import { useNavigate } from "react-router-dom";

function ContentSettings() {
  const apiURL = useContext(apiLocation);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?") !== true) {
      return;
    }

    console.log("Starting account deletion request");
    networkPost(`${apiURL}/account/delete`)
      .then((res) => {
        alert("Account deleted successfully! You will be logged out");
        // Delete all cookies
        document.cookie = "token=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
        document.cookie = "theme=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
        navigate("/");
      })
      .catch((err) => {
        alert(`Error while deleting account!\n${String(err)}`);
      })
    }

  const handleDownload = () => {
    console.log("Starting data download");

    networkGet(`${apiURL}/account/download`)
      .then((res) => {

        // Save response to file
        // Credit https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
        const a = document.createElement("a");
        var file = new Blob([res], {type: "text/plain"});
        a.href = URL.createObjectURL(file);
        a.download = "data.json";
        a.click();

      }).catch((err) => {
        alert(`Error while downloading data!\n${String(err)}`);
      })
    }

  const handlePasswordChange = () => {
    console.log("Starting password change");

    const oldPwd = window.prompt("Please confirm your old password");
    const newPwd = window.prompt("Please enter your new password");

    networkPost(`${apiURL}/account/edit/password`, { oldPassword: oldPwd, newPassword: newPwd })
      .then((res) => {
        alert("Password changed successfully");
      }).catch((err) => {
        alert(`Error while changing password!\n${String(err)}`);
      })
  }

  const handleInfoChange = () => {
    console.log("Starting account info change");
    const newUsername = window.prompt("Please enter a new username");
    const newEmail = window.prompt("Please enter a new email (optional)");

    networkPost(`${apiURL}/account/edit/info`, { username: newUsername, email: newEmail })
    .then((res) => {
      alert("Account info changed successfully");
    }).catch((err) => {
      alert(`Error while changing account info!\n${String(err)}`);
    })
  }

  return (
    <div id="course-container">
      <div>
        <h1 onClick={handleInfoChange}>Change Account Info</h1>
        <h1 onClick={handlePasswordChange}>Change Password</h1>
        <h1 onClick={handleDownload}>Download Data</h1>
        <h1 onClick={handleDelete}>Delete Account</h1>
      </div>
    </div>
  );
}

export default ContentSettings;
